import { useMemo } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function ProgramChart({ segments = [], title = 'מהירות לאורך זמן (קמ״ש)' }) {
  const labels = useMemo(() => segments.map(s => String(s.minute)), [segments])
  const speeds = useMemo(() => segments.map(s => s.speedKmh ?? null), [segments])

  const data = useMemo(() => ({
    labels,
    datasets: [{ label: 'מהירות (קמ״ש)', data: speeds, fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2 }]
  }), [labels, speeds])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, title: { display: true, text: title } },
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: { title: { display: true, text: 'דקות' }, ticks: { autoSkip: true, maxTicksLimit: 10 } },
      y: { title: { display: true, text: 'מהירות (קמ״ש)' }, beginAtZero: true }
    }
  }), [title])

  return <div style={{height: 300}}><Line data={data} options={options} /></div>
}