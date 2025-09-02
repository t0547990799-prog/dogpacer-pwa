export default function Safety(){
  return (
    <>
      <h1>בטיחות ושגרות מומלצות</h1>

      <div className="card">
        <strong>לפני תחילת אימון</strong>
        <ul style={{marginRight:18, lineHeight:1.6}}>
          <li>בדיקת ציוד: משטח נקי, רצועה/רתמה מתאימה.</li>
          <li>חימום 3–5 דקות במהירות נמוכה.</li>
          <li>מים זמינים; לא להאכיל ארוחה גדולה לפני אימון.</li>
        </ul>
      </div>

      <div className="card">
        <strong>במהלך האימון</strong>
        <ul style={{marginRight:18, lineHeight:1.6}}>
          <li>השגחה צמודה: נשימות, לשון, יציבה.</li>
          <li>טמפ׳ גוף מומלצת ~38–39°C; מעל 39.5°C – עצור ומנוחה.</li>
          <li>לשמור על מהירות מתאימה; ללא משיכות ברצועה.</li>
        </ul>
      </div>

      <div className="card">
        <strong>בסיום</strong>
        <ul style={{marginRight:18, lineHeight:1.6}}>
          <li>קירור 2–3 דקות במהירות נמוכה.</li>
          <li>שתייה ומנוחה.</li>
          <li>רישום מדדים באפליקציה.</li>
        </ul>
      </div>
    </>
  )
}