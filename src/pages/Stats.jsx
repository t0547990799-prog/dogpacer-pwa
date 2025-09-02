import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function toJsDate(d){ if (!d) return new Date(0); if (d.seconds) return new Date(d.seconds*1000); return new Date(d) }
function daysAgo(n){ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-n); return d }

export default function Stats(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ (async()=>{
    setLoading(true)
    const snap = await getDocs(query(collection(db,'workouts'), where('ownerId','==', auth.currentUser.uid)))
    const arr = snap.docs.map(d=>({id:d.id, ...d.data()}))
    setItems(arr); setLoading(false)
  })() },[])

  const last7 = useMemo(()=> items.filter(x=> toJsDate(x.date) >= daysAgo(6) ),[items])
  const last30 = useMemo(()=> items.filter(x=> toJsDate(x.date) >= daysAgo(29) ),[items])

  function summarize(list){
    const totalMin = list.reduce((s,w)=> s + Math.round((w.durationSec||0)/60), 0)
    const avgFeel = list.length ? (list.reduce((s,w)=> s + (Number(w.feelScore)||0),0) / list.length).toFixed(1) : '—'
    const bpmArr = list.filter(x=>x.heartBpm).map(x=>x.heartBpm)
    const tmpArr = list.filter(x=>x.tempC).map(x=>x.tempC)
    const avgBpm = bpmArr.length ? Math.round(bpmArr.reduce((a,b)=>a+b,0)/bpmArr.length) : '—'
    const avgTemp = tmpArr.length ? (tmpArr.reduce((a,b)=>a+b,0)/tmpArr.length).toFixed(1) : '—'
    return { totalMin, avgFeel, avgBpm, avgTemp }
  }

  const s7 = summarize(last7)
  const s30 = summarize(last30)

  const series = useMemo(()=>{
    const map = new Map()
    for (let i=29; i>=0; i--){
      const d = daysAgo(i)
      const k = d.toISOString().slice(0,10)
      map.set(k, 0)
    }
    for (const w of items){
      const d = toJsDate(w.date)
      const k = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10)
      if (map.has(k)) map.set(k, map.get(k) + Math.round((w.durationSec||0)/60))
    }
    return { labels: Array.from(map.keys()), data: Array.from(map.values()) }
  }, [items])

  const chartData = useMemo(()=>({
    labels: series.labels,
    datasets: [{ label: 'דקות אימון ליום', data: series.data, borderWidth: 2, tension: 0.3, pointRadius: 2 }]
  }), [series])

  const chartOptions = useMemo(()=>({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true }, title: { display: true, text: '30 ימים אחרונים' } },
    scales: { x: { ticks:{ maxTicksLimit: 8 } }, y: { beginAtZero: true, title:{display:true, text:'דקות'} } }
  }), [])

  return (
    <>
      <h1>סטטיסטיקות</h1>

      <div className="card" style={{display:'grid', gap:8}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:8}}>
          <div className="card"><strong>7 ימים</strong><div>סה״כ דקות: {s7.totalMin}</div><div>הרגשה ממוצעת: {s7.avgFeel}</div><div>דופק ממוצע: {s7.avgBpm}</div><div>°C ממוצעת: {s7.avgTemp}</div></div>
          <div className="card"><strong>30 ימים</strong><div>סה״כ דקות: {s30.totalMin}</div><div>הרגשה ממוצעת: {s30.avgFeel}</div><div>דופק ממוצע: {s30.avgBpm}</div><div>°C ממוצעת: {s30.avgTemp}</div></div>
        </div>
      </div>

      <div className="card" style={{height:320}}>
        {loading ? 'טוען...' : <Line data={chartData} options={chartOptions} />}
      </div>
    </>
  )
}