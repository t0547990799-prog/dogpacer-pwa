import { APP_NAME } from '../config'
import { auth } from '../firebase'

export default function Home(){
  const user = auth.currentUser
  const niceName = user?.displayName || user?.email || ''

  return (
    <>
      <h1 className="text-center">ברוך הבא {niceName} ל-{APP_NAME}</h1>
      <div className="card center-content">
        <p>בחר פעולה מהניווט למעלה: להוסיף אימון, לנהל כלבים, לצפות בהיסטוריה וסטטיסטיקות.</p>
      </div>
    </>
  )
}