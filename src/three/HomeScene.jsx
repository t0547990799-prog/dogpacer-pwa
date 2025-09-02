// src/three/HomeScene.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Stage, Html } from '@react-three/drei'
import { Suspense, useMemo } from 'react'

// מודל הליכון “פשוט” (קופסאות) – אפשר להחליף בהמשך ל-GLTF אמיתי
function Treadmill() {
  // חלקים בסיסיים: מסילה, בסיס, ידיות
  const parts = useMemo(()=>[
    { args:[2.8, 0.1, 0.9], pos:[0, 0, 0], color:'#2b3648' },     // מסילה
    { args:[3.0, 0.12, 1.1], pos:[0,-0.12,0], color:'#18202f' },  // בסיס
    { args:[0.08, 0.8, 0.08], pos:[-1.2,0.35, 0.45], color:'#3b82f6' }, // ידית שמאל
    { args:[0.08, 0.8, 0.08], pos:[-1.2,0.35,-0.45], color:'#3b82f6' }, // ידית ימין
    { args:[0.08, 0.8, 0.08], pos:[ 1.2,0.35, 0.45], color:'#3b82f6' }, // ידית שמאל אחורית
    { args:[0.08, 0.8, 0.08], pos:[ 1.2,0.35,-0.45], color:'#3b82f6' }, // ידית ימין אחורית
    { args:[0.4, 0.1, 1.0], pos:[-1.35,0.8,0], color:'#1f2937' },       // פאנל קדמי
  ],[])

  return (
    <group>
      {parts.map((p, i)=>(
        <mesh key={i} position={p.pos} castShadow receiveShadow>
          <boxGeometry args={p.args} />
          <meshStandardMaterial color={p.color} metalness={0.2} roughness={0.7} />
        </mesh>
      ))}
      {/* "כלב" קוביה צפה (אפשר להחליף למודל) */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh position={[0,0.35,0]} castShadow>
          <boxGeometry args={[0.5,0.3,0.25]} />
          <meshStandardMaterial color={'#f59e0b'} />
        </mesh>
      </Float>
    </group>
  )
}

function SceneInner(){
  return (
    <>
      {/* תאורה/במה עם צללים רכים */}
      <Stage environment="city" intensity={0.6} contactShadow={{ blur:2, opacity:0.4 }}>
        <Treadmill />
      </Stage>
      {/* שליטה במצלמה – נוח בדסקטופ, עדין במובייל */}
      <OrbitControls enablePan={false} minDistance={4} maxDistance={8} />
    </>
  )
}

export default function HomeScene(){
  // DPI אדפטיבי – לשמור על ביצועים במובייל
  const dpr = typeof window !== 'undefined' && window.devicePixelRatio ? [1, Math.min(2, window.devicePixelRatio)] : [1,2]

  return (
    <div className="three-hero">
      <Canvas dpr={dpr} shadows camera={{ position:[4,2.5,4], fov:50 }}>
        <color attach="background" args={['#0b1220']} />
        <Suspense fallback={<Html><div className="card">טוען תלת־מימד…</div></Html>}>
          <SceneInner />
        </Suspense>
      </Canvas>
    </div>
  )
}