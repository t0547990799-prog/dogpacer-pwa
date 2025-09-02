// src/utils/tts.js
export function speak(text){
  try{
    const u = new SpeechSynthesisUtterance(text)
    // העדפה לקול עברי אם קיים
    const voices = window.speechSynthesis.getVoices()
    const heVoice = voices.find(v => /he-|Hebrew/i.test(v.lang))
    if (heVoice) u.voice = heVoice
    u.lang = heVoice?.lang || 'he-IL'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }catch(e){
    console.warn('TTS error', e)
  }
}
export function stopSpeak(){
  try{ window.speechSynthesis.cancel() }catch(e){}
}