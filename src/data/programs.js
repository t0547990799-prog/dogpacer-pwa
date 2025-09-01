// src/data/programs.js
// תוכניות מובנות לפי דגם. לפי התיעוד של LF-3.1 ו-MiniPacer קיימות P1–P3.
// כרגע נשמור משך (30ד׳) ונשאיר segments ריק עד שנכניס טבלאות מהירות/שיפוע רשמיות.

export const PROGRAMS = {
  'LF-3.1': [
    { id: 'P1', name: 'P1', durationMinutes: 30, segments: [] },
    { id: 'P2', name: 'P2', durationMinutes: 30, segments: [] },
    { id: 'P3', name: 'P3', durationMinutes: 30, segments: [] }
  ],
  'MiniPacer': [
    { id: 'P1', name: 'P1', durationMinutes: 30, segments: [] },
    { id: 'P2', name: 'P2', durationMinutes: 30, segments: [] },
    { id: 'P3', name: 'P3', durationMinutes: 30, segments: [] }
  ]
};

// עוזרים
export function getProgramsForModel(model) {
  return PROGRAMS[model] || [];
}
export function findProgramById(programId) {
  for (const model of Object.keys(PROGRAMS)) {
    const p = PROGRAMS[model].find(x => x.id === programId);
    if (p) return { ...p, model };
  }
  return null;
}