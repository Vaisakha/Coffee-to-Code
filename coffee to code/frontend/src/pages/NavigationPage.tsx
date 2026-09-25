import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Compass,
  Navigation,
  MapPin,
  Footprints,
  ShieldAlert,
  Layers,
  Search,
  Building2,
  Sparkles,
  Accessibility,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Room } from '../types';

interface BlockInfo {
  id: string;
  name: string;
  floors: number[];
  desc: string;
}

const CAMPUS_BLOCKS: BlockInfo[] = [
  { id: 'A', name: 'Block A (Engineering & CS)', floors: [1, 2, 3], desc: 'Robotics Wing, AI Labs, Smart Classrooms' },
  { id: 'B', name: 'Block B (Science & Research)', floors: [1, 2, 3], desc: 'Bio & Quantum Physics, Seminar Auditoriums' },
  { id: 'C', name: 'Block C (Management & Arts)', floors: [1, 2], desc: 'Business Incubation Suites, Design Studio' },
  { id: 'Admin', name: 'Admin Tower', floors: [1, 2], desc: 'Deans Office, Registrar, Admissions, Health Center' },
  { id: 'Amenities', name: 'Student Central Hub', floors: [1], desc: 'Central Library, Food Lounge, Wellness Center' },
];

interface FacilityPin {
  id: string;
  block: string;
  floor: number;
  name: string;
  type: 'entrance' | 'restroom' | 'elevator' | 'exit' | 'amenity' | 'lab';
  x: number;
  y: number;
}

const FACILITY_PINS: FacilityPin[] = [
  { id: 'f1', block: 'A', floor: 1, name: 'Main Entrance & Smart Kiosk', type: 'entrance', x: 12, y: 80 },
  { id: 'f2', block: 'A', floor: 1, name: 'Restrooms (Accessible M/F)', type: 'restroom', x: 88, y: 20 },
  { id: 'f3', block: 'A', floor: 1, name: 'High-Speed Elevators A1', type: 'elevator', x: 50, y: 15 },
  { id: 'f4', block: 'A', floor: 1, name: 'Emergency Fire Exit West', type: 'exit', x: 6, y: 50 },
  { id: 'f5', block: 'A', floor: 2, name: 'Student Collaboration Lounge', type: 'amenity', x: 50, y: 82 },
  { id: 'f6', block: 'B', floor: 1, name: 'Quantum Optics Laboratory', type: 'lab', x: 30, y: 40 },
  { id: 'f7', block: 'B', floor: 1, name: 'Emergency Fire Exit East', type: 'exit', x: 92, y: 50 },
  { id: 'f8', block: 'Amenities', floor: 1, name: 'Campus Health Clinic & First Aid', type: 'amenity', x: 25, y: 30 },
  { id: 'f9', block: 'Amenities', floor: 1, name: 'Central Food Court & Cafe', type: 'amenity', x: 70, y: 65 },
];

interface ActiveRoute {
  from: string;
  to: string;
  distance: string;
  time: string;
  emergency?: boolean;
  steps: string[];
}

const NavigationPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedBlock, setSelectedBlock] = useState<string>('A');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [routeFrom, setRouteFrom] = useState<string>('Main Entrance (Block A)');
  const [routeTo, setRouteTo] = useState<string>('');
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        setRooms(res.data.rooms || []);
      } catch (err) {
        console.error('Failed to sync rooms for wayfinding:', err);
      }
    };
    fetchRooms();
  }, []);

  const currentBlockData = CAMPUS_BLOCKS.find((b) => b.id === selectedBlock) || CAMPUS_BLOCKS[0];

  const blockRooms = rooms.filter((r) => {
    const matchBlock = r.block === selectedBlock;
    const matchFloor = r.floor ? r.floor === selectedFloor : true;
    const matchType = filterType === 'all' || r.type === filterType;
    const matchSearch =
      searchQuery === '' ||
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBlock && matchFloor && matchType && matchSearch;
  });

  const blockFacilities = FACILITY_PINS.filter(
    (f) => f.block === selectedBlock && f.floor === selectedFloor
  );

  const handleFindRoute = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!routeTo) {
      toast.error('Select a destination space or room');
      return;
    }

    const steps = [
      `Depart from ${routeFrom}`,
      accessibleOnly ? 'Take central elevator to designated floor' : 'Take stairs or express elevator',
      `Walk down main arterial corridor toward ${selectedBlock} sector`,
      `Follow blue wayfinding lighting strip to corridor node 3`,
      `Arrive at destination: ${routeTo}`,
    ];

    setActiveRoute({
      from: routeFrom,
      to: routeTo,
      distance: '125 meters',
      time: accessibleOnly ? '3 mins (step-free route)' : '1.5 mins walk',
      steps,
    });
    toast.success(`Wayfinding path calculated to ${routeTo}`);
  };

  const triggerEmergencyRoute = () => {
    const nearestExit = blockFacilities.find((f) => f.type === 'exit') || {
      name: 'Primary Fire Exit A-West',
    };
    setRouteTo(`${nearestExit.name}`);
    setActiveRoute({
      from: 'Your current location',
      to: nearestExit.name,
      distance: '35 meters',
      time: '30 seconds',
      emergency: true,
      steps: [
        'Follow green illuminated floor emergency beacons',
        'Do NOT use elevators during alarm state; use emergency stairwell',
        `Discharge immediately through ${nearestExit.name}`,
        'Proceed to Central Campus Assembly Grid Point 2',
      ],
    });
    toast.error('Emergency evacuation route highlighted!', { duration: 6000 });
  };

  return (
    <div className="page-content animate-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Compass size={28} color="var(--primary)" />
            <span>Interactive Wayfinder & Indoor Map</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Multi-block precision indoor routing with live room occupancy & emergency exit calculation
          </p>
        </div>

        <button
          onClick={triggerEmergencyRoute}
          className="btn btn-danger"
          id="nav-emergency-exit-btn"
        >
          <ShieldAlert size={18} />
          <span>Nearest Emergency Exit</span>
        </button>
      </div>

      {/* Block Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {CAMPUS_BLOCKS.map((block) => (
          <button
            key={block.id}
            onClick={() => {
              setSelectedBlock(block.id);
              setSelectedFloor(1);
              setSelectedRoom(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              border: selectedBlock === block.id ? '2px solid var(--primary)' : '1px solid var(--surface-glass-border)',
              background: selectedBlock === block.id ? 'var(--primary-light)' : 'white',
              color: selectedBlock === block.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: selectedBlock === block.id ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)',
              boxShadow: selectedBlock === block.id ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Building2 size={16} />
            <span>{block.name}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Map & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '1.6rem', alignItems: 'start' }}>
        {/* Left Column: Interactive Map Canvas */}
        <div className="card" style={{ padding: '1.6rem' }}>
          {/* Floor & Filter Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.4rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--surface-glass-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                FLOOR:
              </span>
              {currentBlockData.floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => {
                    setSelectedFloor(floor);
                    setSelectedRoom(null);
                  }}
                  className={`btn btn-sm ${selectedFloor === floor ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: '70px' }}
                >
                  Level {floor}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <input
                className="form-input"
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.84rem', width: '180px' }}
              />
            </div>
          </div>

          {/* SVG Floor Map Grid */}
          <div
            style={{
              background: '#0f172a',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              position: 'relative',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Background Grid Lines */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: 0.15,
              }}
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Simulated Interactive Corridor Nodes */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '1rem',
              }}
            >
              {blockRooms.slice(0, 8).map((room) => {
                const isSelected = selectedRoom?._id === room._id;
                const isAvail = room.current_status === 'available';

                return (
                  <div
                    key={room._id}
                    onClick={() => {
                      setSelectedRoom(room);
                      setRouteTo(`${room.name} (Block ${room.block})`);
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected
                        ? 'rgba(79, 70, 229, 0.4)'
                        : 'rgba(30, 41, 59, 0.85)',
                      border: isSelected
                        ? '2px solid #818cf8'
                        : `1px solid ${isAvail ? '#10b981' : '#64748b'}`,
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                      Block {room.block}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0.2rem 0' }}>
                      {room.name}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: isAvail ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: isAvail ? '#34d399' : '#f87171',
                        border: `1px solid ${isAvail ? '#059669' : '#dc2626'}`,
                      }}
                    >
                      {room.current_status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Facilities Indicator Bar */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              {blockFacilities.map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.78rem',
                    color: '#cbd5e1',
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <MapPin size={12} color="#818cf8" />
                  <span>{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Routing Controls & Turn-by-Turn Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Wayfinder Route Planner */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Turn-by-Turn Route</div>
                <div className="card-subtitle">Calculate step-by-step path</div>
              </div>
              <Navigation size={22} color="var(--primary)" />
            </div>

            <form onSubmit={handleFindRoute} id="route-planner-form">
              <div className="form-group">
                <label className="form-label">Starting Point</label>
                <input
                  className="form-input"
                  type="text"
                  value={routeFrom}
                  onChange={(e) => setRouteFrom(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Destination</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Click a room on map or type..."
                  value={routeTo}
                  onChange={(e) => setRouteTo(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <input
                  type="checkbox"
                  id="accessible-route-toggle"
                  checked={accessibleOnly}
                  onChange={(e) => setAccessibleOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <label
                  htmlFor="accessible-route-toggle"
                  style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Accessibility size={15} />
                  <span>Accessible Path (Elevators & Ramps Only)</span>
                </label>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} type="submit">
                <Footprints size={18} />
                <span>Calculate Best Route</span>
              </button>
            </form>
          </div>

          {/* Active Navigation Path Preview */}
          {activeRoute && (
            <div
              className="card"
              style={{
                borderLeft: `4px solid ${activeRoute.emergency ? 'var(--emergency)' : 'var(--primary)'}`,
                animation: 'fadeIn 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                    Path to: {activeRoute.to}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {activeRoute.distance} · Estimated: {activeRoute.time}
                  </div>
                </div>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: activeRoute.emergency ? 'var(--error-light)' : 'var(--primary-light)',
                    color: activeRoute.emergency ? 'var(--error-dark)' : 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                  }}
                >
                  {activeRoute.emergency ? 'Urgent Exit' : 'Optimized'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {activeRoute.steps.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;
