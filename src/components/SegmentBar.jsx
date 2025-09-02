// src/components/SegmentBar.jsx
export default function SegmentBar({ segments, currentIndex=0, currentPct=0 }){
  const total = segments.reduce((s, seg) => s + (seg.min||0), 0) || 1
  return (
    <div style={{
      display:'flex', gap:4, alignItems:'stretch',
      border:'1px solid var(--line)', borderRadius:12, padding:6, background:'#0b1220'
    }}>
      {segments.length === 0 ? (
        <div className="muted" style={{padding:'4px 8px'}}>אין מקטעים מוגדרים לתוכנית הזאת</div>
      ) : segments.map((seg, i) => {
        const widthPct = ((seg.min||0) / total) * 100
        const active = i === currentIndex
        return (
          <div key={i} title={`${seg.min} דק • ${seg.speed} קמ״ש`}
            style={{
              width: widthPct + '%',
              minWidth: 14,
              background: active ? 'linear-gradient(180deg,#2563eb,#1e40af)' : '#111827',
              border: '1px solid var(--line)',
              borderRadius:8,
              position:'relative',
              height: 22,
              overflow:'hidden'
            }}>
            {active && (
              <div style={{
                position:'absolute', insetInlineStart:0, top:0, bottom:0,
                width: `${Math.max(0, Math.min(100, currentPct))}%`,
                background:'rgba(255,255,255,.12)'
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}