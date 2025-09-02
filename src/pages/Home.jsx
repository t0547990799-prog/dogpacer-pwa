// src/pages/Home.jsx
export default function Home(){
  return (
    <main className="container">
      <div className="grid-2">
        <div className="card">
          <h2>ברוך הבא ל-dogPACER coach</h2>
          <p className="muted">בחר פעולה מהניווט למעלה או התחל כאן:</p>

          <div className="row" style={{flexWrap:'wrap', marginTop:12}}>
            <a className="btn" href="/workout">התחל אימון</a>
            <a className="btn ghost" href="/dogs">נהל כלבים</a>
            <a className="btn ghost" href="/history">היסטוריה</a>
            <a className="btn ghost" href="/stats">סטטיסטיקות</a>
          </div>
        </div>

        <div className="panel">
          <h3>טיפים מהירים</h3>
          <ul style={{margin:'8px 0 0 0', paddingInlineStart: '18px'}}>
            <li>להתחיל – הוסף כלב ואז בצע אימון ראשון.</li>
            <li>סטטיסטיקות מתעדכנות לאחר שמירת אימונים.</li>
            <li>RTL מלא, מתאים למובייל ולדסקטופ.</li>
          </ul>
        </div>
      </div>
    </main>
  )
}