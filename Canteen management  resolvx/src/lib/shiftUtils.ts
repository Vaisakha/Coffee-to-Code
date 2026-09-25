import { Staff, StaffShift, ShiftLoadSnapshot, ShiftRecommendation, CanteenLoad } from '../types';

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const SHIFT_BLOCKS = [
  { id: 'morning', label: 'Morning Prep & Breakfast', start: '07:30', end: '11:00', durationHours: 3.5 },
  { id: 'lunch', label: 'Lunch Rush (Peak)', start: '11:00', end: '15:00', durationHours: 4.0 },
  { id: 'evening', label: 'Evening Snacks & Tea', start: '15:00', end: '19:00', durationHours: 4.0 },
  { id: 'dinner', label: 'Dinner & Night Sanitization', start: '19:00', end: '21:30', durationHours: 2.5 },
];

/**
 * Cross-references shift schedules with historical load snapshots to compute
 * advisory staffing recommendations, labor-hour savings, and chaos-risk prevention metrics.
 */
export function analyzeStaffingLaborLoad(
  staffList: Staff[],
  shifts: StaffShift[],
  snapshots: ShiftLoadSnapshot[]
): {
  recommendations: ShiftRecommendation[];
  estimatedLaborHoursSaved: number;
  chaosRiskHoursReduced: number;
} {
  const recommendations: ShiftRecommendation[] = [];
  let estimatedLaborHoursSaved = 0;
  let chaosRiskHoursReduced = 0;

  // We analyze the core operating days Monday (1) to Friday (5) and Saturday (6)
  for (let day = 1; day <= 6; day++) {
    for (const block of SHIFT_BLOCKS) {
      // Find staff scheduled in this slot
      const scheduledInSlot = shifts.filter(
        s => s.day_of_week === day && s.shift_start <= block.start && s.shift_end >= block.end
      );
      const currentStaffCount = scheduledInSlot.length;

      // Find historical mood snapshot closest to this time block
      const snapshotMatch = snapshots.find(
        snap => snap.shift_start === block.start && snap.shift_end === block.end
      ) || {
        avg_active_tickets: block.id === 'lunch' ? 8 : block.id === 'evening' ? 4 : 1,
        mood_level: (block.id === 'lunch' ? 'CHAOTIC' : block.id === 'evening' ? 'BUSY' : 'CHILL') as CanteenLoad,
      };

      const mood = snapshotMatch.mood_level;
      const avgTickets = snapshotMatch.avg_active_tickets;

      let status: 'UNDERSTAFFED' | 'OVERSTAFFED' | 'OPTIMAL' = 'OPTIMAL';
      let recommendedStaffCount = currentStaffCount;
      let actionAdvice = 'Staffing level matches queue volume.';

      if (mood === 'CHAOTIC' && currentStaffCount < 3) {
        status = 'UNDERSTAFFED';
        recommendedStaffCount = Math.max(3, currentStaffCount + 1);
        actionAdvice = `Historically 🔴 CHAOTIC (${avgTickets} avg tickets). Add at least 1 cook or counter staff to prevent queue bottleneck.`;
        chaosRiskHoursReduced += block.durationHours;
      } else if (mood === 'CHILL' && currentStaffCount > 2) {
        status = 'OVERSTAFFED';
        recommendedStaffCount = Math.max(1, currentStaffCount - 1);
        actionAdvice = `Historically 🟢 CHILL (~${avgTickets} tickets). Reassign 1 staff to lunch prep or restock to optimize labor spend.`;
        estimatedLaborHoursSaved += block.durationHours;
      } else if (mood === 'BUSY' && currentStaffCount < 2) {
        status = 'UNDERSTAFFED';
        recommendedStaffCount = 2;
        actionAdvice = `🟡 BUSY rush requires at least 2 staff (1 cook + 1 counter) for optimal turnaround.`;
        chaosRiskHoursReduced += block.durationHours * 0.5;
      }

      if (status !== 'OPTIMAL') {
        recommendations.push({
          dayOfWeek: day,
          dayName: DAYS_OF_WEEK[day],
          timeSlot: block.label,
          shiftStart: block.start,
          shiftEnd: block.end,
          currentStaffCount,
          recommendedStaffCount,
          status,
          historicalMood: mood,
          avgTickets,
          actionAdvice,
        });
      }
    }
  }

  return {
    recommendations,
    estimatedLaborHoursSaved: Number(estimatedLaborHoursSaved.toFixed(1)),
    chaosRiskHoursReduced: Number(chaosRiskHoursReduced.toFixed(1)),
  };
}
