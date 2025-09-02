export default function ProgramHelp({ open, onClose, model, programId }) {
  if (!open) return null

  const progLabel = programId || 'P1/P2/P3'
  const modelLabel = model || 'LF-3.1'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <h3>איך מפעילים תוכנית מובנית ({progLabel}) על {modelLabel}?</h3>
          <button className="btn btn-ghost" onClick={onClose}>סגור</button>
        </div>

        <div className="modal-body" style={{display:'grid', gap:10}}>
          <ol style={{marginRight:18, lineHeight:1.6}}>
            <li>חבר חשמל והפעל את המכשיר.</li>
            <li>העלה את הכלב בזהירות על ההליכון (רתמה/רצועה קצרה, שליטה מלאה).</li>
            <li>בלוח הכפתורים: לחץ <em>Program / Mode</em> עד שמופיע <strong>{progLabel}</strong>.</li>
            <li>כוון זמן אם זמין ל־<strong>30 דק׳</strong> (או כפי שבחרת).</li>
            <li>לחץ <strong>Start</strong>. המהירות/שיפוע ישתנו אוטומטית.</li>
            <li>עצירה בכל רגע עם <strong>Stop</strong>. ייתכן שלחיצה ארוכה לסיום.</li>
          </ol>

          <div className="card" style={{background:'#fffceb', border:'1px solid #ffe18a', color:'#111'}}>
            <strong>טיפים בטיחותיים:</strong>
            <ul style={{marginRight:18, lineHeight:1.6}}>
              <li>חימום 3–5 דק׳; קירור 2–3 דק׳.</li>
              <li>מים זמינים; לא להאכיל ארוחה גדולה לפני אימון.</li>
              <li>טמפ׳ גוף מומלצת ~38–39°C; מעל 39.5°C – עצירה ומנוחה.</li>
            </ul>
          </div>

          <div style={{fontSize:12, color:'#666'}}>
            הערה: ייתכנו שינויים קטנים בשמות הכפתורים בין גרסאות.
          </div>
        </div>
      </div>
    </div>
  )
}