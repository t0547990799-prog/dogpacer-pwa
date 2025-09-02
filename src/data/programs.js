// תוכניות מובנות עם segments לפי הטבלה (ערכים נשארים בדיוק כפי שבמקור).
const makeSegments = (arr) =>
  arr.map((v, i) => ({ minute: i + 1, speedKmh: v, inclinePercent: 0 }))

const P1 = [
  1.5, 2, 2, 2.5, 2, 2, 3, 2, 2.5, 2,
  2, 1.5, 2.5, 2, 1.5, 2, 2.5, 2, 2.5, 1.5,
  2, 3, 3, 2, 3, 2, 1.5, 2, 2, 2
]
const P2 = [
  1.5, 2.5, 2.5, 4, 2.5, 2.5, 5, 3, 4.5, 3,
  3, 2.5, 5.5, 4.5, 3.5, 4.5, 6, 4.5, 6, 3,
  4.5, 6, 5, 4, 6, 4.5, 3, 4, 4, 4
]
const P3 = [
  1.5, 3, 3.5, 4, 2.5, 3, 4.5, 3.5, 4, 3,
  3.5, 4.5, 5, 3.5, 4, 5, 5.5, 4, 4.5, 5.5,
  6, 4, 5, 6, 6.5, 4.5, 5, 6, 6.5, 4.5
]

export const PROGRAMS = {
  'LF-3.1': [
    { id: 'P1', name: 'P1', durationMinutes: 30, segments: makeSegments(P1) },
    { id: 'P2', name: 'P2', durationMinutes: 30, segments: makeSegments(P2) },
    { id: 'P3', name: 'P3', durationMinutes: 30, segments: makeSegments(P3) }
  ],
  'MiniPacer': [
    { id: 'P1', name: 'P1', durationMinutes: 30, segments: makeSegments(P1) },
    { id: 'P2', name: 'P2', durationMinutes: 30, segments: makeSegments(P2) },
    { id: 'P3', name: 'P3', durationMinutes: 30, segments: makeSegments(P3) }
  ]
}

export function getProgramsForModel(model) {
  return PROGRAMS[model] || []
}
export function findProgramById(programId) {
  for (const model of Object.keys(PROGRAMS)) {
    const p = PROGRAMS[model].find(x => x.id === programId)
    if (p) return { ...p, model }
  }
  return null
}