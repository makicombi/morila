export function speakText(text: string) {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser.');
    return;
  }
  
  // Cancel any currently speaking text to avoid overlapping voices
  window.speechSynthesis.cancel();
  
  // Clean up symbols that shouldn't be read aloud
  const cleanText = text
    .replace(/---/g, '')
    .replace(/>/g, '')
    .replace(/_/g, '')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'he-IL';
  utterance.rate = 0.95; // Slightly slower for clear storytelling
  utterance.pitch = 1.0; 
  
  window.speechSynthesis.speak(utterance);
}
