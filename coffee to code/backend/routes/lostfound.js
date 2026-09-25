const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');
const LostFound = require('../models/LostFound');

let demoItems = [
  { _id: 'lf1', type: 'lost', category: 'electronics', title: 'Blue HP Laptop', description: 'Left in Lab 3A after the morning session. Has a sticker on the lid.', photo_url: '', location: 'Lab 3A', block: 'A', status: 'active', posted_by: { name: 'Alice Johnson' }, tags: ['laptop', 'hp', 'blue'], createdAt: new Date(Date.now() - 86400000) },
  { _id: 'lf2', type: 'found', category: 'accessories', title: 'Silver Watch', description: 'Found near the cafeteria entrance. Appears to be an analog watch.', photo_url: '', location: 'Cafeteria', block: 'C', status: 'active', posted_by: { name: 'Bob Kumar' }, tags: ['watch', 'silver', 'analog'], createdAt: new Date(Date.now() - 43200000) },
  { _id: 'lf3', type: 'lost', category: 'documents', title: 'ID Card - CS Dept', description: 'Lost my student ID card. Name: Priya Sharma, Roll: CS2021045', photo_url: '', location: 'Block B Corridor', block: 'B', status: 'active', posted_by: { name: 'Priya Sharma' }, tags: ['id', 'card', 'student'], createdAt: new Date(Date.now() - 21600000) },
];

// Simple text similarity matching
function computeSimilarity(item1, item2) {
  if (item1.type === item2.type) return 0; // Both lost or both found — can't match
  const text1 = `${item1.title} ${item1.description} ${(item1.tags || []).join(' ')}`.toLowerCase();
  const text2 = `${item2.title} ${item2.description} ${(item2.tags || []).join(' ')}`.toLowerCase();
  const words1 = new Set(text1.split(/\s+/));
  const words2 = new Set(text2.split(/\s+/));
  const intersection = [...words1].filter(w => words2.has(w) && w.length > 3);
  const union = new Set([...words1, ...words2]);
  return intersection.length / Math.sqrt(union.size);
}

// GET all items
router.get('/', protect, async (req, res) => {
  try {
    const { type, status, block } = req.query;
    let items;
    try {
      const filter = {};
      if (type) filter.type = type;
      if (status) filter.status = status;
      if (block) filter.block = block;
      items = await LostFound.find(filter).populate('posted_by', 'name').sort({ createdAt: -1 });
    } catch {
      items = demoItems.filter(i => {
        if (type && i.type !== type) return false;
        if (status && i.status !== status) return false;
        if (block && i.block !== block) return false;
        return true;
      });
    }
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// POST create new item
router.post('/', protect, async (req, res) => {
  try {
    const { type, category, title, description, location, block, tags, contact_info } = req.body;
    const io = req.app.get('io');
    const userId = req.user._id || req.user.id;

    let item;
    try {
      item = await LostFound.create({
        type, category, title, description, location, block, tags: tags || [], contact_info,
        posted_by: userId, status: 'active'
      });
      await item.populate('posted_by', 'name');
    } catch {
      item = {
        _id: `lf_${Date.now()}`, type, category, title, description, location, block,
        tags: tags || [], contact_info, status: 'active',
        posted_by: { _id: userId, name: req.user.name }, createdAt: new Date()
      };
      demoItems.unshift(item);
    }

    // Check for matches
    let allItems;
    try {
      allItems = await LostFound.find({ status: 'active', type: { $ne: type } });
    } catch {
      allItems = demoItems.filter(i => i.status === 'active' && i.type !== type);
    }

    let bestMatch = null;
    let bestScore = 0;
    for (const other of allItems) {
      const score = computeSimilarity(item, other);
      if (score > bestScore) { bestScore = score; bestMatch = other; }
    }

    if (bestMatch && bestScore > 0.15) {
      // Notify both users of potential match
      await NotificationEngine.publish(io, {
        source_module: 'lostfound',
        type: 'info',
        title: '🔍 Potential Match Found!',
        message: `Your ${type} item "${title}" may match a ${bestMatch.type} item: "${bestMatch.title}"`,
        target_user: userId,
        data: { item_id: item._id, match_id: bestMatch._id, score: bestScore },
      });
      const matchOwner = bestMatch.posted_by?._id || bestMatch.posted_by;
      if (matchOwner && String(matchOwner) !== String(userId)) {
        await NotificationEngine.publish(io, {
          source_module: 'lostfound',
          type: 'info',
          title: '🔍 Potential Match Found!',
          message: `Your ${bestMatch.type} item "${bestMatch.title}" may match a ${type} item: "${title}"`,
          target_user: matchOwner,
          data: { item_id: bestMatch._id, match_id: item._id, score: bestScore },
        });
      }
    }

    res.status(201).json({ item, match: bestMatch, matchScore: bestScore });
  } catch (err) {
    console.error('Lost/Found post error:', err);
    res.status(500).json({ message: 'Error posting item' });
  }
});

// PUT update item status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    let item;
    try {
      item = await LostFound.findByIdAndUpdate(req.params.id, { status }, { new: true });
    } catch {
      item = demoItems.find(i => i._id === req.params.id);
      if (item) item.status = status;
    }
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Error updating item' });
  }
});

module.exports = router;
