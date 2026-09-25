import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { StaffShift, StaffRole } from '../types';
import { DAYS_OF_WEEK, SHIFT_BLOCKS } from '../lib/shiftUtils';
import { 
  Users, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  Flame, 
  Plus, 
  Trash2, 
  Sparkles,
  Info,
  DollarSign,
  Coffee,
  ChefHat
} from 'lucide-react';

export const StaffShiftPlanner: React.FC = () => {
  const { 
    staffList, 
    staffShifts, 
    addStaffShift, 
    removeStaffShift, 
    shiftAnalysis, 
    shiftLoadSnapshots, 
    recordCurrentShiftSnapshot, 
    canteen 
  } = useCanteen();

  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedSlotForAssign, setSelectedSlotForAssign] = useState<{ day: number; start: string; end: string } | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');

  const { recommendations, estimatedLaborHoursSaved, chaosRiskHoursReduced } = shiftAnalysis;

  const handleOpenAssign = (day: number, start: string, end: string) => {
    setSelectedSlotForAssign({ day, start, end });
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedSlotForAssign || !selectedStaffId) return;
    await addStaffShift({
      staff_id: selectedStaffId,
      canteen_id: canteen.id,
      shift_start: selectedSlotForAssign.start,
      shift_end: selectedSlotForAssign.end,
      day_of_week: selectedSlotForAssign.day,
    });
    setAssignModalOpen(false);
  };

  const getRoleIcon = (role: StaffRole) => {
    switch (role) {
      case 'cook': return '🍳 Cook';
      case 'counter': return '💳 Counter';
      case 'cleaner': return '🧹 Cleaner';
    }
  };

  const getRoleColor = (role: StaffRole) => {
    switch (role) {
      case 'cook': return '#D97706';
      case 'counter': return '#0284C7';
      case 'cleaner': return '#059669';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Snapshot Control */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px 26px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" style={{ backgroundColor: 'var(--brand-orange)' }} />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--brand-orange)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Labor Load Matching & Staffing Optimization
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginTop: '2px'
          }}>
            Canteen Staff Shift Management
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Cross-references ticket volume history (🟢 Chill / 🟡 Busy / 🔴 Chaotic) to prevent understaffed rush hour bottlenecks and curb labor waste.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.84rem', background: '#FAF7F2', borderColor: '#E8E2D6', fontWeight: 700 }}
          onClick={recordCurrentShiftSnapshot}
          title="Sample current active ticket load into the historical snapshot engine"
        >
          <TrendingUp size={15} color="var(--brand-orange)" /> Sample Live Mood Radar Snapshot
        </button>
      </div>

      {/* Advisory Efficiency Metrics KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Weekly Chaos-Risk Hours Prevented
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#DC2626', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {chaosRiskHoursReduced} <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)' }}>hrs/wk</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Prevents SLA prep overtime during peak lunch rushes.
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Estimated Idle Labor-Hours Saved
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {estimatedLaborHoursSaved} <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)' }}>hrs/wk</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            From trimming overstaffed chill blocks and morning prep.
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Active Advisory Recommendations
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#D97706', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {recommendations.length} <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)' }}>slots flagged</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Advisory only: manual manager discretion preserved.
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Roster Staff
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {staffList.length} <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)' }}>active staff</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {staffList.filter(s => s.role === 'cook').length} Cooks • {staffList.filter(s => s.role === 'counter').length} Counters • {staffList.filter(s => s.role === 'cleaner').length} Cleaners
          </div>
        </div>
      </div>

      {/* Advisory Recommendation Alerts Banner */}
      {recommendations.length > 0 && (
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FCD34D',
          borderRadius: '20px',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertTriangle size={18} color="#D97706" />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#92400E' }}>
              Advisory Labor-Load Recommendations ({recommendations.length})
            </h4>
            <span style={{ fontSize: '0.74rem', background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              Advisory Only
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
            {recommendations.slice(0, 4).map((rec, i) => {
              const isUnder = rec.status === 'UNDERSTAFFED';
              return (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    border: isUnder ? '1.5px solid #FCA5A5' : '1.5px solid #A7F3D0',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, color: isUnder ? '#DC2626' : '#059669' }}>
                      {rec.dayName} • {rec.timeSlot}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isUnder ? '#FEE2E2' : '#D1FAE5',
                      color: isUnder ? '#991B1B' : '#065F46'
                    }}>
                      {isUnder ? '⚠️ UNDERSTAFFED' : '📉 OVERSTAFFED'}
                    </span>
                  </div>

                  <p style={{ color: '#4B5563', lineHeight: 1.4, margin: '4px 0 6px' }}>
                    {rec.actionAdvice}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#6B7280', borderTop: '1px solid #F3F4F6', paddingTop: '4px' }}>
                    <span>Scheduled: <strong>{rec.currentStaffCount}</strong></span>
                    <span>Recommended: <strong>{rec.recommendedStaffCount}</strong></span>
                    <span>History: <strong>{rec.historicalMood}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Shift Grid Calendar */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Day selector tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Weekly Shift Calendar View
          </h4>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[1, 2, 3, 4, 5, 6].map((dayNum) => {
              const isSelected = selectedDay === dayNum;
              const dayShiftsCount = staffShifts.filter(s => s.day_of_week === dayNum).length;
              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid var(--brand-orange)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--brand-orange)' : '#FAF7F2',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{DAYS_OF_WEEK[dayNum]}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 5px',
                    borderRadius: '999px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#E8E2D6',
                    color: isSelected ? '#FFFFFF' : 'var(--text-primary)'
                  }}>
                    {dayShiftsCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Blocks Grid for Selected Day */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {SHIFT_BLOCKS.map((block) => {
            const shiftsInBlock = staffShifts.filter(
              s => s.day_of_week === selectedDay && s.shift_start <= block.start && s.shift_end >= block.end
            );

            // Historical snapshot data for this block
            const snapshot = shiftLoadSnapshots.find(
              snap => snap.shift_start === block.start && snap.shift_end === block.end
            );

            const mood = snapshot?.mood_level || (block.id === 'lunch' ? 'CHAOTIC' : block.id === 'evening' ? 'BUSY' : 'CHILL');

            return (
              <div
                key={block.id}
                style={{
                  background: '#FAF7F2',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px'
                }}
              >
                <div>
                  {/* Block Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                        {block.label}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={12} /> {block.start} - {block.end} ({block.durationHours}h)
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: mood === 'CHAOTIC' ? '#FEE2E2' : mood === 'BUSY' ? '#FEF3C7' : '#D1FAE5',
                      color: mood === 'CHAOTIC' ? '#DC2626' : mood === 'BUSY' ? '#D97706' : '#059669',
                      border: mood === 'CHAOTIC' ? '1px solid #FCA5A5' : mood === 'BUSY' ? '1px solid #FDE68A' : '1px solid #A7F3D0'
                    }}>
                      {mood === 'CHAOTIC' ? '🔴 CHAOTIC' : mood === 'BUSY' ? '🟡 BUSY' : '🟢 CHILL'}
                    </span>
                  </div>

                  {/* Scheduled Staff Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      SCHEDULED STAFF ({shiftsInBlock.length}):
                    </div>

                    {shiftsInBlock.length === 0 ? (
                      <div style={{ fontSize: '0.78rem', color: '#DC2626', fontStyle: 'italic', padding: '8px 0' }}>
                        ⚠️ No staff scheduled for this slot!
                      </div>
                    ) : (
                      shiftsInBlock.map((sh) => {
                        const staff = staffList.find(s => s.id === sh.staff_id);
                        if (!staff) return null;
                        return (
                          <div
                            key={sh.id}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '10px',
                              padding: '8px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.8rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: getRoleColor(staff.role),
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.68rem',
                                fontWeight: 800
                              }}>
                                {staff.name.slice(0, 1)}
                              </span>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15 }}>{staff.name}</div>
                                <div style={{ fontSize: '0.68rem', color: getRoleColor(staff.role), fontWeight: 700 }}>
                                  {getRoleIcon(staff.role)}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => removeStaffShift(sh.id)}
                              style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '2px' }}
                              title="Remove staff from slot"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Slot Footer Action */}
                <button
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    fontSize: '0.78rem',
                    padding: '8px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    borderColor: '#E8E2D6',
                    fontWeight: 700
                  }}
                  onClick={() => handleOpenAssign(selectedDay, block.start, block.end)}
                >
                  <Plus size={14} /> Assign Staff
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assign Staff Dialog Modal */}
      {assignModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '420px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Assign Staff to Shift
              </h3>
              <button
                onClick={() => setAssignModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            {selectedSlotForAssign && (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Slot: <strong>{DAYS_OF_WEEK[selectedSlotForAssign.day]}</strong> ({selectedSlotForAssign.start} - {selectedSlotForAssign.end})
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                SELECT ROSTER STAFF:
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#FAF7F2',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({getRoleIcon(st.role)})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px' }}
                onClick={() => setAssignModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1.4, padding: '10px' }}
                onClick={handleConfirmAssign}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
