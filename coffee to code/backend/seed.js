require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Room = require('./models/Room');
const Event = require('./models/Event');
const Complaint = require('./models/Complaint');
const LostFound = require('./models/LostFound');
const Attendance = require('./models/Attendance');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_mgmt';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB. Starting database seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      Event.deleteMany({}),
      Complaint.deleteMany({}),
      LostFound.deleteMany({}),
      Attendance.deleteMany({}),
    ]);
    console.log('Cleared existing collections.');

    // 1. Seed Users
    const hashedPwd = await bcrypt.hash('demo1234', 10);
    const users = await User.insertMany([
      {
        name: 'Alice Johnson',
        email: 'student@campus.edu',
        password: 'demo1234', // Pre-save hook hashes or we pass hashed
        role: 'student',
        department: 'Computer Science & Engineering',
        block: 'A',
        rollNumber: 'CS2021001',
        phone: '+1 (555) 019-2831',
      },
      {
        name: 'Dr. Robert Singh',
        email: 'faculty@campus.edu',
        password: 'demo1234',
        role: 'faculty',
        department: 'Computer Science & Engineering',
        block: 'B',
        phone: '+1 (555) 018-9921',
      },
      {
        name: 'Admin Kumar',
        email: 'admin@campus.edu',
        password: 'demo1234',
        role: 'admin',
        department: 'Campus Administration',
        block: 'Admin',
        phone: '+1 (555) 010-4412',
      },
    ]);
    console.log(`Seeded ${users.length} demo users.`);

    const studentUser = users[0];
    const facultyUser = users[1];
    const adminUser = users[2];

    // 2. Seed Rooms
    const rooms = await Room.insertMany([
      {
        room_number: 'A-101',
        name: 'Computing & AI Lab',
        block: 'A',
        floor: 1,
        capacity: 45,
        type: 'lab',
        current_status: 'available',
        amenities: ['Workstations', 'High-Speed LAN', 'Smart Screen', 'Air Conditioning'],
      },
      {
        room_number: 'A-204',
        name: 'Algorithms Lecture Hall',
        block: 'A',
        floor: 2,
        capacity: 90,
        type: 'classroom',
        current_status: 'occupied',
        amenities: ['Dual Projectors', 'Wireless Mic', 'Surround Audio', 'Air Conditioning'],
      },
      {
        room_number: 'A-301',
        name: 'Embedded Systems Lab',
        block: 'A',
        floor: 3,
        capacity: 35,
        type: 'lab',
        current_status: 'available',
        amenities: ['Oscilloscopes', 'Soldering Stations', 'Projector'],
      },
      {
        room_number: 'B-102',
        name: 'Quantum Science Seminar Hall',
        block: 'B',
        floor: 1,
        capacity: 120,
        type: 'seminar',
        current_status: 'booked',
        amenities: ['Tiered Seating', 'Stage', 'Video Conferencing', 'Air Conditioning'],
      },
      {
        room_number: 'B-205',
        name: 'Biotech Research Center',
        block: 'B',
        floor: 2,
        capacity: 30,
        type: 'lab',
        current_status: 'available',
        amenities: ['Microscopes', 'Fume Hoods', 'Workbenches'],
      },
      {
        room_number: 'C-101',
        name: 'Innovation & Design Studio',
        block: 'C',
        floor: 1,
        capacity: 50,
        type: 'classroom',
        current_status: 'available',
        amenities: ['Modular Desks', 'Whiteboards', '4K Displays'],
      },
      {
        room_number: 'C-201',
        name: 'Auditorium Magna',
        block: 'C',
        floor: 2,
        capacity: 450,
        type: 'auditorium',
        current_status: 'available',
        amenities: ['Theatrical Lighting', 'Concert Audio', 'Green Room', 'Dual Screens'],
      },
    ]);
    console.log(`Seeded ${rooms.length} campus rooms.`);

    // 3. Seed Events
    const events = await Event.insertMany([
      {
        title: 'Annual Campus Hackathon 2026',
        description: '36-hour cross-disciplinary hackathon bringing together students and mentors to build smart infrastructure solutions.',
        organizer: facultyUser._id,
        room_id: rooms[0]._id,
        block: 'A',
        time_start: new Date(Date.now() + 86400000 * 2), // 2 days later
        time_end: new Date(Date.now() + 86400000 * 3.5),
        capacity: 120,
        attendees: [studentUser._id],
        category: 'academic',
        status: 'upcoming',
      },
      {
        title: 'AI in Robotics Keynote & Demo',
        description: 'Guest lecture featuring robotics researchers demonstrating autonomous campus delivery rovers.',
        organizer: facultyUser._id,
        room_id: rooms[3]._id,
        block: 'B',
        time_start: new Date(Date.now() + 86400000 * 5),
        time_end: new Date(Date.now() + 86400000 * 5 + 7200000),
        capacity: 120,
        attendees: [studentUser._id],
        category: 'workshop',
        status: 'upcoming',
      },
      {
        title: 'Campus Spring Culture Fest',
        description: 'Music performances, tech exhibits, and art installations across Block C and Central Lawn.',
        organizer: adminUser._id,
        room_id: rooms[6]._id,
        block: 'C',
        time_start: new Date(Date.now() + 86400000 * 10),
        time_end: new Date(Date.now() + 86400000 * 11),
        capacity: 400,
        attendees: [],
        category: 'cultural',
        status: 'upcoming',
      },
    ]);
    console.log(`Seeded ${events.length} campus events.`);

    // 4. Seed Complaints
    const complaints = await Complaint.insertMany([
      {
        user_id: studentUser._id,
        title: 'AC unit dripping water in Lab 3A',
        description: 'The ceiling air conditioner in Lab 3A has a small condensate leak near desk 12.',
        department: 'maintenance',
        block: 'A',
        room_id: rooms[0]._id,
        priority: 'medium',
        status: 'in_progress',
        admin_notes: 'Technician dispatched for drain line clearance.',
      },
      {
        user_id: studentUser._id,
        title: 'Slow Wi-Fi connectivity in Science Block 2nd Floor',
        description: 'Students experiencing repeated packet drops and buffering on eduroam hotspot B2-AP4.',
        department: 'it',
        block: 'B',
        priority: 'high',
        status: 'open',
      },
      {
        user_id: facultyUser._id,
        title: 'Projector bulb replacement in A-204',
        description: 'Bulb warning indicator blinking yellow during morning lectures.',
        department: 'maintenance',
        block: 'A',
        room_id: rooms[1]._id,
        priority: 'low',
        status: 'resolved',
        admin_notes: 'Lamp replaced with 5000lm laser projector module.',
      },
    ]);
    console.log(`Seeded ${complaints.length} maintenance complaints.`);

    // 5. Seed Lost & Found
    const lostItems = await LostFound.insertMany([
      {
        user_id: studentUser._id,
        type: 'lost',
        title: 'Blue Hydro Flask Water Bottle',
        description: 'Navy blue 32oz Hydro Flask with university stickers, left near table 4 in the Central Hub.',
        category: 'bottles',
        block: 'Amenities',
        location_details: 'Central Library First Floor quiet study wing',
        status: 'active',
      },
      {
        user_id: facultyUser._id,
        type: 'found',
        title: 'Texas Instruments TI-84 Plus Calculator',
        description: 'Black graphing calculator with yellow battery cover found on bench outside Lab 101.',
        category: 'electronics',
        block: 'A',
        location_details: 'Engineering Block A hallway outside room A-101',
        status: 'active',
      },
      {
        user_id: adminUser._id,
        type: 'found',
        title: 'Campus Student ID Card — Alex Rivera',
        description: 'Plastic RFID ID badge handed in at campus security desk.',
        category: 'documents',
        block: 'Admin',
        location_details: 'Admin Tower Security Office Front Desk',
        status: 'claimed',
      },
    ]);
    console.log(`Seeded ${lostItems.length} lost & found items.`);

    // 6. Seed Attendance Session
    const attendanceSession = await Attendance.create({
      session_name: 'CS401: Distributed Systems & Cloud Infrastructure',
      faculty_id: facultyUser._id,
      course_code: 'CS401',
      room_id: rooms[1]._id,
      qr_code: 'QR_CS401_' + Date.now(),
      status: 'active',
      start_time: new Date(),
      expires_at: new Date(Date.now() + 3600000), // 1 hour
      attendees: [
        {
          student_id: studentUser._id,
          timestamp: new Date(),
          method: 'qr',
          status: 'present',
        },
      ],
    });
    console.log(`Seeded active attendance session: ${attendanceSession.session_name}`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('Demo Login Credentials:');
    console.log('  Student:  student@campus.edu  / demo1234');
    console.log('  Faculty:  faculty@campus.edu  / demo1234');
    console.log('  Admin:    admin@campus.edu    / demo1234');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
