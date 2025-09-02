// src/programs/library.js
// כל המהירויות מוצגות כ-"קמ״ש" לפי המדריך שלך. אין המרות אוטומטיות.

export const UNITS = 'קמ״ש'

// מבנה כל Segment:
// { min: מספר דקות, speed: מספר מהירות בקמ״ש, note?: אופציונלי }
export const PROGRAMS = {
  P1: {
    id: 'P1',
    name: 'P1 - הליכה קלה',
    note: 'מהירויות מוצגות כ-קמ״ש לפי המדריך שלך',
    segments: [
      // TODO: הכנס את המקטעים המדויקים מהמדריך
      // דוגמה בלבד (מחק כשתכניס אמת):
      // { min: 3, speed: 2.0 },
      // { min: 3, speed: 2.5 },
      // { min: 3, speed: 3.0 },
      // { min: 3, speed: 2.0 },
    ]
  },
  P2: { id: 'P2', name: 'P2', segments: [] },
  P3: { id: 'P3', name: 'P3', segments: [] },
  P4: { id: 'P4', name: 'P4', segments: [] },
  P5: { id: 'P5', name: 'P5', segments: [] },
  P6: { id: 'P6', name: 'P6', segments: [] },
  P7: { id: 'P7', name: 'P7', segments: [] },
  P8: { id: 'P8', name: 'P8', segments: [] },
  P9: { id: 'P9', name: 'P9', segments: [] },
  P10:{ id: 'P10', name: 'P10', segments: [] },
  P11:{ id: 'P11', name: 'P11', segments: [] },
  P12:{ id: 'P12', name: 'P12', segments: [] },
}

// עוזרים
export function totalMinutes(segments){
  return segments.reduce((sum, s) => sum + (s.min||0), 0)
}
export function avgSpeed(segments){
  const mins = totalMinutes(segments)
  if (!mins) return 0
  let sum = 0
  segments.forEach(s => { sum += (s.speed||0) * (s.min||0) })
  return +(sum / mins).toFixed(2)
}