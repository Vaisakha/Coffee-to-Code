/**
 * SynapseCollab — Modern AI Teammate Matchmaker & Squad Forge Engine
 * Client-side Reactive Architecture with LocalStorage Persistence & Web Audio SFX
 */

/**
 * HTML Escaping Utility to prevent XSS in chat rendering & retro metrics
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// 1. Initial State & Data Definitions
// ---------------------------------------------------------------------------

const DEFAULT_USER = {
  name: "Jordan Drake",
  initials: "JD",
  role: "Frontend Engineer",
  seniority: "Lead",
  avatarColor: "avatar-purple",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "WebSockets"],
  projectType: "AI Agents & LLM Applications",
  desiredRole: "AI / ML Engineer",
  commitment: "Hackathon Sprint (30-40 hrs/wk)",
  timezone: "Americas",
  timezoneStr: "EST (UTC-5)",
  workstyle: "Rapid Prototyper (Ship First, Polish Later)",
  commPref: "Async-First (Notion, Slack, PRs)",
  weeklyHours: 35
};

const INITIAL_TEAMMATES = [
  {
    id: "tm-1",
    name: "Elena Rostova",
    initials: "ER",
    role: "AI / ML Engineer",
    seniority: "Staff AI",
    avatarClass: "avatar-cyan",
    bio: "Ex-DeepMind researcher & hackathon champion (EthGlobal '24 winner). Focused on agentic workflows, fine-tuning Llama-3, and sub-100ms inference pipelines.",
    skills: ["PyTorch", "FastAPI", "LangChain", "Docker", "Python", "vLLM", "CUDA"],
    vibeTags: ["Async-First", "Night Owl", "Rapid Prototyper"],
    commitment: "Hackathon Sprint (30-40 hrs/wk)",
    timezone: "Americas",
    timezoneStr: "EST (UTC-5)",
    weeklyHours: 40,
    rating: 4.98,
    pastHackathons: 9,
    wins: 5,
    portfolioUrl: "github.com/elena-ai-labs",
    radarSkills: { frontend: 35, backend: 92, ai: 99, design: 40, devops: 88 },
    testimonial: "Elena built our entire real-time streaming RAG backend in 18 hours. Absolute 10x teammate."
  },
  {
    id: "tm-2",
    name: "Marcus Vance",
    initials: "MV",
    role: "Backend Architect",
    seniority: "Senior Systems",
    avatarClass: "avatar-purple",
    bio: "Distributed systems nerd. Specializes in ultra-low latency Go & Rust microservices, WebSocket event brokers, and Postgres scaling under heavy load.",
    skills: ["Go", "Rust", "PostgreSQL", "Redis", "Kafka", "Kubernetes", "gRPC"],
    vibeTags: ["Meticulous Architect", "Async-First", "Early Bird"],
    commitment: "Hackathon Sprint (30-40 hrs/wk)",
    timezone: "Americas",
    timezoneStr: "CST (UTC-6)",
    weeklyHours: 35,
    rating: 4.95,
    pastHackathons: 7,
    wins: 3,
    portfolioUrl: "github.com/marcusvance",
    radarSkills: { frontend: 30, backend: 98, ai: 70, design: 25, devops: 96 },
    testimonial: "Marcus's database indexing and gRPC architecture never crashed once during demo traffic spike."
  },
  {
    id: "tm-3",
    name: "Aria Chen",
    initials: "AC",
    role: "UI/UX Product Designer",
    seniority: "Lead Designer",
    avatarClass: "avatar-rose",
    bio: "Product designer obsessed with sleek dark-mode glassmorphism, micro-interactions, and high-conversion demo pitch decks that wow hackathon judges.",
    skills: ["Figma", "Design Systems", "Prototyping", "Tailwind CSS", "Motion Graphics", "User Research"],
    vibeTags: ["Live Voice & Discord", "Rapid Prototyper", "Weekend Warrior"],
    commitment: "Hackathon Sprint (30-40 hrs/wk)",
    timezone: "Americas",
    timezoneStr: "PST (UTC-8)",
    weeklyHours: 30,
    rating: 4.97,
    pastHackathons: 11,
    wins: 6,
    portfolioUrl: "dribbble.com/ariachen",
    radarSkills: { frontend: 75, backend: 20, ai: 45, design: 99, devops: 20 },
    testimonial: "Aria turned our messy tech prototype into a multi-million-dollar looking Apple-grade product."
  },
  {
    id: "tm-4",
    name: "Devon Okafor",
    initials: "DO",
    role: "Full-Stack Developer",
    seniority: "Senior Full-Stack",
    avatarClass: "avatar-emerald",
    bio: "Swiss-army-knife builder. Can spin up tRPC + Next.js + Supabase stacks with Stripe integrations and serverless functions in a single sitting.",
    skills: ["TypeScript", "Next.js", "Node.js", "Supabase", "GraphQL", "Tailwind CSS", "Postgres"],
    vibeTags: ["Rapid Prototyper", "Async-First", "Flexible Hours"],
    commitment: "Part-time (10-20 hrs/wk)",
    timezone: "Europe",
    timezoneStr: "GMT (UTC+0)",
    weeklyHours: 20,
    rating: 4.91,
    pastHackathons: 6,
    wins: 2,
    portfolioUrl: "github.com/devonokafor",
    radarSkills: { frontend: 90, backend: 88, ai: 60, design: 70, devops: 78 },
    testimonial: "Devon handles glue code and API integrations at lightning speed."
  },
  {
    id: "tm-5",
    name: "Siddharth Rao",
    initials: "SR",
    role: "AI / ML Engineer",
    seniority: "Computer Vision Spec",
    avatarClass: "avatar-amber",
    bio: "PhD candidate in Multimodal ML. Expert in OpenCV, diffusion models, 3D Gaussian splatting, and on-device WebGPU machine learning models.",
    skills: ["PyTorch", "WebGPU", "Diffusion Models", "Transformers", "Python", "ONNX", "OpenCV"],
    vibeTags: ["Night Owl", "Meticulous Architect", "Async-First"],
    commitment: "Hackathon Sprint (30-40 hrs/wk)",
    timezone: "Asia",
    timezoneStr: "IST (UTC+5:30)",
    weeklyHours: 35,
    rating: 4.94,
    pastHackathons: 8,
    wins: 4,
    portfolioUrl: "github.com/siddharth-vision",
    radarSkills: { frontend: 40, backend: 80, ai: 97, design: 35, devops: 82 },
    testimonial: "Siddharth got an image generation model running in-browser with zero latency."
  },
  {
    id: "tm-6",
    name: "Chloe Tremblay",
    initials: "CT",
    role: "Mobile / iOS / Android",
    seniority: "Staff Mobile",
    avatarClass: "avatar-cyan",
    bio: "Native iOS (SwiftUI) & React Native wizard. Crafted apps with over 2M downloads on App Store. Loves smooth 120fps gesture-driven interfaces.",
    skills: ["Swift", "SwiftUI", "React Native", "Expo", "Kotlin", "CoreML", "Firebase"],
    vibeTags: ["Live Voice & Discord", "Rapid Prototyper", "Early Bird"],
    commitment: "Part-time (10-20 hrs/wk)",
    timezone: "Americas",
    timezoneStr: "EST (UTC-5)",
    weeklyHours: 20,
    rating: 4.90,
    pastHackathons: 5,
    wins: 2,
    portfolioUrl: "github.com/chloetremblay",
    radarSkills: { frontend: 92, backend: 60, ai: 55, design: 85, devops: 65 },
    testimonial: "Chloe had our React Native build running on testflight in 3 hours."
  },
  {
    id: "tm-7",
    name: "Mateo Silva",
    initials: "MS",
    role: "Backend Architect",
    seniority: "Cloud & DevOps Lead",
    avatarClass: "avatar-purple",
    bio: "Infrastructure architect who treats downtime as a personal offense. Automated CI/CD, Terraform, multi-region database replication, and serverless compute.",
    skills: ["Rust", "Docker", "AWS", "Terraform", "Elixir", "PostgreSQL", "Cloudflare Workers"],
    vibeTags: ["Async-First", "Meticulous Architect", "Day Owl"],
    commitment: "Casual (5-10 hrs/wk)",
    timezone: "Americas",
    timezoneStr: "BRT (UTC-3)",
    weeklyHours: 12,
    rating: 4.88,
    pastHackathons: 4,
    wins: 1,
    portfolioUrl: "github.com/mateosilva",
    radarSkills: { frontend: 30, backend: 96, ai: 50, design: 20, devops: 99 },
    testimonial: "Mateo's automated infrastructure meant zero demo bugs or provisioning downtime."
  },
  {
    id: "tm-8",
    name: "Kavita Patel",
    initials: "KP",
    role: "UI/UX Product Designer",
    seniority: "Design Systems Spec",
    avatarClass: "avatar-rose",
    bio: "Design technologist who codes. Expert in Figma variable systems, typography harmony, Framer motion, and creating viral product presentations.",
    skills: ["Figma", "Framer", "CSS Animation", "Design Systems", "Prototyping", "HTML/CSS"],
    vibeTags: ["Rapid Prototyper", "Live Voice & Discord", "Night Owl"],
    commitment: "Hackathon Sprint (30-40 hrs/wk)",
    timezone: "Asia",
    timezoneStr: "IST (UTC+5:30)",
    weeklyHours: 35,
    rating: 4.96,
    pastHackathons: 10,
    wins: 5,
    portfolioUrl: "behance.net/kavitapatel",
    radarSkills: { frontend: 82, backend: 25, ai: 40, design: 98, devops: 25 },
    testimonial: "Kavita designed and delivered 14 responsive screens before lunch on day one."
  },
  {
    id: "tm-9",
    name: "Liam O'Connor",
    initials: "LO",
    role: "Frontend Engineer",
    seniority: "Creative WebGL Dev",
    avatarClass: "avatar-cyan",
    bio: "Creative developer pushing browser boundaries. Three.js, shaders, interactive 3D canvas experiences, and micro-physics for landing pages that win design awards.",
    skills: ["Three.js", "WebGL", "GSAP", "React", "TypeScript", "GLSL Shaders", "Canvas"],
    vibeTags: ["Rapid Prototyper", "Async-First", "Night Owl"],
    commitment: "Part-time (10-20 hrs/wk)",
    timezone: "Europe",
    timezoneStr: "GMT (UTC+0)",
    weeklyHours: 18,
    rating: 4.92,
    pastHackathons: 6,
    wins: 3,
    portfolioUrl: "github.com/liamoconnor-3d",
    radarSkills: { frontend: 98, backend: 40, ai: 30, design: 90, devops: 50 },
    testimonial: "The 3D interactive hero Liam crafted won us the Best Visual Demo award easily."
  },
  {
    id: "tm-10",
    name: "Zainab Al-Mansoor",
    initials: "ZA",
    role: "AI / ML Engineer",
    seniority: "RL & Fine-tuning Lead",
    avatarClass: "avatar-emerald",
    bio: "Reinforcement learning from human feedback (RLHF) researcher. Specializes in synthetic dataset generation, speculative decoding, and model optimization.",
    skills: ["PyTorch", "HuggingFace", "Python", "Triton", "Ray", "vLLM", "W&B"],
    vibeTags: ["Meticulous Architect", "Async-First", "Flexible Hours"],
    commitment: "Hackathon Sprint (30-40 hrs/wk)",
    timezone: "Europe",
    timezoneStr: "CET (UTC+1)",
    weeklyHours: 35,
    rating: 4.97,
    pastHackathons: 7,
    wins: 4,
    portfolioUrl: "github.com/zainab-ai",
    radarSkills: { frontend: 30, backend: 85, ai: 98, design: 30, devops: 86 },
    testimonial: "Zainab trained a custom reward model that made our agent 3x more coherent."
  }
];

const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "NeuroVoice: Zero-Latency Real-Time Voice Copilot",
    tagline: "An autonomous agent that intercepts customer calls and conducts fluid, emotion-aware voice conversations with sub-200ms latency.",
    category: "ai",
    categoryLabel: "AI & Autonomous Agents",
    event: "Global AI Hackathon ($50,000 Prize Pool)",
    lead: "Elena Rostova",
    openRoles: ["UI/UX Product Designer", "Frontend Engineer"],
    techStack: ["PyTorch", "FastAPI", "WebRTC", "WebSockets", "React"],
    applied: false
  },
  {
    id: "proj-2",
    title: "VeriChain: Autonomous Smart Contract Auditing Agent",
    tagline: "Continuous symbolic analysis & LLM adversarial agent that catches reentrancy and oracle bugs before mainnet deployment.",
    category: "web3",
    categoryLabel: "FinTech & Web3",
    event: "EthGlobal San Francisco ($100,000 Pool)",
    lead: "Marcus Vance",
    openRoles: ["Frontend Engineer", "UI/UX Product Designer"],
    techStack: ["Rust", "Solidity", "Go", "Next.js", "Docker"],
    applied: false
  },
  {
    id: "proj-3",
    title: "DevPulse: Collaborative Spatial IDE for Remote Teams",
    tagline: "Visual multiplayer code canvas where team branches, live micro-services, and cloud logs exist in a shared 3D topology.",
    category: "saas",
    categoryLabel: "Developer Tools & SaaS",
    event: "Product Hunt Makers Hackathon",
    lead: "Aria Chen",
    openRoles: ["AI / ML Engineer", "Backend Architect"],
    techStack: ["Three.js", "TypeScript", "Node.js", "WebSockets", "Rust"],
    applied: false
  },
  {
    id: "proj-4",
    title: "AgriSense: Autonomous Satellite Climate Adaptation",
    tagline: "High-resolution multispectral crop failure prediction delivering actionable irrigation plans to smallholder farmers.",
    category: "health",
    categoryLabel: "HealthTech & GreenTech",
    event: "UN Sustainable Dev Tech Challenge",
    lead: "Siddharth Rao",
    openRoles: ["Full-Stack Developer", "Mobile / iOS / Android"],
    techStack: ["Python", "Computer Vision", "React Native", "PostGIS"],
    applied: false
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: "chat-1",
    teammateId: "tm-1",
    teammateName: "Elena Rostova",
    teammateInitials: "ER",
    role: "AI / ML Engineer",
    matchPct: 98,
    avatarClass: "avatar-cyan",
    unread: 1,
    messages: [
      { sender: "them", text: "Hey Jordan! I saw you are looking for an ML architect for the upcoming AI Hackathon.", time: "10:14 AM" },
      { sender: "them", text: "I have the PyTorch streaming inference pipeline and sub-100ms model ready. We could connect it directly to your React UI!", time: "10:15 AM" }
    ]
  },
  {
    id: "chat-2",
    teammateId: "tm-2",
    teammateName: "Marcus Vance",
    teammateInitials: "MV",
    role: "Backend Architect",
    matchPct: 95,
    avatarClass: "avatar-purple",
    unread: 1,
    messages: [
      { sender: "them", text: "Hi Jordan! Loved your project outline. I specialize in Go/Rust distributed backends and event streams.", time: "Yesterday" },
      { sender: "you", text: "Hey Marcus! Thanks for reaching out. We definitely need a solid backend engineer to handle real-time sync.", time: "Yesterday" }
    ]
  },
  {
    id: "chat-3",
    teammateId: "tm-3",
    teammateName: "Aria Chen",
    teammateInitials: "AC",
    role: "UI/UX Product Designer",
    matchPct: 94,
    avatarClass: "avatar-rose",
    unread: 0,
    messages: [
      { sender: "them", text: "Hey! Ready to build an unforgettable pitch deck and user interface whenever you are ready!", time: "2 days ago" }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "project_accepted",
    category: "project",
    title: "Project Application Accepted! 🎉",
    message: "Elena Rostova accepted your application to join 'NeuroVoice AI' as Frontend Lead. Welcome to the squad!",
    time: "5 mins ago",
    timestamp: Date.now() - 300000,
    read: false,
    avatarClass: "avatar-cyan",
    initials: "ER",
    badgeType: "badge-accepted",
    badgeIcon: "✓",
    actions: [
      { label: "View Project", action: "view_project", payload: "proj-1" },
      { label: "Message Elena", action: "open_chat", payload: "chat-1" }
    ]
  },
  {
    id: "notif-2",
    type: "teammate_accepted",
    category: "teammate",
    title: "Teammate Confirmed! 🤝",
    message: "Marcus Vance accepted your invitation to be your Backend Architect in the Squad Forge!",
    time: "45 mins ago",
    timestamp: Date.now() - 2700000,
    read: false,
    avatarClass: "avatar-purple",
    initials: "MV",
    badgeType: "badge-accepted",
    badgeIcon: "✓",
    actions: [
      { label: "Open Squad Forge", action: "view_squad", payload: "backend" },
      { label: "Chat with Marcus", action: "open_chat", payload: "chat-2" }
    ]
  },
  {
    id: "notif-3",
    type: "candidate_application",
    category: "project",
    title: "New Candidate Application 🚀",
    message: "Aria Chen applied for the 'UI/UX Product Designer' role on your project.",
    time: "2 hours ago",
    timestamp: Date.now() - 7200000,
    read: true,
    avatarClass: "avatar-rose",
    initials: "AC",
    badgeType: "badge-app",
    badgeIcon: "📥",
    actions: [
      { label: "Review Profile", action: "view_profile", payload: "tm-3" },
      { label: "Accept to Squad", action: "accept_candidate", payload: "tm-3" }
    ]
  }
];

// ---------------------------------------------------------------------------
// 2. Sound Effects Engine (Synthesized via Web Audio API)
// ---------------------------------------------------------------------------

class SoundEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch(e) {}
  }

  playChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.06);
        osc.stop(this.ctx.currentTime + i * 0.06 + 0.45);
      });
    } catch(e) {}
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch(e) {}
  }
}

const sfx = new SoundEngine();

// ---------------------------------------------------------------------------
// 3. Application State & Storage
// ---------------------------------------------------------------------------

class AppState {
  constructor() {
    this.user = this.load('synapse_user', DEFAULT_USER);
    this.teammates = this.load('synapse_teammates', INITIAL_TEAMMATES);
    this.projects = this.load('synapse_projects', INITIAL_PROJECTS);
    this.conversations = this.load('synapse_conversations', INITIAL_CONVERSATIONS);
    this.bookmarks = this.load('synapse_bookmarks', ["tm-1"]);
    this.notifications = this.load('synapse_notifications', INITIAL_NOTIFICATIONS);
    this.notifFilter = 'all';
    this.squad = this.load('synapse_squad', {
      design: null,
      frontend: "USER", // User is by default in frontend
      backend: null,
      ai: null
    });
    this.onCallPool = this.load('synapse_oncall', ["tm-1", "tm-2", "tm-3", "tm-9"]);
    this.sosRequests = this.load('synapse_sos_requests', [
      {
        id: "sos-seed-1",
        requesterName: "Marcus Vance",
        vacatedRole: "UI/UX Product Designer",
        slotKey: "design",
        urgencyMins: 60,
        projectContext: "Need design lead to polish dark glassmorphism dashboard before midnight demo",
        status: "filled",
        createdAt: Date.now() - 3600000,
        filledBy: "tm-3"
      }
    ]);
    this.sosFilter = 'all';
    this.activeTab = 'directory';
    this.activeChatId = 'chat-1';
    this.filters = {
      search: '',
      role: 'all',
      commitment: 'all',
      timezone: 'all',
      sort: 'compatibility'
    };
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage quota or error: ", e);
    }
  }

  load(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  updateUser(updates) {
    this.user = { ...this.user, ...updates };
    this.save('synapse_user', this.user);
    this.recomputeAllCompatibilities();
  }

  toggleBookmark(teammateId) {
    if (this.bookmarks.includes(teammateId)) {
      this.bookmarks = this.bookmarks.filter(id => id !== teammateId);
      showToast("Removed from saved teammates");
    } else {
      this.bookmarks.push(teammateId);
      sfx.playPop();
      showToast("Candidate saved to your bookmarks!");
    }
    this.save('synapse_bookmarks', this.bookmarks);
  }

  toggleOnCall(teammateId) {
    const tm = this.teammates.find(t => t.id === teammateId);
    const tmName = tm ? tm.name : "Teammate";
    if (this.onCallPool.includes(teammateId)) {
      this.onCallPool = this.onCallPool.filter(id => id !== teammateId);
      this.save('synapse_oncall', this.onCallPool);
      sfx.playClick();
      showToast(`${tmName} removed from On-Call Pool`);
    } else {
      this.onCallPool.push(teammateId);
      this.save('synapse_oncall', this.onCallPool);
      sfx.playPop();
      showToast(`🚨 ${tmName} is now ON-CALL for emergencies!`);
    }
    if (typeof updateSosButtonBadge === 'function') updateSosButtonBadge();
    if (typeof renderSosBoard === 'function') renderSosBoard();
    if (typeof renderTeammatesGrid === 'function') renderTeammatesGrid();
  }

  createSosRequest(data) {
    const slotKey = data.slotKey || getSlotKeyForRole(data.vacatedRole);
    const newReq = {
      id: `sos-${Date.now()}`,
      requesterName: data.requesterName || this.user.name,
      vacatedRole: data.vacatedRole,
      slotKey: slotKey,
      urgencyMins: Number(data.urgencyMins) || 60,
      projectContext: data.projectContext || "Emergency squad vacancy replacement",
      status: 'open',
      createdAt: Date.now(),
      filledBy: null
    };

    this.sosRequests.unshift(newReq);
    this.save('synapse_sos_requests', this.sosRequests);

    // Dramatic broadcast notification
    const onCallCount = this.onCallPool ? this.onCallPool.length : 0;
    this.addNotification({
      id: `notif-sos-${Date.now()}`,
      type: 'sos_broadcast',
      category: 'sos',
      title: `🚨 SOS broadcast sent to ${onCallCount} on-call teammates`,
      message: `Emergency broadcast for ${newReq.vacatedRole} (${newReq.urgencyMins}m urgency). On-call pool alerted with context: "${newReq.projectContext}".`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      avatarClass: 'avatar-rose',
      initials: '🚨',
      badgeType: 'badge-sos',
      badgeIcon: '🚨',
      actions: [
        { label: 'View SOS Board', action: 'view_sos_board', payload: newReq.id },
        { label: 'Squad Forge', action: 'view_squad', payload: newReq.slotKey }
      ]
    });

    if (typeof renderSosBoard === 'function') renderSosBoard();
    if (typeof updateSosButtonBadge === 'function') updateSosButtonBadge();

    // The Demo Moment: simulate on-call candidate accepting after 2.5 seconds
    setTimeout(() => {
      this.simulateSosAcceptance(newReq.id);
    }, 2500);

    return { request: newReq, matches: matchSosCandidates(newReq) };
  }

  simulateSosAcceptance(requestId) {
    const req = this.sosRequests.find(r => r.id === requestId);
    if (!req || req.status === 'filled') return;

    const matches = matchSosCandidates(req);
    const candidate = matches.length > 0 ? matches[0] : (this.teammates.find(t => t.id === 'tm-1') || this.teammates[0]);
    if (!candidate) return;

    req.status = 'filled';
    req.filledBy = candidate.id;
    this.save('synapse_sos_requests', this.sosRequests);

    // Auto-fill candidate into the vacated squad slot
    this.setSquadSlot(req.slotKey, candidate.id);
    if (typeof renderSquadForge === 'function') renderSquadForge();

    // Fire acceptance notification
    this.addNotification({
      id: `notif-sos-acc-${Date.now()}`,
      type: 'sos_accepted',
      category: 'sos',
      title: `✅ ${candidate.name} just accepted your SOS — they're joining as ${req.vacatedRole}`,
      message: `${candidate.name} (${candidate.seniority}) accepted your urgent SOS! They have been plugged into the ${req.slotKey.toUpperCase()} slot in your Squad Forge.`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      avatarClass: candidate.avatarClass,
      initials: candidate.initials,
      badgeType: 'badge-accepted',
      badgeIcon: '✓',
      actions: [
        { label: 'Open Squad Forge', action: 'view_squad', payload: req.slotKey },
        { label: `Chat with ${candidate.name.split(' ')[0]}`, action: 'open_chat_tm', payload: candidate.id }
      ]
    });

    if (typeof renderSosBoard === 'function') renderSosBoard();
    if (typeof renderSosModalResults === 'function') renderSosModalResults(req.id, true);
    if (typeof updateSosButtonBadge === 'function') updateSosButtonBadge();
  }

  setSquadSlot(slotName, teammateId) {
    this.squad[slotName] = teammateId;
    this.save('synapse_squad', this.squad);
  }

  clearSquad() {
    this.squad = {
      design: null,
      frontend: "USER",
      backend: null,
      ai: null
    };
    this.save('synapse_squad', this.squad);
  }

  addNotification(notif) {
    this.notifications.unshift(notif);
    this.save('synapse_notifications', this.notifications);
    sfx.playChime();
    renderNotifications();
    showToast(notif.title);
  }

  markAllNotifsRead() {
    this.notifications.forEach(n => n.read = true);
    this.save('synapse_notifications', this.notifications);
    sfx.playClick();
    renderNotifications();
    showToast("All notifications marked as read");
  }

  clearAllNotifs() {
    this.notifications = [];
    this.save('synapse_notifications', this.notifications);
    sfx.playClick();
    renderNotifications();
    showToast("Notifications cleared");
  }

  markNotifRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save('synapse_notifications', this.notifications);
      renderNotifications();
    }
  }

  // Algorithmic Compatibility Engine Formula
  calculateCompatibility(candidate) {
    const u = this.user;
    const t = candidate;

    let skillScore = 70;
    // 1. Skill Complementarity
    if (u.desiredRole === t.role) {
      skillScore = 96;
    } else if (
      (u.role.includes("Frontend") && (t.role.includes("Backend") || t.role.includes("AI"))) ||
      (u.role.includes("AI") && (t.role.includes("Frontend") || t.role.includes("Full-Stack"))) ||
      (u.role.includes("Backend") && (t.role.includes("Frontend") || t.role.includes("Design")))
    ) {
      skillScore = 92;
    } else if (u.role === t.role) {
      skillScore = 65; // redundant role penalty
    }

    // 2. Pace & Workstyle Harmony
    let workstyleScore = 80;
    if (u.workstyle && t.vibeTags) {
      if (u.workstyle.includes("Rapid") && t.vibeTags.includes("Rapid Prototyper")) {
        workstyleScore += 16;
      }
      if (u.commPref.includes("Async") && t.vibeTags.includes("Async-First")) {
        workstyleScore += 14;
      }
    }
    workstyleScore = Math.min(workstyleScore, 100);

    // 3. Commitment alignment
    let commitScore = 80;
    if (u.commitment === t.commitment) {
      commitScore = 100;
    } else if (u.commitment.includes("Hackathon") && t.commitment.includes("Hackathon")) {
      commitScore = 95;
    } else {
      commitScore = 70;
    }

    // 4. Timezone overlap
    let tzScore = 75;
    if (u.timezone === t.timezone) {
      tzScore = 100;
    } else if ((u.timezone === "Americas" && t.timezone === "Europe") || (u.timezone === "Europe" && t.timezone === "Asia")) {
      tzScore = 85;
    } else {
      tzScore = 68;
    }

    // Weighted Formula: 45% Skill + 25% Pace + 15% Commitment + 15% Timezone
    const finalScore = Math.round(
      (skillScore * 0.45) +
      (workstyleScore * 0.25) +
      (commitScore * 0.15) +
      (tzScore * 0.15)
    );

    // Dynamic reason formulation
    let reason = "";
    if (skillScore >= 90) {
      reason = `Complementary ${t.role} strength with ${t.skills.slice(0, 2).join(' & ')} mastery`;
    } else if (workstyleScore >= 90) {
      reason = `Aligned ${t.vibeTags[0]} pace and timezone overlap`;
    } else {
      reason = `Solid technical versatility and proven track record`;
    }

    return { score: Math.min(finalScore, 99), reason };
  }

  recomputeAllCompatibilities() {
    this.teammates.forEach(tm => {
      const { score, reason } = this.calculateCompatibility(tm);
      tm.computedScore = score;
      tm.computedReason = reason;
    });
  }
}

// ---------------------------------------------------------------------------
// Complementary Role Fit & SOS Candidate Matching
// ---------------------------------------------------------------------------

function getSlotKeyForRole(role) {
  if (!role) return 'backend';
  const r = role.toLowerCase();
  if (r.includes('design') || r.includes('ui') || r.includes('ux')) return 'design';
  if (r.includes('frontend')) return 'frontend';
  if (r.includes('ai') || r.includes('ml')) return 'ai';
  if (r.includes('backend') || r.includes('systems')) return 'backend';
  return 'backend';
}

function getRoleForSlotKey(slotKey) {
  switch (slotKey) {
    case 'design': return 'UI/UX Product Designer';
    case 'frontend': return 'Frontend Engineer';
    case 'backend': return 'Backend Architect';
    case 'ai': return 'AI / ML Engineer';
    default: return 'Backend Architect';
  }
}

// Extracted role complementarity logic
function isComplementaryRoleFit(candidateRole, targetRole) {
  if (!candidateRole || !targetRole) return false;
  if (candidateRole === targetRole) return true;
  const c = candidateRole.toLowerCase();
  const t = targetRole.toLowerCase();
  if (t.includes('frontend')) {
    return c.includes('frontend') || c.includes('full-stack') || c.includes('mobile');
  }
  if (t.includes('backend')) {
    return c.includes('backend') || c.includes('full-stack');
  }
  if (t.includes('ai') || t.includes('ml')) {
    return c.includes('ai') || c.includes('ml');
  }
  if (t.includes('design') || t.includes('ui') || t.includes('ux')) {
    return c.includes('design') || c.includes('product');
  }
  return false;
}

// Matching logic for SOS Mode
function matchSosCandidates(request) {
  const targetRole = request.vacatedRole;
  
  // Filter eligible teammates by complementary role fit
  let matches = state.teammates.filter(tm => isComplementaryRoleFit(tm.role, targetRole));
  if (matches.length === 0) {
    matches = [...state.teammates];
  }

  // Sort by: on-call status first, then computedScore, then weeklyHours
  matches.sort((a, b) => {
    const aOnCall = (state.onCallPool && state.onCallPool.includes(a.id)) ? 1 : 0;
    const bOnCall = (state.onCallPool && state.onCallPool.includes(b.id)) ? 1 : 0;
    if (bOnCall !== aOnCall) return bOnCall - aOnCall;
    if (b.computedScore !== a.computedScore) return b.computedScore - a.computedScore;
    return (b.weeklyHours || 0) - (a.weeklyHours || 0);
  });

  return matches.slice(0, 4);
}

const state = new AppState();
state.recomputeAllCompatibilities();

// ---------------------------------------------------------------------------
// 4. UI Rendering Functions
// ---------------------------------------------------------------------------

function renderTeammatesGrid() {
  const container = document.getElementById('teammatesGrid');
  if (!container) return;

  // Filter candidates
  let list = [...state.teammates];

  // Role filter
  if (state.filters.role !== 'all') {
    list = list.filter(tm => tm.role === state.filters.role);
  }

  // Commitment filter
  if (state.filters.commitment !== 'all') {
    list = list.filter(tm => tm.commitment === state.filters.commitment);
  }

  // Timezone filter
  if (state.filters.timezone !== 'all') {
    list = list.filter(tm => tm.timezone === state.filters.timezone);
  }

  // Search keyword
  if (state.filters.search.trim()) {
    const q = state.filters.search.toLowerCase();
    list = list.filter(tm => 
      tm.name.toLowerCase().includes(q) ||
      tm.role.toLowerCase().includes(q) ||
      tm.bio.toLowerCase().includes(q) ||
      tm.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  // Sort
  if (state.filters.sort === 'compatibility') {
    list.sort((a, b) => b.computedScore - a.computedScore);
  } else if (state.filters.sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (state.filters.sort === 'experience') {
    list.sort((a, b) => b.pastHackathons - a.pastHackathons);
  }

  // Update count badge
  const countEl = document.getElementById('resultsCount');
  if (countEl) {
    countEl.textContent = `Showing ${list.length} compatible candidates`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No teammates match your current filters</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try broadening your skills or timezone criteria.</p>
        <button class="btn btn-primary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(tm => {
    const isBookmarked = state.bookmarks.includes(tm.id);
    const isOnCall = state.onCallPool && state.onCallPool.includes(tm.id);
    const scoreColor = tm.computedScore >= 95 ? '#38bdf8' : (tm.computedScore >= 85 ? '#818cf8' : '#34d399');

    return `
      <div class="teammate-card ${isBookmarked ? 'bookmarked' : ''}" data-id="${tm.id}">
        <div class="card-top-row">
          <div class="user-identity">
            <div class="avatar-wrapper">
              <div class="avatar-circle ${tm.avatarClass}">${tm.initials}</div>
              <span class="online-indicator" title="Active in community"></span>
            </div>
            <div class="identity-meta">
              <div class="candidate-name-row">
                <h3 class="candidate-name">${tm.name}</h3>
                <span class="seniority-pill">${tm.seniority}</span>
                ${isOnCall ? '<span class="badge-oncall" title="Enlisted in On-Call Emergency Pool">🚨 On-Call</span>' : ''}
              </div>
              <span class="candidate-role">${tm.role}</span>
            </div>
          </div>

          <div class="match-gauge-badge" style="border-color: ${scoreColor}55;">
            <span class="match-pct" style="color: ${scoreColor};">${tm.computedScore}%</span>
            <span class="match-lbl">Match</span>
          </div>
        </div>

        <div class="match-reason-box">
          ⚡ <strong>Compatibility:</strong> ${tm.computedReason}
        </div>

        <p class="card-bio">${tm.bio}</p>

        <div class="card-skills-row">
          ${tm.skills.map((skill, i) => `
            <span class="skill-tag ${i < 3 ? 'complementary' : ''}">${skill}</span>
          `).join('')}
        </div>

        <div class="card-vibe-row">
          ${tm.vibeTags.map(tag => `
            <span class="vibe-tag">#${tag}</span>
          `).join('')}
        </div>

        <div class="card-meta-footer">
          <div class="meta-col">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${tm.timezoneStr}</span>
          </div>
          <div class="meta-col">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>${tm.weeklyHours}h / wk</span>
          </div>
          <div class="meta-col">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>${tm.rating} (${tm.wins} wins)</span>
          </div>
        </div>

        <div class="card-actions-row">
          <button class="btn-bookmark ${isBookmarked ? 'active' : ''}" onclick="handleBookmarkClick('${tm.id}')" title="Save teammate">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button class="btn btn-outline btn-sm" onclick="openProfileModal('${tm.id}')">
            View Profile
          </button>
          <button class="btn btn-primary btn-sm btn-glow" onclick="handleQuickAddToSquad('${tm.id}')">
            + Squad
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderSquadForge() {
  const slots = ['design', 'frontend', 'backend', 'ai'];
  let filledCount = 0;

  slots.forEach(slotKey => {
    const slotBody = document.getElementById(`slotBody-${slotKey}`);
    const slotParent = document.getElementById(`slot-${slotKey}`);
    const candidateId = state.squad[slotKey];

    if (!slotBody || !slotParent) return;

    if (slotKey === 'frontend' && candidateId === "USER") {
      filledCount++;
      slotParent.className = 'squad-slot filled';
      slotBody.innerHTML = `
        <div class="slot-card-content user-lead-card">
          <div class="slot-card-header">
            <div class="avatar-circle-sm avatar-purple">${state.user.initials}</div>
            <div class="slot-card-info">
              <h4 class="slot-candidate-name">${state.user.name} <span class="badge-creator">YOU</span></h4>
              <span class="slot-candidate-role">${state.user.role}</span>
            </div>
          </div>
          <div class="slot-card-skills">
            ${state.user.skills.map(s => `<span class="skill-tag-sm">${s}</span>`).join('')}
          </div>
          <div class="slot-card-footer">
            <span class="slot-stat">${state.user.timezoneStr}</span>
            <span class="slot-stat">${state.user.weeklyHours}h/wk</span>
          </div>
        </div>
      `;
    } else if (candidateId) {
      filledCount++;
      const tm = state.teammates.find(t => t.id === candidateId);
      if (tm) {
        slotParent.className = 'squad-slot filled';
        slotBody.innerHTML = `
          <div class="slot-card-content">
            <div class="slot-card-header">
              <div class="avatar-circle-sm ${tm.avatarClass}">${tm.initials}</div>
              <div class="slot-card-info">
                <h4 class="slot-candidate-name">${tm.name}</h4>
                <span class="slot-candidate-role">${tm.role}</span>
              </div>
            </div>
            <div class="slot-card-skills">
              ${tm.skills.slice(0, 4).map(s => `<span class="skill-tag-sm">${s}</span>`).join('')}
            </div>
            <div class="slot-card-footer">
              <span class="slot-stat">${tm.timezoneStr} • ${tm.weeklyHours}h</span>
              <button class="btn btn-outline btn-xs" onclick="handleRemoveFromSlot('${slotKey}')" style="color: #f43f5e;">Remove</button>
            </div>
          </div>
        `;
      }
    } else {
      slotParent.className = 'squad-slot';
      const roleTarget = slotKey === 'design' ? 'UI/UX Product Designer' : (slotKey === 'backend' ? 'Backend Architect' : (slotKey === 'frontend' ? 'Frontend Engineer' : 'AI / ML Engineer'));
      const icon = slotKey === 'design' ? '🎨' : (slotKey === 'backend' ? '⚙️' : (slotKey === 'frontend' ? '💻' : '🧠'));
      slotBody.innerHTML = `
        <div class="empty-slot-placeholder">
          <div class="empty-slot-icon">${icon}</div>
          <div class="empty-slot-text">No ${slotKey.toUpperCase()} Assigned</div>
          <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-top: 0.5rem;">
            <button class="btn btn-outline btn-xs pick-candidate-btn" onclick="autoAssignRole('${roleTarget}', '${slotKey}')">Assign Top Match</button>
            <button class="btn btn-danger-outline btn-xs" onclick="openSosModal('${roleTarget}')">🚨 SOS Sub</button>
          </div>
        </div>
      `;
    }
  });

  // Update Nav Squad Counter
  const navSquadCount = document.getElementById('navSquadCount');
  if (navSquadCount) navSquadCount.textContent = `${filledCount}/4`;

  // Calculate Squad Synergy & Metrics
  calculateSquadAnalytics(filledCount);
}

function calculateSquadAnalytics(filledCount) {
  // Score based on filled roles
  let synergy = 25;
  let techCoverage = 35;
  let tzOverlap = 3.5;
  let workstyleScore = 80;

  if (filledCount === 2) {
    synergy = 58;
    techCoverage = 60;
    tzOverlap = 4.5;
    workstyleScore = 85;
  } else if (filledCount === 3) {
    synergy = 82;
    techCoverage = 80;
    tzOverlap = 5.2;
    workstyleScore = 92;
  } else if (filledCount === 4) {
    synergy = 98;
    techCoverage = 96;
    tzOverlap = 6.0;
    workstyleScore = 97;
  }

  // Update DOM Elements
  const synergyScoreEl = document.getElementById('squadSynergyScore');
  const synergyCircleEl = document.getElementById('squadSynergyCircle');
  if (synergyScoreEl) synergyScoreEl.textContent = `${synergy}%`;
  if (synergyCircleEl) {
    // Circumference = 2 * PI * 50 = 314.15
    const offset = 314 - (314 * (synergy / 100));
    synergyCircleEl.style.strokeDashoffset = offset;
    synergyCircleEl.style.stroke = synergy >= 90 ? '#10b981' : (synergy >= 60 ? '#6366f1' : '#f59e0b');
  }

  const roleCompEl = document.getElementById('roleCompletenessScore');
  const roleCompBar = document.getElementById('roleCompletenessBar');
  if (roleCompEl) roleCompEl.textContent = `${filledCount} / 4 Roles`;
  if (roleCompBar) roleCompBar.style.width = `${(filledCount / 4) * 100}%`;

  const techCovEl = document.getElementById('techCoverageScore');
  const techCovBar = document.getElementById('techCoverageBar');
  if (techCovEl) techCovEl.textContent = `${techCoverage}%`;
  if (techCovBar) techCovBar.style.width = `${techCoverage}%`;

  const tzEl = document.getElementById('tzOverlapScore');
  const tzBar = document.getElementById('tzOverlapBar');
  if (tzEl) tzEl.textContent = `${tzOverlap} hrs/day`;
  if (tzBar) tzBar.style.width = `${(tzOverlap / 8) * 100}%`;

  const adviceEl = document.getElementById('squadAdviceText');
  const finalizeBtn = document.getElementById('finalizeSquadBtn');
  const generateRetroSidebarBtn = document.getElementById('generateRetroSidebarBtn');
  const openRetroTopBtn = document.getElementById('openRetroTopBtn');

  if (filledCount === 4) {
    if (adviceEl) adviceEl.textContent = "🏆 Dream Squad complete! Perfect balance across UI/UX, Frontend, Backend & AI. Ready to dominate hackathons.";
    if (finalizeBtn) finalizeBtn.removeAttribute('disabled');
    if (generateRetroSidebarBtn) generateRetroSidebarBtn.classList.remove('hidden');
    if (openRetroTopBtn) openRetroTopBtn.classList.remove('hidden');
  } else if (filledCount === 3) {
    if (adviceEl) adviceEl.textContent = "Almost there! Fill your last empty role slot to reach maximum squad synergy.";
    if (finalizeBtn) finalizeBtn.setAttribute('disabled', 'true');
    if (generateRetroSidebarBtn) generateRetroSidebarBtn.classList.add('hidden');
    if (openRetroTopBtn) openRetroTopBtn.classList.add('hidden');
  } else {
    if (adviceEl) adviceEl.textContent = "Add complementary engineers and designers to achieve cross-functional execution power.";
    if (finalizeBtn) finalizeBtn.setAttribute('disabled', 'true');
    if (generateRetroSidebarBtn) generateRetroSidebarBtn.classList.add('hidden');
    if (openRetroTopBtn) openRetroTopBtn.classList.add('hidden');
  }
}

function renderProjectsGrid() {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  container.innerHTML = state.projects.map(proj => `
    <div class="project-card" data-cat="${proj.category}">
      <span class="project-category-badge">${proj.categoryLabel}</span>
      <h3 class="project-title">${proj.title}</h3>
      <p class="project-pitch">${proj.tagline}</p>

      <div class="project-event-row">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span><strong>Target:</strong> ${proj.event}</span>
      </div>

      <div class="open-roles-section">
        <span class="open-roles-label">Seeking Teammates For:</span>
        <div class="open-roles-list">
          ${proj.openRoles.map(role => `
            <span class="role-badge-open">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              ${role}
            </span>
          `).join('')}
        </div>
      </div>

      <div class="project-card-footer">
        <div class="creator-info">
          <span>Project Lead: <strong>${proj.lead}</strong></span>
        </div>
        <button class="btn ${proj.applied ? 'btn-secondary' : 'btn-primary btn-glow'} btn-sm" onclick="handleApplyToProject('${proj.id}')">
          ${proj.applied ? '✓ Application Sent' : 'Apply to Join'}
        </button>
      </div>
    </div>
  `).join('');
}

function renderChatThreads() {
  const container = document.getElementById('chatThreadsList');
  if (!container) return;

  container.innerHTML = state.conversations.map(chat => {
    const isActive = chat.id === state.activeChatId;
    const lastMsg = chat.messages[chat.messages.length - 1];

    return `
      <div class="chat-thread-item ${isActive ? 'active' : ''}" onclick="selectChatThread('${chat.id}')">
        <div class="thread-avatar">
          <div class="avatar-circle-sm ${chat.avatarClass}">${chat.teammateInitials}</div>
        </div>
        <div class="thread-info">
          <div class="thread-name-row">
            <span class="thread-name">${escapeHtml(chat.teammateName)}</span>
            <span class="thread-time">${lastMsg ? escapeHtml(lastMsg.time) : ''}</span>
          </div>
          <div class="thread-preview">${lastMsg ? escapeHtml(lastMsg.text) : 'Start conversation...'}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderActiveChat() {
  const chat = state.conversations.find(c => c.id === state.activeChatId);
  if (!chat) return;

  const headerAvatar = document.getElementById('chatActiveAvatar');
  const headerName = document.getElementById('chatActiveName');
  const stream = document.getElementById('chatMessagesStream');

  if (headerAvatar) {
    headerAvatar.className = `avatar-circle-sm ${chat.avatarClass}`;
    headerAvatar.textContent = chat.teammateInitials;
  }
  if (headerName) headerName.textContent = chat.teammateName;

  if (stream) {
    stream.innerHTML = chat.messages.map(msg => `
      <div class="chat-msg ${msg.sender === 'you' ? 'outgoing' : 'incoming'}">
        <div class="msg-bubble">${escapeHtml(msg.text)}</div>
        <span class="msg-time">${escapeHtml(msg.time)}</span>
      </div>
    `).join('');
    stream.scrollTop = stream.scrollHeight;
  }
}

function renderBookmarksDrawer() {
  const container = document.getElementById('bookmarksList');
  const badge = document.getElementById('bookmarkCount');
  if (badge) badge.textContent = state.bookmarks.length;

  if (!container) return;

  const savedList = state.teammates.filter(tm => state.bookmarks.includes(tm.id));

  if (savedList.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-dim);">
        <p>No saved teammates yet.</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Click the bookmark ribbon on any teammate card to save them here for quick squad invites.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = savedList.map(tm => `
    <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <div class="avatar-circle-sm ${tm.avatarClass}">${tm.initials}</div>
        <div>
          <h5 style="font-size: 0.9rem; margin-bottom: 2px;">${tm.name}</h5>
          <span style="font-size: 0.75rem; color: #818cf8;">${tm.role}</span>
        </div>
      </div>
      <div style="display: flex; gap: 0.35rem;">
        <button class="btn btn-primary btn-xs" onclick="handleQuickAddToSquad('${tm.id}')">+ Squad</button>
        <button class="btn btn-outline btn-xs" onclick="openProfileModal('${tm.id}')">View</button>
      </div>
    </div>
  `).join('');
}

function renderNotifications() {
  const container = document.getElementById('notifListStream');
  const badge = document.getElementById('notifUnreadBadge');
  const pulse = document.getElementById('notifPulse');
  const headerCount = document.getElementById('notifHeaderCount');

  const unreadCount = state.notifications.filter(n => !n.read).length;

  if (badge) {
    badge.textContent = unreadCount;
    if (unreadCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  if (pulse) {
    if (unreadCount > 0) {
      pulse.classList.remove('hidden');
    } else {
      pulse.classList.add('hidden');
    }
  }

  if (headerCount) {
    headerCount.textContent = `${unreadCount} New`;
  }

  if (!container) return;

  let list = state.notifications;
  if (state.notifFilter === 'project') {
    list = list.filter(n => n.category === 'project');
  } else if (state.notifFilter === 'teammate') {
    list = list.filter(n => n.category === 'teammate');
  } else if (state.notifFilter === 'sos') {
    list = list.filter(n => n.category === 'sos');
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-dim);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔔</div>
        <p style="font-size: 0.85rem;">No notifications in this category</p>
        <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 4px;">You'll receive live alerts here when projects accept you or teammates agree.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(n => `
    <div class="notif-item ${!n.read ? 'unread' : ''}" onclick="handleNotifItemClick('${n.id}')">
      <div class="notif-item-avatar">
        <div class="avatar-circle-sm ${n.avatarClass}">${n.initials}</div>
        <span class="notif-status-badge ${n.badgeType}">${n.badgeIcon}</span>
      </div>
      <div class="notif-item-body">
        <div class="notif-item-header">
          <span class="notif-item-title">
            ${n.title}
            ${!n.read ? '<span class="status-dot" style="width: 6px; height: 6px;"></span>' : ''}
          </span>
          <span class="notif-item-time">${n.time}</span>
        </div>
        <p class="notif-item-desc">${n.message}</p>
        <div class="notif-item-actions">
          ${(n.actions || []).map(act => `
            <button class="btn btn-outline btn-xs" onclick="event.stopPropagation(); executeNotifAction('${n.id}', '${act.action}', '${act.payload}')">
              ${act.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function handleNotifItemClick(id) {
  state.markNotifRead(id);
}

function executeNotifAction(notifId, actionType, payload) {
  if (notifId) state.markNotifRead(notifId);
  const dropdown = document.getElementById('notifDropdown');
  if (dropdown) dropdown.classList.add('hidden');

  if (actionType === 'view_project') {
    switchTab('projects');
    const projSec = document.getElementById('projectsSection');
    if (projSec) projSec.scrollIntoView({ behavior: 'smooth' });
    sfx.playClick();
  } else if (actionType === 'view_squad') {
    switchTab('forge');
    const forgeSec = document.getElementById('forgeSection');
    if (forgeSec) forgeSec.scrollIntoView({ behavior: 'smooth' });
    sfx.playClick();
  } else if (actionType === 'view_sos_board') {
    switchTab('sos');
    const sosSec = document.getElementById('sosSection');
    if (sosSec) sosSec.scrollIntoView({ behavior: 'smooth' });
    sfx.playClick();
  } else if (actionType === 'open_chat') {
    switchTab('lounge');
    selectChatThread(payload);
    const loungeSec = document.getElementById('loungeSection');
    if (loungeSec) loungeSec.scrollIntoView({ behavior: 'smooth' });
  } else if (actionType === 'open_chat_tm') {
    startDirectChat(payload);
  } else if (actionType === 'view_profile') {
    openProfileModal(payload);
  } else if (actionType === 'accept_candidate') {
    handleQuickAddToSquad(payload);
    showToast("Candidate accepted and slotted into your Squad Forge!");
  }
}

// ---------------------------------------------------------------------------
// 5. User Interaction Handlers & Modals
// ---------------------------------------------------------------------------

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const isEmergency = message.includes('🚨') || message.includes('SOS');
  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isEmergency) {
    toast.style.borderColor = 'rgba(244, 63, 94, 0.6)';
    toast.style.background = 'linear-gradient(135deg, rgba(24, 18, 28, 0.98) 0%, rgba(36, 16, 24, 0.95) 100%)';
    toast.style.boxShadow = '0 0 20px rgba(244, 63, 94, 0.35)';
  }
  const icon = isEmergency ? '🚨' : '✨';
  const cleanMsg = message.replace(/^[🔔🚨✨]\s*/, '');
  toast.innerHTML = `<span>${icon}</span><span>${cleanMsg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function handleBookmarkClick(tmId) {
  state.toggleBookmark(tmId);
  renderTeammatesGrid();
  renderBookmarksDrawer();
}

function handleQuickAddToSquad(tmId) {
  const tm = state.teammates.find(t => t.id === tmId);
  if (!tm) return;

  let assignedSlot = null;
  if (tm.role.includes("Design") && !state.squad.design) assignedSlot = 'design';
  else if (tm.role.includes("AI") && !state.squad.ai) assignedSlot = 'ai';
  else if (tm.role.includes("Backend") && !state.squad.backend) assignedSlot = 'backend';
  else if (!state.squad.ai) assignedSlot = 'ai';
  else if (!state.squad.backend) assignedSlot = 'backend';
  else if (!state.squad.design) assignedSlot = 'design';

  if (assignedSlot) {
    state.setSquadSlot(assignedSlot, tm.id);
    sfx.playChime();
    showToast(`Added ${tm.name} to Squad ${assignedSlot.toUpperCase()} slot!`);
    renderSquadForge();

    // Notify: teammate added
    state.addNotification({
      id: `notif-squad-${tmId}-${Date.now()}`,
      type: 'teammate_accepted',
      category: 'teammate',
      title: 'Teammate Confirmed! 🤝',
      message: `${tm.name} has been added to your Squad as ${tm.role} (${assignedSlot.toUpperCase()} slot). Squad synergy updated!`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      avatarClass: tm.avatarClass,
      initials: tm.initials,
      badgeType: 'badge-accepted',
      badgeIcon: '✓',
      actions: [
        { label: 'Open Squad Forge', action: 'view_squad', payload: assignedSlot },
        { label: `Chat with ${tm.name.split(' ')[0]}`, action: 'open_chat_tm', payload: tm.id }
      ]
    });
  } else {
    showToast("Squad slots are full! Clear or replace a slot in the Squad Forge.");
  }
}

function handleRemoveFromSlot(slotKey) {
  state.setSquadSlot(slotKey, null);
  sfx.playClick();
  showToast(`Removed candidate from ${slotKey.toUpperCase()} slot`);
  renderSquadForge();
}

function autoAssignRole(targetRole, slotKey) {
  // Find highest compatible candidate for role
  const matches = state.teammates.filter(t => t.role === targetRole);
  matches.sort((a, b) => b.computedScore - a.computedScore);

  if (matches.length > 0) {
    state.setSquadSlot(slotKey, matches[0].id);
    sfx.playChime();
    showToast(`Assigned top ${targetRole} (${matches[0].name}) to squad!`);
    renderSquadForge();
  }
}

function autoAssembleFullSquad() {
  const bestDesign = state.teammates.find(t => t.role.includes("Design"));
  const bestBackend = state.teammates.find(t => t.role.includes("Backend"));
  const bestAI = state.teammates.find(t => t.role.includes("AI"));

  if (bestDesign) state.setSquadSlot('design', bestDesign.id);
  if (bestBackend) state.setSquadSlot('backend', bestBackend.id);
  if (bestAI) state.setSquadSlot('ai', bestAI.id);

  sfx.playChime();
  showToast("Auto-assembled dream squad with 98% skill synergy!");
  renderSquadForge();
}

function selectChatThread(chatId) {
  state.activeChatId = chatId;
  sfx.playClick();
  renderChatThreads();
  renderActiveChat();
}

function handleApplyToProject(projId) {
  const proj = state.projects.find(p => p.id === projId);
  if (!proj || proj.applied) return;

  proj.applied = true;
  state.save('synapse_projects', state.projects);
  sfx.playChime();
  showToast(`Application submitted to "${proj.title}"! Project lead notified.`);
  renderProjectsGrid();

  // Notify: application sent
  const pendingId = `notif-apply-${projId}-${Date.now()}`;
  state.addNotification({
    id: pendingId,
    type: 'application_sent',
    category: 'project',
    title: 'Application Submitted 🚀',
    message: `Your application to join "${proj.title}" has been sent to ${proj.lead}. Awaiting review...`,
    time: 'Just now',
    timestamp: Date.now(),
    read: false,
    avatarClass: 'avatar-purple',
    initials: state.user.initials,
    badgeType: 'badge-app',
    badgeIcon: '📤',
    actions: [
      { label: 'View Project Board', action: 'view_project', payload: projId }
    ]
  });

  // Simulate project lead acceptance after 4 seconds
  setTimeout(() => {
    const acceptedId = `notif-accepted-${projId}-${Date.now()}`;
    state.addNotification({
      id: acceptedId,
      type: 'project_accepted',
      category: 'project',
      title: 'Project Application Accepted! 🎉',
      message: `${proj.lead} accepted your application to join "${proj.title}"! Welcome to the team!`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      avatarClass: 'avatar-cyan',
      initials: proj.lead.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      badgeType: 'badge-accepted',
      badgeIcon: '✓',
      actions: [
        { label: 'View Project', action: 'view_project', payload: projId },
        { label: 'Open Chat', action: 'open_chat', payload: 'chat-1' }
      ]
    });
  }, 4000);
}

// Open Teammate Detailed Modal
function openProfileModal(tmId) {
  const tm = state.teammates.find(t => t.id === tmId);
  if (!tm) return;

  const modal = document.getElementById('profileModal');
  const content = document.getElementById('profileModalContent');
  if (!modal || !content) return;

  sfx.playClick();
  const isOnCall = state.onCallPool && state.onCallPool.includes(tm.id);

  content.innerHTML = `
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div class="avatar-circle ${tm.avatarClass}" style="width: 68px; height: 68px; font-size: 1.5rem;">${tm.initials}</div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem;">${tm.name}</h2>
            <span class="seniority-pill">${tm.seniority}</span>
            ${isOnCall ? '<span class="badge-oncall">🚨 On-Call</span>' : ''}
          </div>
          <span style="color: #818cf8; font-weight: 600; font-size: 1rem;">${tm.role}</span>
          <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">${tm.timezoneStr} • ${tm.commitment}</div>
        </div>
      </div>
      <div class="match-gauge-badge" style="padding: 0.6rem 1rem;">
        <span class="match-pct" style="font-size: 1.6rem; color: #38bdf8;">${tm.computedScore}%</span>
        <span class="match-lbl">Match Affinity</span>
      </div>
    </div>

    <div class="match-reason-box" style="margin-bottom: 1.25rem; padding: 0.75rem 1rem;">
      <strong>Why You Match:</strong> ${tm.computedReason}. High synergy with your ${state.user.role} background.
    </div>

    <!-- Emergency On-Call Pool Status Toggle -->
    <div class="profile-oncall-strip ${isOnCall ? 'oncall-active' : ''}">
      <div class="oncall-strip-info">
        <div class="oncall-pulse-circle ${isOnCall ? 'active' : ''}"></div>
        <div>
          <div class="oncall-title">
            <span>Emergency On-Call Pool Status:</span>
            <span class="oncall-status-badge ${isOnCall ? 'active' : ''}">
              ${isOnCall ? '🚨 ACTIVE ON-CALL' : '⚪ STANDBY'}
            </span>
          </div>
          <div class="oncall-desc">
            ${isOnCall ? 'Enlisted to rapidly sub into emergency squad vacancies within 1 hour.' : 'Not currently available for emergency SOS drop-ins.'}
          </div>
        </div>
      </div>
      <button class="btn btn-sm ${isOnCall ? 'btn-danger-outline' : 'btn-outline'}" onclick="handleProfileToggleOnCall('${tm.id}')">
        ${isOnCall ? 'Exit On-Call Pool' : '🚨 I\'m On-Call for Emergencies'}
      </button>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.5rem; letter-spacing: 0.05em;">About</h4>
      <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-muted);">${tm.bio}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
      <div>
        <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.75rem; letter-spacing: 0.05em;">Core Competencies</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${tm.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      </div>
      <div>
        <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.75rem; letter-spacing: 0.05em;">Hackathon Track Record</h4>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
            <span style="color: var(--text-muted);">Events Participated:</span>
            <strong>${tm.pastHackathons} Hackathons</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
            <span style="color: var(--text-muted);">Podium Finishes:</span>
            <strong style="color: #10b981;">🏆 ${tm.wins} Wins</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span style="color: var(--text-muted);">Peer Rating:</span>
            <strong style="color: #f59e0b;">★ ${tm.rating} / 5.0</strong>
          </div>
        </div>
      </div>
    </div>

    <div style="background: rgba(99, 102, 241, 0.08); border-left: 3px solid #6366f1; padding: 0.85rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 1.75rem; font-style: italic; font-size: 0.85rem; color: #cbd5e1;">
      "${tm.testimonial}"
      <span style="display: block; font-style: normal; font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;">— Verified Hackathon Teammate Endorsement</span>
    </div>

    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem;">
      <button class="btn btn-outline" onclick="closeProfileModal()">Close</button>
      <button class="btn btn-secondary" onclick="startDirectChat('${tm.id}')">Send Direct Message</button>
      <button class="btn btn-primary btn-glow" onclick="handleQuickAddToSquad('${tm.id}'); closeProfileModal();">Invite to Squad</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.add('hidden');
}

function startDirectChat(tmId) {
  closeProfileModal();
  let thread = state.conversations.find(c => c.teammateId === tmId);
  const tm = state.teammates.find(t => t.id === tmId);

  if (!thread && tm) {
    thread = {
      id: `chat-${Date.now()}`,
      teammateId: tm.id,
      teammateName: tm.name,
      teammateInitials: tm.initials,
      role: tm.role,
      matchPct: tm.computedScore,
      avatarClass: tm.avatarClass,
      unread: 0,
      messages: [
        { sender: 'them', text: `Hi ${state.user.name}! Thanks for reaching out through SynapseCollab. What project are you building?`, time: 'Just now' }
      ]
    };
    state.conversations.unshift(thread);
    state.save('synapse_conversations', state.conversations);
  }

  if (thread) {
    state.activeChatId = thread.id;
    // Switch to Lounge tab
    switchTab('lounge');
    renderChatThreads();
    renderActiveChat();
  }
}

// ---------------------------------------------------------------------------
// 6. AI Matchmaker Wizard Pagination Logic
// ---------------------------------------------------------------------------

let wizardCurrentStep = 1;

function openWizardModal() {
  wizardCurrentStep = 1;
  updateWizardStepView();
  const modal = document.getElementById('wizardModal');
  if (modal) modal.classList.remove('hidden');
  sfx.playClick();
}

function closeWizardModal() {
  const modal = document.getElementById('wizardModal');
  if (modal) modal.classList.add('hidden');
}

function updateWizardStepView() {
  // Update step dots
  document.querySelectorAll('.wizard-step-indicator .step-dot').forEach(dot => {
    const step = parseInt(dot.getAttribute('data-step'), 10);
    if (step <= wizardCurrentStep) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Toggle step panes
  document.querySelectorAll('.wizard-step-pane').forEach((pane, idx) => {
    if (idx + 1 === wizardCurrentStep) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });

  // Step descriptions
  const titleEl = document.getElementById('wizardStepTitle');
  const descEl = document.getElementById('wizardStepDesc');
  const prevBtn = document.getElementById('wizardPrevBtn');
  const nextBtn = document.getElementById('wizardNextBtn');

  if (wizardCurrentStep === 1) {
    if (titleEl) titleEl.textContent = "Step 1: Your Role & Technical Strengths";
    if (descEl) descEl.textContent = "Tell the engine who you are so we can calculate complementary teammate skills.";
    if (prevBtn) prevBtn.style.visibility = 'hidden';
    if (nextBtn) nextBtn.textContent = "Next Step →";
  } else if (wizardCurrentStep === 2) {
    if (titleEl) titleEl.textContent = "Step 2: What Are You Building?";
    if (descEl) descEl.textContent = "Pick the target domain or hackathon track to align project scopes.";
    if (prevBtn) prevBtn.style.visibility = 'visible';
    if (nextBtn) nextBtn.textContent = "Next Step →";
  } else if (wizardCurrentStep === 3) {
    if (titleEl) titleEl.textContent = "Step 3: What Teammates Do You Need?";
    if (descEl) descEl.textContent = "Define the highest-priority missing puzzle piece and expected commitment.";
    if (prevBtn) prevBtn.style.visibility = 'visible';
    if (nextBtn) nextBtn.textContent = "Next Step →";
  } else if (wizardCurrentStep === 4) {
    if (titleEl) titleEl.textContent = "Step 4: Collaboration Rhythm & Workstyle";
    if (descEl) descEl.textContent = "Tune pacing, communication channels, and shipping velocity.";
    if (prevBtn) prevBtn.style.visibility = 'visible';
    if (nextBtn) nextBtn.textContent = "✨ Calibrate & Run Match Engine";
  }
}

function handleWizardNext() {
  if (wizardCurrentStep < 4) {
    wizardCurrentStep++;
    sfx.playClick();
    updateWizardStepView();
  } else {
    // Finish Wizard & Calibrate
    saveWizardPreferences();
    closeWizardModal();
    sfx.playChime();
    showToast("🎯 Teammate compatibility scores recalibrated to your preferences!");
    renderTeammatesGrid();
    renderSquadForge();

    // Scroll to directory
    const dirSection = document.getElementById('directorySection');
    if (dirSection) {
      switchTab('directory');
      dirSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function handleWizardPrev() {
  if (wizardCurrentStep > 1) {
    wizardCurrentStep--;
    sfx.playClick();
    updateWizardStepView();
  }
}

function saveWizardPreferences() {
  const userNameInput = document.getElementById('wzUserName');
  const activeRoleBtn = document.querySelector('#wzUserRoleSelector .select-pill.active');
  const activeTypeCard = document.querySelector('#wzProjectTypeGrid .radio-card.active');
  const activeDesiredRole = document.querySelector('#wzDesiredRoleSelector .select-pill.active');
  const activeCommitment = document.querySelector('#wzCommitmentSelector .select-pill.active');
  const activeWorkstyle = document.querySelector('#wzWorkstyleGrid .radio-card.active');

  const updates = {};
  if (userNameInput && userNameInput.value.trim()) {
    updates.name = userNameInput.value.trim();
    updates.initials = updates.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
  if (activeRoleBtn) updates.role = activeRoleBtn.getAttribute('data-val');
  if (activeTypeCard) updates.projectType = activeTypeCard.getAttribute('data-val');
  if (activeDesiredRole) updates.desiredRole = activeDesiredRole.getAttribute('data-val');
  if (activeCommitment) updates.commitment = activeCommitment.getAttribute('data-val');
  if (activeWorkstyle) updates.workstyle = activeWorkstyle.getAttribute('data-val');

  state.updateUser(updates);

  // Update nav profile text
  const navUserName = document.getElementById('navUserName');
  const navUserRole = document.getElementById('navUserRole');
  const navUserAvatar = document.getElementById('navUserAvatar');
  const profileBadge = document.getElementById('currentUserProfileBadge');

  if (navUserName) navUserName.textContent = `You (${state.user.name.split(' ')[0]})`;
  if (navUserRole) navUserRole.textContent = state.user.role;
  if (navUserAvatar) navUserAvatar.textContent = state.user.initials;
  if (profileBadge) profileBadge.textContent = `${state.user.name} (${state.user.role})`;
}

// ---------------------------------------------------------------------------
// 7. Navigation & Tabs
// ---------------------------------------------------------------------------

function switchTab(tabName) {
  state.activeTab = tabName;

  // Update nav items
  document.querySelectorAll('.nav-links .nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update sections
  document.querySelectorAll('.app-section').forEach(sec => {
    if (sec.id === `${tabName}Section`) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  if (tabName === 'sos' && typeof renderSosBoard === 'function') {
    renderSosBoard();
  }
}

function resetFilters() {
  state.filters.search = '';
  state.filters.role = 'all';
  state.filters.commitment = 'all';
  state.filters.timezone = 'all';
  state.filters.sort = 'compatibility';

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const commitSelect = document.getElementById('filterCommitment');
  const tzSelect = document.getElementById('filterTimezone');
  const sortSelect = document.getElementById('filterSort');

  if (searchInput) searchInput.value = '';
  if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
  if (commitSelect) commitSelect.value = 'all';
  if (tzSelect) tzSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'compatibility';

  document.querySelectorAll('.role-pills .role-pill').forEach(btn => {
    if (btn.getAttribute('data-role') === 'all') btn.classList.add('active');
    else btn.classList.remove('active');
  });

  sfx.playClick();
  renderTeammatesGrid();
}

// ---------------------------------------------------------------------------
// 8. SOS Mode & Emergency Dispatch Functions
// ---------------------------------------------------------------------------

function updateSosButtonBadge() {
  const onCallCount = state.onCallPool ? state.onCallPool.length : 0;
  const onCallPill = document.getElementById('sosHeaderOnCallCount');
  if (onCallPill) {
    onCallPill.textContent = `${onCallCount} On-Call`;
  }
  const modalOnCallPill = document.getElementById('sosModalOnCallPill');
  if (modalOnCallPill) {
    modalOnCallPill.textContent = `${onCallCount} On-Call Engineers`;
  }
  const statOnCall = document.getElementById('sosStatOnCall');
  if (statOnCall) {
    statOnCall.textContent = `${onCallCount} Members`;
  }

  // Count open SOS requests
  const openCount = (state.sosRequests || []).filter(r => r.status === 'open').length;
  const navBadge = document.getElementById('navSosBadge');
  if (navBadge) {
    navBadge.textContent = openCount;
    if (openCount > 0) {
      navBadge.style.animation = 'pulseNotif 1.5s infinite';
    } else {
      navBadge.style.animation = 'none';
    }
  }
}

function openSosModal(preselectedRole) {
  const modal = document.getElementById('sosModal');
  if (!modal) return;

  sfx.playClick();
  updateSosButtonBadge();

  // Reset to form view
  const formView = document.getElementById('sosModalFormView');
  const resultsView = document.getElementById('sosModalResultsView');
  const boardView = document.getElementById('sosModalBoardView');
  const tabForm = document.getElementById('sosTabFormBtn');
  const tabBoard = document.getElementById('sosTabBoardBtn');

  if (formView) formView.classList.remove('hidden');
  if (resultsView) resultsView.classList.add('hidden');
  if (boardView) boardView.classList.add('hidden');
  if (tabForm) tabForm.classList.add('active');
  if (tabBoard) tabBoard.classList.remove('active');

  if (preselectedRole) {
    const roleSelect = document.getElementById('sosVacatedRoleSelect');
    if (roleSelect) {
      roleSelect.value = preselectedRole;
    }
  }

  modal.classList.remove('hidden');
}

function closeSosModal() {
  const modal = document.getElementById('sosModal');
  if (modal) modal.classList.add('hidden');
}

function handleSosFormSubmit() {
  const roleSelect = document.getElementById('sosVacatedRoleSelect');
  const urgencySelect = document.getElementById('sosUrgencySelect');
  const contextInput = document.getElementById('sosContextInput');

  const vacatedRole = roleSelect ? roleSelect.value : 'Backend Architect';
  const selectedOption = roleSelect ? roleSelect.options[roleSelect.selectedIndex] : null;
  const slotKey = selectedOption ? selectedOption.getAttribute('data-slot') : getSlotKeyForRole(vacatedRole);
  const urgencyMins = urgencySelect ? Number(urgencySelect.value) : 60;
  const projectContext = (contextInput && contextInput.value.trim()) ? contextInput.value.trim() : "Emergency squad vacancy replacement";

  // Create request in AppState
  const { request } = state.createSosRequest({
    vacatedRole,
    slotKey,
    urgencyMins,
    projectContext
  });

  // Switch modal view to results / radar
  const formView = document.getElementById('sosModalFormView');
  const resultsView = document.getElementById('sosModalResultsView');
  if (formView) formView.classList.add('hidden');
  if (resultsView) resultsView.classList.remove('hidden');

  renderSosModalResults(request.id, false);
}

function manuallyAcceptSos(requestId, candidateId) {
  const req = state.sosRequests.find(r => r.id === requestId);
  if (!req) return;

  req.status = 'filled';
  req.filledBy = candidateId;
  state.save('synapse_sos_requests', state.sosRequests);

  state.setSquadSlot(req.slotKey, candidateId);
  renderSquadForge();

  const candidate = state.teammates.find(t => t.id === candidateId);
  if (candidate) {
    state.addNotification({
      id: `notif-sos-manual-${Date.now()}`,
      type: 'sos_accepted',
      category: 'sos',
      title: `✅ ${candidate.name} just accepted your SOS — they're joining as ${req.vacatedRole}`,
      message: `${candidate.name} accepted your urgent SOS! They have been placed in your Squad Forge ${req.slotKey.toUpperCase()} slot.`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      avatarClass: candidate.avatarClass,
      initials: candidate.initials,
      badgeType: 'badge-accepted',
      badgeIcon: '✓',
      actions: [
        { label: 'Open Squad Forge', action: 'view_squad', payload: req.slotKey },
        { label: `Chat with ${candidate.name.split(' ')[0]}`, action: 'open_chat_tm', payload: candidate.id }
      ]
    });
  }

  renderSosBoard();
  renderSosModalResults(requestId, true);
  updateSosButtonBadge();
}

function renderSosModalResults(requestId, accepted) {
  const container = document.getElementById('sosModalResultsContent');
  if (!container) return;

  const req = state.sosRequests.find(r => r.id === requestId);
  if (!req) return;

  const matches = matchSosCandidates(req);
  const filledCandidate = req.filledBy ? state.teammates.find(t => t.id === req.filledBy) : (accepted && matches.length > 0 ? matches[0] : null);

  container.innerHTML = `
    <div class="sos-radar-header">
      <div class="sos-radar-animation">
        <span>🚨</span>
      </div>
      <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 0.35rem;">
        ${accepted ? '✅ Emergency Replacement Confirmed!' : '🚨 Broadcasting SOS to On-Call Pool...'}
      </h3>
      <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 500px; margin: 0 auto;">
        ${accepted 
          ? `Instant match accepted and slotted into your Squad Forge (${req.slotKey.toUpperCase()} slot).` 
          : `Actively pinging ${state.onCallPool ? state.onCallPool.length : 0} on-call engineers for ${req.vacatedRole} (${req.urgencyMins}m urgency). Simulating incoming responses...`}
      </p>
    </div>

    ${accepted && filledCandidate ? `
      <div class="sos-accepted-banner">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <div class="avatar-circle-sm ${filledCandidate.avatarClass}">${filledCandidate.initials}</div>
          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 2px;">${filledCandidate.name} Joined Your Squad!</h4>
            <span style="font-size: 0.8rem; color: #10b981; font-weight: 600;">✓ Assigned to ${req.slotKey.toUpperCase()} Slot • ${filledCandidate.role}</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-outline btn-xs" onclick="startDirectChat('${filledCandidate.id}'); closeSosModal();">Open Chat</button>
          <button class="btn btn-primary btn-xs btn-glow" onclick="executeNotifAction(null, 'view_squad', '${req.slotKey}'); closeSosModal();">View Squad Forge</button>
        </div>
      </div>
    ` : ''}

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; margin-bottom: 0.5rem;">
      <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-dim);">
        Instant Matches from On-Call Pool (${matches.length})
      </h4>
      <span style="font-size: 0.78rem; color: #f43f5e; font-weight: 600;">
        ${accepted ? 'Incident Resolved' : '⚡ Auto-Accepting in ~2.5s'}
      </span>
    </div>

    <div class="sos-candidates-grid">
      ${matches.map(tm => {
        const isWinner = filledCandidate && filledCandidate.id === tm.id;
        const isBookmarked = state.bookmarks.includes(tm.id);
        const scoreColor = tm.computedScore >= 95 ? '#38bdf8' : (tm.computedScore >= 85 ? '#818cf8' : '#34d399');
        const isOnCall = state.onCallPool && state.onCallPool.includes(tm.id);

        return `
          <div class="sos-candidate-card-wrap ${isWinner ? 'accepted-winner' : ''}">
            <div class="teammate-card ${isBookmarked ? 'bookmarked' : ''}" data-id="${tm.id}">
              <div class="card-top-row">
                <div class="user-identity">
                  <div class="avatar-wrapper">
                    <div class="avatar-circle ${tm.avatarClass}">${tm.initials}</div>
                    <span class="online-indicator" title="Active now"></span>
                  </div>
                  <div class="identity-meta">
                    <div class="candidate-name-row">
                      <h3 class="candidate-name">${tm.name}</h3>
                      <span class="seniority-pill">${tm.seniority}</span>
                      ${isOnCall ? '<span class="badge-oncall">🚨 On-Call</span>' : ''}
                      ${isWinner ? '<span class="badge-pill" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4);">✓ SQUAD REPLACEMENT</span>' : ''}
                    </div>
                    <span class="candidate-role">${tm.role}</span>
                  </div>
                </div>

                <div class="match-gauge-badge" style="border-color: ${scoreColor}55;">
                  <span class="match-pct" style="color: ${scoreColor};">${tm.computedScore}%</span>
                  <span class="match-lbl">Match</span>
                </div>
              </div>

              <div class="match-reason-box">
                ⚡ <strong>SOS Fit:</strong> ${tm.computedReason}. High availability (${tm.weeklyHours}h/wk) for urgent sprint work.
              </div>

              <div class="card-skills-row">
                ${tm.skills.map((skill, i) => `
                  <span class="skill-tag ${i < 3 ? 'complementary' : ''}">${skill}</span>
                `).join('')}
              </div>

              <div class="card-meta-footer">
                <div class="meta-col">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>${tm.timezoneStr}</span>
                </div>
                <div class="meta-col">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  <span>${tm.weeklyHours}h / wk</span>
                </div>
                <div class="meta-col">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>${tm.rating} (${tm.wins} wins)</span>
                </div>
              </div>

              <div class="card-actions-row">
                ${isWinner ? `
                  <button class="btn btn-primary btn-sm btn-glow" onclick="executeNotifAction(null, 'view_squad', '${req.slotKey}'); closeSosModal();">
                    ✓ Slotted in Squad Forge (${req.slotKey.toUpperCase()})
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="startDirectChat('${tm.id}'); closeSosModal();">
                    Message Now
                  </button>
                ` : `
                  <button class="btn btn-outline btn-sm" onclick="openProfileModal('${tm.id}')">
                    View Profile
                  </button>
                  <button class="btn btn-sos btn-sm btn-glow" onclick="manuallyAcceptSos('${req.id}', '${tm.id}')">
                    Accept as Sub
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
      <button class="btn btn-outline" onclick="closeSosModal()">Close</button>
      <button class="btn btn-secondary" onclick="switchSosModalTab('board')">View Incident Board</button>
    </div>
  `;
}

function switchSosModalTab(tab) {
  const formView = document.getElementById('sosModalFormView');
  const resultsView = document.getElementById('sosModalResultsView');
  const boardView = document.getElementById('sosModalBoardView');
  const tabForm = document.getElementById('sosTabFormBtn');
  const tabBoard = document.getElementById('sosTabBoardBtn');

  if (tab === 'form') {
    if (formView) formView.classList.remove('hidden');
    if (resultsView) resultsView.classList.add('hidden');
    if (boardView) boardView.classList.add('hidden');
    if (tabForm) tabForm.classList.add('active');
    if (tabBoard) tabBoard.classList.remove('active');
  } else if (tab === 'board') {
    if (formView) formView.classList.add('hidden');
    if (resultsView) resultsView.classList.add('hidden');
    if (boardView) boardView.classList.remove('hidden');
    if (tabForm) tabForm.classList.remove('active');
    if (tabBoard) tabBoard.classList.add('active');
    renderSosBoard();
  }
}

function handleProfileToggleOnCall(tmId) {
  state.toggleOnCall(tmId);
  openProfileModal(tmId);
}

function renderSosBoard() {
  const requests = state.sosRequests || [];
  const openRequests = requests.filter(r => r.status === 'open');
  const filledRequests = requests.filter(r => r.status === 'filled');

  // Update telemetry stats
  const statTotal = document.getElementById('sosStatTotal');
  if (statTotal) statTotal.textContent = `${requests.length} Incidents`;
  const countAll = document.getElementById('sosCountAll');
  if (countAll) countAll.textContent = requests.length;
  const countOpen = document.getElementById('sosCountOpen');
  if (countOpen) countOpen.textContent = openRequests.length;
  const countFilled = document.getElementById('sosCountFilled');
  if (countFilled) countFilled.textContent = filledRequests.length;
  const modalBoardCount = document.getElementById('sosModalBoardCount');
  if (modalBoardCount) modalBoardCount.textContent = requests.length;

  // Filter list
  let displayList = [...requests];
  if (state.sosFilter === 'open') {
    displayList = openRequests;
  } else if (state.sosFilter === 'filled') {
    displayList = filledRequests;
  }

  const renderCard = (req) => {
    const isFilled = req.status === 'filled';
    const filledTm = req.filledBy ? state.teammates.find(t => t.id === req.filledBy) : null;
    const timeAgo = getTimeAgo(req.createdAt);

    return `
      <div class="sos-incident-card ${req.status}">
        <div>
          <span class="sos-incident-badge ${req.status}">
            ${isFilled ? '✓ RESOLVED & FILLED' : '🚨 ACTIVE BROADCAST'}
          </span>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 6px;">
            ${timeAgo} • ${req.urgencyMins}m Urgency
          </div>
        </div>

        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
            <h4 style="font-size: 1.05rem; font-family: var(--font-heading); color: var(--text-main); margin: 0;">
              Vacated Role: <span style="color: #f43f5e;">${req.vacatedRole}</span>
            </h4>
            <span class="badge-pill" style="font-size: 0.7rem; text-transform: uppercase;">Slot: ${req.slotKey}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            "${req.projectContext}"
          </p>
          <div style="font-size: 0.78rem; color: var(--text-dim);">
            Broadcast by: <strong>${req.requesterName}</strong>
          </div>
        </div>

        <div>
          ${isFilled && filledTm ? `
            <div style="display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.03); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div class="avatar-circle-sm ${filledTm.avatarClass}">${filledTm.initials}</div>
              <div>
                <div style="font-size: 0.85rem; font-weight: 600;">${filledTm.name}</div>
                <div style="font-size: 0.72rem; color: #10b981;">Subbed into Squad</div>
              </div>
              <button class="btn btn-outline btn-xs" onclick="openProfileModal('${filledTm.id}')">Profile</button>
            </div>
          ` : `
            <button class="btn btn-sos btn-sm btn-glow" onclick="openSosModal('${req.vacatedRole}')">
              Respond to SOS
            </button>
          `}
        </div>
      </div>
    `;
  };

  const emptyHtml = `
    <div style="text-align: center; padding: 3rem 1rem; color: var(--text-dim);">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🚨</div>
      <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">No SOS Incidents in this view</h3>
      <p style="font-size: 0.85rem;">Broadcast an emergency replacement to dispatch vetted on-call candidates instantly.</p>
    </div>
  `;

  const mainListEl = document.getElementById('sosIncidentsList');
  if (mainListEl) {
    mainListEl.innerHTML = displayList.length > 0 ? displayList.map(renderCard).join('') : emptyHtml;
  }

  const modalListEl = document.getElementById('sosModalIncidentsList');
  if (modalListEl) {
    modalListEl.innerHTML = displayList.length > 0 ? displayList.map(renderCard).join('') : emptyHtml;
  }
}

function getTimeAgo(timestamp) {
  if (!timestamp) return 'Just now';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

// ---------------------------------------------------------------------------
// 8b. Post-Hackathon Squad Retro Generator (Pure Functions & UI Controllers)
// ---------------------------------------------------------------------------

function parseTimeStrToMinutes(timeStr) {
  if (!timeStr) return 0;
  if (typeof timeStr === 'number') return Math.floor(timeStr / 60000);
  const s = String(timeStr).trim().toLowerCase();
  if (s === 'just now') return 1;
  if (s.includes('min')) {
    const m = parseInt(s, 10);
    return isNaN(m) ? 5 : m;
  }
  if (s.includes('hour') || s.includes('hr')) {
    const h = parseInt(s, 10);
    return isNaN(h) ? 60 : h * 60;
  }
  if (s.includes('yesterday')) return 1440;
  if (s.includes('day')) {
    const d = parseInt(s, 10);
    return isNaN(d) ? 2880 : d * 1440;
  }
  const match = s.match(/(\d+):(\d+)\s*(am|pm)?/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const meridiem = match[3];
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
    return hours * 60 + mins;
  }
  return 30;
}

/**
 * 1. Compute Team Formation Timeline (Pure Function)
 * Analyzes state.squad, state.notifications, and state.sosRequests to reconstruct
 * the sequence of when each slot was filled.
 */
function computeTeamFormationTimeline(appState) {
  const slotRoles = {
    frontend: "Frontend Architecture",
    design: "Product & UI/UX Design",
    backend: "Backend & Systems",
    ai: "AI & Model Engineering"
  };

  const slotOrder = ['frontend', 'design', 'backend', 'ai'];
  const steps = [];

  let earliestNotifMs = Date.now() - (4 * 3600 * 1000);
  if (appState.notifications && appState.notifications.length > 0) {
    const validTimestamps = appState.notifications
      .map(n => n.timestamp)
      .filter(t => typeof t === 'number' && !isNaN(t));
    if (validTimestamps.length > 0) {
      earliestNotifMs = Math.min(...validTimestamps) - (30 * 60 * 1000);
    }
  }

  slotOrder.forEach((slotKey, idx) => {
    const candidateId = appState.squad ? appState.squad[slotKey] : null;
    if (!candidateId) return;

    if (candidateId === "USER" || (slotKey === 'frontend' && candidateId === "USER")) {
      steps.push({
        slotKey,
        slotRole: slotRoles[slotKey],
        candidateId: "USER",
        candidateName: `${appState.user.name} (Squad Lead)`,
        initials: appState.user.initials,
        avatarClass: "avatar-purple",
        timestamp: earliestNotifMs,
        eventDescription: "Squad Kickoff — Vision & Core Client Initialized"
      });
      return;
    }

    const tm = (appState.teammates || []).find(t => t.id === candidateId);
    if (!tm) return;

    let eventTime = null;
    let eventDesc = "Joined Squad & locked in technical stack";

    if (appState.notifications) {
      const matchNotif = appState.notifications.find(n => {
        if (n.actions && n.actions.some(a => a.payload === tm.id)) return true;
        if (n.message && n.message.includes(tm.name)) return true;
        if (n.title && n.title.includes(tm.name)) return true;
        return false;
      });
      if (matchNotif && matchNotif.timestamp) {
        eventTime = matchNotif.timestamp;
        if (matchNotif.type === 'sos_accepted') {
          eventDesc = "Emergency SOS replacement accepted on-call";
        } else if (matchNotif.type === 'teammate_accepted') {
          eventDesc = "Accepted squad invitation & verified role";
        } else if (matchNotif.type === 'candidate_application') {
          eventDesc = "Candidate application reviewed & approved";
        }
      }
    }

    if (!eventTime && appState.sosRequests) {
      const sosReq = appState.sosRequests.find(r => r.filledBy === tm.id);
      if (sosReq && sosReq.createdAt) {
        eventTime = sosReq.createdAt;
        eventDesc = "Emergency SOS dispatched & slotted into roster";
      }
    }

    if (!eventTime) {
      eventTime = earliestNotifMs + ((idx + 1) * 45 * 60 * 1000);
    }

    steps.push({
      slotKey,
      slotRole: slotRoles[slotKey],
      candidateId: tm.id,
      candidateName: tm.name,
      initials: tm.initials,
      avatarClass: tm.avatarClass,
      timestamp: eventTime,
      eventDescription: eventDesc
    });
  });

  steps.sort((a, b) => a.timestamp - b.timestamp);

  const kickoffMs = steps.length > 0 ? steps[0].timestamp : earliestNotifMs;
  return steps.map((step, i) => {
    const elapsedMinutes = Math.max(0, Math.round((step.timestamp - kickoffMs) / 60000));
    const h = Math.floor(elapsedMinutes / 60);
    const m = elapsedMinutes % 60;
    const timeFormatted = i === 0 ? "Kickoff (T+0h 00m)" : `+${h}h ${m < 10 ? '0' : ''}${m}m`;
    return {
      ...step,
      stepNumber: i + 1,
      elapsedMinutes,
      timeFormatted
    };
  });
}

/**
 * 2. Compute Teammate Engagement Scores (Pure Function)
 * Pulls conversation metrics (message count, reply latency) and calculates normalized 0-100 scores.
 */
function computeTeammateEngagement(appState) {
  const squad = appState.squad || {};
  const squadTmIds = Object.keys(squad)
    .map(k => squad[k])
    .filter(id => id && id !== 'USER');

  const uniqueTmIds = [...new Set(squadTmIds)];
  const engagements = [];

  uniqueTmIds.forEach(tmId => {
    const tm = (appState.teammates || []).find(t => t.id === tmId);
    if (!tm) return;

    const convo = (appState.conversations || []).find(c => c.teammateId === tmId);
    let msgCount = 0;
    let avgReplyMinutes = 15;

    if (convo && Array.isArray(convo.messages) && convo.messages.length > 0) {
      msgCount = convo.messages.length;
      
      const gaps = [];
      for (let i = 1; i < convo.messages.length; i++) {
        const prev = convo.messages[i - 1];
        const curr = convo.messages[i];
        if (prev.sender !== curr.sender) {
          const m1 = parseTimeStrToMinutes(prev.time);
          const m2 = parseTimeStrToMinutes(curr.time);
          const diff = Math.abs(m2 - m1);
          gaps.push(diff > 0 && diff < 300 ? diff : 3);
        }
      }
      if (gaps.length > 0) {
        avgReplyMinutes = gaps.reduce((acc, v) => acc + v, 0) / gaps.length;
      } else {
        avgReplyMinutes = parseTimeStrToMinutes(convo.messages[convo.messages.length - 1].time) > 0 ? 2 : 12;
      }
    } else {
      msgCount = Math.max(1, Math.round((tm.weeklyHours || 20) / 10));
      avgReplyMinutes = Math.max(4, Math.round(25 - (tm.rating * 4)));
    }

    const msgScore = Math.min(45, msgCount * 15);
    const speedScore = Math.max(10, Math.min(45, 50 - (avgReplyMinutes * 2.5)));
    const repScore = Math.min(10, Math.round((tm.rating || 4.5) * 2));
    const score = Math.min(99, Math.max(50, Math.round(msgScore + speedScore + repScore)));

    let levelLabel = "Responsive";
    let badgeClass = "retro-badge-responsive";
    if (score >= 88) {
      levelLabel = "Hyper-Active";
      badgeClass = "retro-badge-hyper";
    } else if (score < 72) {
      levelLabel = "Steady";
      badgeClass = "retro-badge-steady";
    }

    const avgReplyStr = avgReplyMinutes <= 2 ? "< 2 mins" : `~${Math.round(avgReplyMinutes)} mins`;

    engagements.push({
      teammateId: tm.id,
      name: tm.name,
      role: tm.role,
      initials: tm.initials,
      avatarClass: tm.avatarClass,
      messageCount: msgCount,
      avgReplyMinutes,
      avgReplyStr,
      score,
      levelLabel,
      badgeClass
    });
  });

  engagements.sort((a, b) => b.score - a.score);
  return engagements;
}

/**
 * 3. Compute Squad Synergy Progression (Pure Function)
 * Extends calculateSquadAnalytics logic to compare formation milestones.
 */
function computeSynergyProgression(appState) {
  const slots = ['design', 'frontend', 'backend', 'ai'];
  const filledCount = slots.filter(k => appState.squad && appState.squad[k]).length;

  let finalScore = 25;
  let techCoverage = 35;
  let tzOverlap = 3.5;
  let workstyleHarmony = 80;

  if (filledCount === 2) {
    finalScore = 58;
    techCoverage = 60;
    tzOverlap = 4.5;
    workstyleHarmony = 85;
  } else if (filledCount === 3) {
    finalScore = 82;
    techCoverage = 80;
    tzOverlap = 5.2;
    workstyleHarmony = 92;
  } else if (filledCount === 4) {
    finalScore = 98;
    techCoverage = 96;
    tzOverlap = 6.0;
    workstyleHarmony = 97;
  }

  const milestones = [
    { label: "1/4 Squad Initiated (Lead)", score: 25, badge: "Kickoff" },
    { label: "2/4 Core Stack Paired", score: 58, badge: "+33% Boost" },
    { label: "3/4 Cross-Functional Triad", score: 82, badge: "+24% Boost" },
    { label: "4/4 Full Dream Squad Assembled", score: 98, badge: "Peak Synergy" }
  ];

  return {
    initialScore: 25,
    finalScore,
    delta: finalScore - 25,
    techCoverage,
    tzOverlap,
    workstyleHarmony,
    milestones,
    filledCount
  };
}

/**
 * 4. Compute Narrative Summary Object (Pure Function)
 */
function computeRetroNarrativeSummary(appState, timeline, engagements, synergy) {
  let fastestToRespond = { id: null, name: "N/A", avgReplyStr: "< 2 mins", avgReplyMinutes: 2 };
  if (engagements.length > 0) {
    const sortedBySpeed = [...engagements].sort((a, b) => a.avgReplyMinutes - b.avgReplyMinutes);
    fastestToRespond = sortedBySpeed[0];
  }

  let mostActive = { id: null, name: "N/A", messageCount: 0 };
  if (engagements.length > 0) {
    const sortedByCount = [...engagements].sort((a, b) => b.messageCount - a.messageCount);
    mostActive = sortedByCount[0];
  }

  let squadCompletionTime = "3h 45m";
  if (timeline.length > 1) {
    const earliest = timeline[0].timestamp;
    const latest = timeline[timeline.length - 1].timestamp;
    const diffMins = Math.max(15, Math.round((latest - earliest) / 60000));
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    squadCompletionTime = h > 0 ? `${h}h ${m < 10 ? '0' : ''}${m}m` : `${m} mins`;
  }

  const bookmarkedIds = appState.bookmarks || [];
  const bookmarkedNames = bookmarkedIds.map(id => {
    const tm = (appState.teammates || []).find(t => t.id === id);
    return tm ? tm.name : id;
  });

  return {
    fastestToRespond,
    mostActive,
    squadCompletionTime,
    finalSynergyScore: synergy.finalScore,
    bookmarkedScouting: {
      count: bookmarkedIds.length,
      names: bookmarkedNames
    }
  };
}

/**
 * 5. Generate Full Squad Retro Report (Pure Function)
 */
function generateSquadRetroReport(appState) {
  const timeline = computeTeamFormationTimeline(appState);
  const engagements = computeTeammateEngagement(appState);
  const synergy = computeSynergyProgression(appState);
  const summary = computeRetroNarrativeSummary(appState, timeline, engagements, synergy);

  return {
    timeline,
    engagements,
    synergy,
    summary,
    generatedAt: new Date()
  };
}

/**
 * 6. Generate Shareable Plain-Text / Markdown Summary (Pure Function)
 */
function generateShareableRetroMarkdown(report, appState) {
  const user = appState.user || DEFAULT_USER;
  const lines = [
    `# 🚀 SynapseCollab — Squad Retro & Performance Summary`,
    `**Project Domain:** ${user.projectType}`,
    `**Final Squad Synergy:** ${report.summary.finalSynergyScore}% (Peak Balance)`,
    `**Formation Speed:** ${report.summary.squadCompletionTime} (from Kickoff to 4/4 Full Squad)`,
    ``,
    `### 🏆 Executive Highlights`,
    `• ⚡ **Fastest Responder:** ${report.summary.fastestToRespond.name} (${report.summary.fastestToRespond.avgReplyStr} avg reply)`,
    `• 💬 **Most Active Teammate:** ${report.summary.mostActive.name} (${report.summary.mostActive.messageCount} messages exchanged)`,
    `• 📈 **Synergy Trajectory:** Started at 25% → Finalized at ${report.summary.finalSynergyScore}% (+${report.synergy.delta}% execution surge)`,
    `• 🌍 **Timezone Overlap:** ${report.synergy.tzOverlap} hrs/day synchronized daylight window`,
    ``,
    `### ⏱️ Team Formation Timeline`,
    ...report.timeline.map(s => `${s.stepNumber}. [${s.slotRole}] ${s.candidateName} — ${s.timeFormatted} (${s.eventDescription})`),
    ``,
    `### 💬 Teammate Engagement Matrix`,
    ...report.engagements.map(e => `• ${e.name} (${e.role}): Engagement Score ${e.score}/100 [${e.levelLabel}] — ${e.messageCount} msgs, avg latency ${e.avgReplyStr}`),
    ``,
    `### 🔍 Talent Scouting & Evaluation`,
    `• Evaluated ${report.summary.bookmarkedScouting.count} alternative candidates before locking roster${report.summary.bookmarkedScouting.names.length > 0 ? ` (${report.summary.bookmarkedScouting.names.join(', ')})` : ''}`,
    `• Technical Stack Coverage: ${report.synergy.techCoverage}% comprehensive across frontend, backend, AI, and design systems`,
    ``,
    `---`,
    `*Generated via SynapseCollab AI Teammate Matchmaker & Retro Generator*`
  ];

  return lines.join('\n');
}

/**
 * 7. Open & Render Retro Modal
 */
function openRetroModal() {
  const modal = document.getElementById('retroModal');
  if (!modal) return;

  const report = generateSquadRetroReport(state);

  const timeBadge = document.getElementById('retroTimestampBadge');
  if (timeBadge) {
    timeBadge.textContent = `Generated • ${report.generatedAt.toLocaleDateString()}`;
  }

  const statFormationTime = document.getElementById('retroStatFormationTime');
  const statSynergy = document.getElementById('retroStatSynergyScore');
  const statFastest = document.getElementById('retroStatFastest');
  const statFastestSub = document.getElementById('retroStatFastestSub');
  const statMostActive = document.getElementById('retroStatMostActive');
  const statMostActiveSub = document.getElementById('retroStatMostActiveSub');

  if (statFormationTime) statFormationTime.textContent = report.summary.squadCompletionTime;
  if (statSynergy) statSynergy.textContent = `${report.summary.finalSynergyScore}%`;
  if (statFastest) statFastest.textContent = report.summary.fastestToRespond.name;
  if (statFastestSub) statFastestSub.textContent = `⚡ avg reply ${report.summary.fastestToRespond.avgReplyStr}`;
  if (statMostActive) statMostActive.textContent = report.summary.mostActive.name;
  if (statMostActiveSub) statMostActiveSub.textContent = `💬 ${report.summary.mostActive.messageCount} msgs exchanged`;

  const slotsMeta = document.getElementById('retroSlotsMeta');
  if (slotsMeta) slotsMeta.textContent = `${report.timeline.length} of 4 Slots Filled`;

  const timelineList = document.getElementById('retroTimelineList');
  if (timelineList) {
    timelineList.innerHTML = report.timeline.map(step => `
      <li class="retro-timeline-step">
        <div class="retro-step-marker step-done">${step.stepNumber}</div>
        <div class="retro-step-content">
          <div class="retro-step-info">
            <div class="avatar-circle-sm ${escapeHtml(step.avatarClass)}">${escapeHtml(step.initials)}</div>
            <div>
              <div class="retro-step-name">${escapeHtml(step.candidateName)}</div>
              <div class="retro-step-role">${escapeHtml(step.slotRole)} • <span style="color: var(--text-dim);">${escapeHtml(step.eventDescription)}</span></div>
            </div>
          </div>
          <span class="retro-step-time">${escapeHtml(step.timeFormatted)}</span>
        </div>
      </li>
    `).join('');
  }

  const engagementList = document.getElementById('retroEngagementList');
  if (engagementList) {
    if (report.engagements.length === 0) {
      engagementList.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 1rem;">No external teammates slotted yet.</div>`;
    } else {
      engagementList.innerHTML = report.engagements.map(eng => {
        const fillClass = eng.score >= 88 ? 'accent-cyan' : (eng.score >= 72 ? '' : 'accent-emerald');
        return `
          <div class="retro-engagement-item">
            <div class="retro-member-identity">
              <div class="avatar-circle-sm ${escapeHtml(eng.avatarClass)}">${escapeHtml(eng.initials)}</div>
              <div class="retro-member-meta">
                <div class="retro-member-name">${escapeHtml(eng.name)}</div>
                <div class="retro-member-sub">${escapeHtml(eng.role)}</div>
              </div>
            </div>
            <div class="retro-bar-col">
              <div class="retro-bar-meta">
                <span>Engagement: <strong>${eng.score}/100</strong> (${eng.messageCount} msgs)</span>
                <span>Avg Response: <strong>${escapeHtml(eng.avgReplyStr)}</strong></span>
              </div>
              <div class="progress-track">
                <div class="progress-fill ${fillClass}" style="width: ${eng.score}%;"></div>
              </div>
            </div>
            <div class="retro-engagement-badge ${escapeHtml(eng.badgeClass)}">
              ${escapeHtml(eng.levelLabel)}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const synergyDeltaEl = document.getElementById('retroSynergyDelta');
  if (synergyDeltaEl) synergyDeltaEl.textContent = `+${report.synergy.delta}% Growth`;

  const synergyContainer = document.getElementById('retroSynergyProgression');
  if (synergyContainer) {
    synergyContainer.innerHTML = report.synergy.milestones.map(m => `
      <div class="retro-synergy-step">
        <span>${escapeHtml(m.label)}</span>
        <span class="retro-synergy-score-tag" style="color: ${m.score >= 90 ? '#10b981' : '#818cf8'};">
          ${m.score}% <span class="badge-pill" style="font-size: 0.65rem; margin-left: 4px;">${escapeHtml(m.badge)}</span>
        </span>
      </div>
    `).join('');
  }

  const scoutingCountEl = document.getElementById('retroScoutingCount');
  if (scoutingCountEl) scoutingCountEl.textContent = `${report.summary.bookmarkedScouting.count} Candidates Scouted`;

  const scoutingSignal = document.getElementById('retroScoutingSignal');
  if (scoutingSignal) {
    const scoutedNamesHtml = report.summary.bookmarkedScouting.names.length > 0
      ? report.summary.bookmarkedScouting.names.map(escapeHtml).join(', ')
      : 'Direct Auto-Assemble';

    scoutingSignal.innerHTML = `
      <div class="retro-scouting-stat-row">
        <span style="color: var(--text-muted);">Alternative Candidates Scouted:</span>
        <strong>${report.summary.bookmarkedScouting.count} Bookmarked</strong>
      </div>
      <div class="retro-scouting-stat-row">
        <span style="color: var(--text-muted);">Scouted Talent Names:</span>
        <span style="color: var(--accent-cyan); font-size: 0.78rem;">${scoutedNamesHtml}</span>
      </div>
      <div class="retro-scouting-stat-row">
        <span style="color: var(--text-muted);">Timezone Overlap:</span>
        <strong style="color: #f59e0b;">${report.synergy.tzOverlap} hrs/day sync</strong>
      </div>
      <div class="retro-scouting-stat-row">
        <span style="color: var(--text-muted);">Tech Stack Synergy:</span>
        <strong style="color: #10b981;">${report.synergy.techCoverage}% Complete</strong>
      </div>
    `;
  }

  sfx.playClick();
  modal.classList.remove('hidden');
}

function closeRetroModal() {
  const modal = document.getElementById('retroModal');
  if (modal) modal.classList.add('hidden');
}

function copyRetroMarkdown() {
  const report = generateSquadRetroReport(state);
  const md = generateShareableRetroMarkdown(report, state);
  navigator.clipboard.writeText(md).then(() => {
    sfx.playPop();
    showToast("📊 Shareable Squad Retro copied to clipboard!");
  }).catch(() => {
    showToast("Retro summary ready for sharing!");
  });
}

// ---------------------------------------------------------------------------
// 9. Event Listeners Initialization
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Navigation tabs
  document.querySelectorAll('.nav-links .nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.getAttribute('data-tab');
      sfx.playClick();
      switchTab(tab);
    });
  });

  // Hero CTAs
  const heroWizardBtn = document.getElementById('heroWizardBtn');
  const heroForgeBtn = document.getElementById('heroForgeBtn');
  const openWizardBtn = document.getElementById('openWizardBtn');
  const triggerWizardFromDir = document.getElementById('triggerWizardFromDir');

  if (heroWizardBtn) heroWizardBtn.addEventListener('click', openWizardModal);
  if (openWizardBtn) openWizardBtn.addEventListener('click', openWizardModal);
  if (triggerWizardFromDir) triggerWizardFromDir.addEventListener('click', openWizardModal);

  if (heroForgeBtn) {
    heroForgeBtn.addEventListener('click', () => {
      sfx.playClick();
      switchTab('forge');
      const forgeSec = document.getElementById('forgeSection');
      if (forgeSec) forgeSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Audio SFX Toggle
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const sfxOnIcon = document.getElementById('sfxOnIcon');
  const sfxOffIcon = document.getElementById('sfxOffIcon');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      if (sfx.enabled) {
        sfxOnIcon.classList.remove('hidden');
        sfxOffIcon.classList.add('hidden');
        sfx.playClick();
        showToast("Audio sound effects enabled");
      } else {
        sfxOnIcon.classList.add('hidden');
        sfxOffIcon.classList.remove('hidden');
        showToast("Audio sound effects muted");
      }
    });
  }

  // Bookmarks Drawer
  const bookmarksToggleBtn = document.getElementById('bookmarksToggleBtn');
  const bookmarksDrawer = document.getElementById('bookmarksDrawerBackdrop');
  const closeBookmarksBtn = document.getElementById('closeBookmarksBtn');

  if (bookmarksToggleBtn && bookmarksDrawer) {
    bookmarksToggleBtn.addEventListener('click', () => {
      sfx.playClick();
      renderBookmarksDrawer();
      bookmarksDrawer.classList.remove('hidden');
    });
  }
  if (closeBookmarksBtn && bookmarksDrawer) {
    closeBookmarksBtn.addEventListener('click', () => {
      bookmarksDrawer.classList.add('hidden');
    });
  }

  // ── Notification Bell & Dropdown ──────────────────────────────────────────
  const notifBellBtn = document.getElementById('notifBellBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const markAllNotifsReadBtn = document.getElementById('markAllNotifsReadBtn');
  const clearAllNotifsBtn = document.getElementById('clearAllNotifsBtn');

  if (notifBellBtn && notifDropdown) {
    notifBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.playClick();
      notifDropdown.classList.toggle('hidden');
      if (!notifDropdown.classList.contains('hidden')) {
        renderNotifications();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBellBtn) {
        notifDropdown.classList.add('hidden');
      }
    });
  }

  if (markAllNotifsReadBtn) {
    markAllNotifsReadBtn.addEventListener('click', () => state.markAllNotifsRead());
  }
  if (clearAllNotifsBtn) {
    clearAllNotifsBtn.addEventListener('click', () => state.clearAllNotifs());
  }

  // Notification filter chips
  document.querySelectorAll('.notif-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.notif-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.notifFilter = chip.getAttribute('data-filter') || 'all';
      sfx.playClick();
      renderNotifications();
    });
  });

  // Profile Persona Switcher Button
  const profilePersonaBtn = document.getElementById('profilePersonaBtn');
  if (profilePersonaBtn) {
    profilePersonaBtn.addEventListener('click', openWizardModal);
  }

  // Search Input
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      if (e.target.value) {
        clearSearchBtn.classList.remove('hidden');
      } else {
        clearSearchBtn.classList.add('hidden');
      }
      renderTeammatesGrid();
    });
  }
  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.filters.search = '';
      clearSearchBtn.classList.add('hidden');
      renderTeammatesGrid();
    });
  }

  // Role Pill Buttons
  document.querySelectorAll('.role-pills .role-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-pills .role-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.role = btn.getAttribute('data-role');
      sfx.playClick();
      renderTeammatesGrid();
    });
  });

  // Secondary Filter Dropdowns
  const filterCommitment = document.getElementById('filterCommitment');
  const filterTimezone = document.getElementById('filterTimezone');
  const filterSort = document.getElementById('filterSort');

  if (filterCommitment) {
    filterCommitment.addEventListener('change', (e) => {
      state.filters.commitment = e.target.value;
      renderTeammatesGrid();
    });
  }
  if (filterTimezone) {
    filterTimezone.addEventListener('change', (e) => {
      state.filters.timezone = e.target.value;
      renderTeammatesGrid();
    });
  }
  if (filterSort) {
    filterSort.addEventListener('change', (e) => {
      state.filters.sort = e.target.value;
      renderTeammatesGrid();
    });
  }

  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);

  // Squad Forge Action Buttons
  const autoAssembleSquadBtn = document.getElementById('autoAssembleSquadBtn');
  const clearSquadBtn = document.getElementById('clearSquadBtn');
  const finalizeSquadBtn = document.getElementById('finalizeSquadBtn');
  const exportSquadBtn = document.getElementById('exportSquadBtn');

  if (autoAssembleSquadBtn) autoAssembleSquadBtn.addEventListener('click', autoAssembleFullSquad);
  if (clearSquadBtn) {
    clearSquadBtn.addEventListener('click', () => {
      state.clearSquad();
      sfx.playClick();
      showToast("Cleared squad slots");
      renderSquadForge();
    });
  }
  if (finalizeSquadBtn) {
    finalizeSquadBtn.addEventListener('click', () => {
      sfx.playChime();
      showToast("🏆 Squad Locked In! Manifesto generated.");
      openExportSquadModal();
    });
  }
  if (exportSquadBtn) exportSquadBtn.addEventListener('click', openExportSquadModal);

  // Export Squad Modal
  const exportModal = document.getElementById('exportSquadModal');
  const closeExportSquadBtn = document.getElementById('closeExportSquadBtn');
  const copySquadClipboardBtn = document.getElementById('copySquadClipboardBtn');

  function openExportSquadModal() {
    if (!exportModal) return;
    const txtArea = document.getElementById('exportSquadText');
    if (txtArea) {
      const designTm = state.teammates.find(t => t.id === state.squad.design);
      const backendTm = state.teammates.find(t => t.id === state.squad.backend);
      const aiTm = state.teammates.find(t => t.id === state.squad.ai);

      txtArea.value = [
        `==================================================`,
        `🚀 SYNAPSECOLLAB — OFFICIAL SQUAD MANIFESTO`,
        `==================================================`,
        `Project Focus: ${state.user.projectType}`,
        `Synergy Health Score: 98% Balance`,
        ``,
        `[ROSTER]`,
        `• Product & UI/UX Design : ${designTm ? `${designTm.name} (${designTm.skills.slice(0, 3).join(', ')})` : 'TBD'}`,
        `• Frontend Lead          : ${state.user.name} (${state.user.skills.slice(0, 3).join(', ')})`,
        `• Backend Architect      : ${backendTm ? `${backendTm.name} (${backendTm.skills.slice(0, 3).join(', ')})` : 'TBD'}`,
        `• AI & Model Engineering : ${aiTm ? `${aiTm.name} (${aiTm.skills.slice(0, 3).join(', ')})` : 'TBD'}`,
        ``,
        `Communication Style: ${state.user.commPref}`,
        `Target Weekly Dedication: 30-40 hrs/wk per member`,
        `Generated via SynapseCollab AI Matching Matrix`,
        `==================================================`
      ].join('\n');
    }
    sfx.playClick();
    exportModal.classList.remove('hidden');
  }

  if (closeExportSquadBtn && exportModal) {
    closeExportSquadBtn.addEventListener('click', () => exportModal.classList.add('hidden'));
  }

  if (copySquadClipboardBtn) {
    copySquadClipboardBtn.addEventListener('click', () => {
      const txtArea = document.getElementById('exportSquadText');
      if (txtArea) {
        navigator.clipboard.writeText(txtArea.value).then(() => {
          sfx.playPop();
          showToast("Squad Manifesto copied to clipboard!");
        });
      }
    });
  }

  // ── Retro Modal Event Listeners ───────────────────────────────────────────
  const openRetroTopBtn = document.getElementById('openRetroTopBtn');
  const generateRetroSidebarBtn = document.getElementById('generateRetroSidebarBtn');
  const exportToRetroBtn = document.getElementById('exportToRetroBtn');
  const retroModal = document.getElementById('retroModal');
  const closeRetroModalBtn = document.getElementById('closeRetroModalBtn');
  const closeRetroFooterBtn = document.getElementById('closeRetroFooterBtn');
  const copyRetroMarkdownBtn = document.getElementById('copyRetroMarkdownBtn');

  if (openRetroTopBtn) openRetroTopBtn.addEventListener('click', openRetroModal);
  if (generateRetroSidebarBtn) generateRetroSidebarBtn.addEventListener('click', openRetroModal);
  if (exportToRetroBtn) {
    exportToRetroBtn.addEventListener('click', () => {
      if (exportModal) exportModal.classList.add('hidden');
      openRetroModal();
    });
  }
  if (closeRetroModalBtn) closeRetroModalBtn.addEventListener('click', closeRetroModal);
  if (closeRetroFooterBtn) closeRetroFooterBtn.addEventListener('click', closeRetroModal);
  if (retroModal) {
    retroModal.addEventListener('click', (e) => {
      if (e.target === retroModal) closeRetroModal();
    });
  }
  if (copyRetroMarkdownBtn) copyRetroMarkdownBtn.addEventListener('click', copyRetroMarkdown);

  // Wizard Modal Triggers & Controls
  const closeWizardBtn = document.getElementById('closeWizardBtn');
  const wizardPrevBtn = document.getElementById('wizardPrevBtn');
  const wizardNextBtn = document.getElementById('wizardNextBtn');

  if (closeWizardBtn) closeWizardBtn.addEventListener('click', closeWizardModal);
  if (wizardPrevBtn) wizardPrevBtn.addEventListener('click', handleWizardPrev);
  if (wizardNextBtn) wizardNextBtn.addEventListener('click', handleWizardNext);

  // Single select pills in wizard
  document.querySelectorAll('.pill-selector:not(.multi) .select-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const parent = pill.closest('.pill-selector');
      if (parent) {
        parent.querySelectorAll('.select-pill').forEach(p => p.classList.remove('active'));
      }
      pill.classList.add('active');
      sfx.playClick();
    });
  });

  // Multi select pills in wizard
  document.querySelectorAll('.pill-selector.multi .select-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      sfx.playClick();
    });
  });

  // Radio cards in wizard
  document.querySelectorAll('.radio-card-grid .radio-card').forEach(card => {
    card.addEventListener('click', () => {
      const parent = card.closest('.radio-card-grid');
      if (parent) {
        parent.querySelectorAll('.radio-card').forEach(c => c.classList.remove('active'));
      }
      card.classList.add('active');
      sfx.playClick();
    });
  });

  // Profile modal close button
  const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
  if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', closeProfileModal);

  // Post Project Modal
  const openPostProjectModalBtn = document.getElementById('openPostProjectModalBtn');
  const postProjectModal = document.getElementById('postProjectModal');
  const closePostProjectBtn = document.getElementById('closePostProjectBtn');
  const cancelPostProjectBtn = document.getElementById('cancelPostProjectBtn');
  const postProjectForm = document.getElementById('postProjectForm');

  if (openPostProjectModalBtn && postProjectModal) {
    openPostProjectModalBtn.addEventListener('click', () => {
      sfx.playClick();
      postProjectModal.classList.remove('hidden');
    });
  }
  if (closePostProjectBtn && postProjectModal) {
    closePostProjectBtn.addEventListener('click', () => postProjectModal.classList.add('hidden'));
  }
  if (cancelPostProjectBtn && postProjectModal) {
    cancelPostProjectBtn.addEventListener('click', () => postProjectModal.classList.add('hidden'));
  }

  if (postProjectForm) {
    postProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('projTitle').value.trim();
      const tagline = document.getElementById('projTagline').value.trim();
      const category = document.getElementById('projCategory').value;
      const event = document.getElementById('projEvent').value.trim();
      const rolesStr = document.getElementById('projRoles').value.trim();
      const techStr = document.getElementById('projTech').value.trim();

      const newProj = {
        id: `proj-${Date.now()}`,
        title,
        tagline,
        category,
        categoryLabel: category === 'ai' ? 'AI & Autonomous Agents' : (category === 'web3' ? 'FinTech & Web3' : 'Developer Tools & SaaS'),
        event,
        lead: `${state.user.name} (You)`,
        openRoles: rolesStr.split(',').map(r => r.trim()).filter(Boolean),
        techStack: techStr.split(',').map(t => t.trim()).filter(Boolean),
        applied: false
      };

      state.projects.unshift(newProj);
      state.save('synapse_projects', state.projects);
      postProjectModal.classList.add('hidden');
      postProjectForm.reset();

      sfx.playChime();
      showToast("🚀 Project recruitment published to the board!");
      renderProjectsGrid();
    });
  }

  // Project Category Filter Buttons
  document.querySelectorAll('#projectCategoryFilter .project-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#projectCategoryFilter .project-tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      sfx.playClick();

      document.querySelectorAll('.projects-grid .project-card').forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Chat Form & Quick Icebreakers
  const chatInputForm = document.getElementById('chatInputForm');
  const chatMessageInput = document.getElementById('chatMessageInput');
  const chatViewProfileBtn = document.getElementById('chatViewProfileBtn');
  const chatAddSquadBtn = document.getElementById('chatAddSquadBtn');

  if (chatInputForm && chatMessageInput) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatMessageInput.value.trim();
      if (!text) return;

      const chat = state.conversations.find(c => c.id === state.activeChatId);
      if (!chat) return;

      chat.messages.push({
        sender: 'you',
        text,
        time: 'Just now'
      });
      state.save('synapse_conversations', state.conversations);
      chatMessageInput.value = '';
      sfx.playPop();
      renderActiveChat();
      renderChatThreads();

      // Simulated auto-reply after 1.2 seconds
      setTimeout(() => {
        chat.messages.push({
          sender: 'them',
          text: `Awesome! That sounds like an incredible vision. I'm checking my schedule so we can lock in our stack and submit our squad. Let's make it happen!`,
          time: 'Just now'
        });
        state.save('synapse_conversations', state.conversations);
        sfx.playChime();
        renderActiveChat();
        renderChatThreads();
      }, 1200);
    });
  }

  // Icebreaker Quick Chips
  document.querySelectorAll('.icebreaker-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      if (chatMessageInput) {
        chatMessageInput.value = text;
        chatMessageInput.focus();
        sfx.playClick();
      }
    });
  });

  if (chatViewProfileBtn) {
    chatViewProfileBtn.addEventListener('click', () => {
      const chat = state.conversations.find(c => c.id === state.activeChatId);
      if (chat) openProfileModal(chat.teammateId);
    });
  }

  if (chatAddSquadBtn) {
    chatAddSquadBtn.addEventListener('click', () => {
      const chat = state.conversations.find(c => c.id === state.activeChatId);
      if (chat) handleQuickAddToSquad(chat.teammateId);
    });
  }

  // ── SOS Mode Event Listeners ──────────────────────────────────────────────
  const openSosModalBtn = document.getElementById('openSosModalBtn');
  const closeSosModalBtn = document.getElementById('closeSosModalBtn');
  const cancelSosBtn = document.getElementById('cancelSosBtn');
  const squadSosQuickBtn = document.getElementById('squadSosQuickBtn');
  const sosBoardCreateBtn = document.getElementById('sosBoardCreateBtn');
  const sosModal = document.getElementById('sosModal');

  if (openSosModalBtn) openSosModalBtn.addEventListener('click', () => openSosModal());
  if (closeSosModalBtn) closeSosModalBtn.addEventListener('click', closeSosModal);
  if (cancelSosBtn) cancelSosBtn.addEventListener('click', closeSosModal);

  if (squadSosQuickBtn) {
    squadSosQuickBtn.addEventListener('click', () => {
      let emptyRole = null;
      if (!state.squad.design) emptyRole = 'UI/UX Product Designer';
      else if (!state.squad.backend) emptyRole = 'Backend Architect';
      else if (!state.squad.ai) emptyRole = 'AI / ML Engineer';
      else if (!state.squad.frontend || state.squad.frontend === 'USER') emptyRole = 'Frontend Engineer';
      openSosModal(emptyRole);
    });
  }

  if (sosBoardCreateBtn) sosBoardCreateBtn.addEventListener('click', () => openSosModal());

  // Close SOS modal on backdrop click
  if (sosModal) {
    sosModal.addEventListener('click', (e) => {
      if (e.target === sosModal) closeSosModal();
    });
  }

  // SOS Modal Tabs (Form vs Incident Board)
  const sosTabFormBtn = document.getElementById('sosTabFormBtn');
  const sosTabBoardBtn = document.getElementById('sosTabBoardBtn');
  if (sosTabFormBtn) sosTabFormBtn.addEventListener('click', () => switchSosModalTab('form'));
  if (sosTabBoardBtn) sosTabBoardBtn.addEventListener('click', () => switchSosModalTab('board'));

  // SOS Incident Board Filter Pills
  document.querySelectorAll('#sosFilterPills .role-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#sosFilterPills .role-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.sosFilter = pill.getAttribute('data-sos-filter') || 'all';
      sfx.playClick();
      renderSosBoard();
    });
  });

  // Initial renders
  renderTeammatesGrid();
  renderSquadForge();
  renderProjectsGrid();
  renderChatThreads();
  renderActiveChat();
  renderBookmarksDrawer();
  renderNotifications();
  updateSosButtonBadge();
  renderSosBoard();

  // Simulate a live incoming notification after 6 seconds
  setTimeout(() => {
    state.addNotification({
      id: `notif-live-${Date.now()}`,
      type: 'candidate_application',
      category: 'project',
      title: 'New Candidate Application 📥',
      message: 'Devon Okafor just applied for a Frontend Engineer slot on your DevPulse project!',
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      avatarClass: 'avatar-emerald',
      initials: 'DO',
      badgeType: 'badge-app',
      badgeIcon: '📥',
      actions: [
        { label: 'Review Profile', action: 'view_profile', payload: 'tm-4' },
        { label: 'Accept to Squad', action: 'accept_candidate', payload: 'tm-4' }
      ]
    });
  }, 6000);
});
