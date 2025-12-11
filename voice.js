// voice.js — настройка мягкого голоса

let softVoice = null;

function pickSoftVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || !voices.length) return;

  const preferredNames = ['Google русский', 'Milena', 'Irina', 'Katya', 'Maria'];

  softVoice =
    voices.find(v =>
      v.lang.startsWith('ru') &&
      preferredNames.some(name => v.name.toLowerCase().includes(name.toLowerCase()))
    )
    || voices.find(v => v.lang.startsWith('ru'))
    || voices.find(v => v.lang.startsWith('en'))
    || null;
}

if ('speechSynthesis' in window) {
  pickSoftVoice();
  window.speechSynthesis.onvoiceschanged = pickSoftVoice;
}

function speak(text, lang = 'ru-RU') {
  if (!('speechSynthesis' in window)) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;

  if (softVoice) {
    utter.voice = softVoice;
  }

  utter.rate = 0.8;
  utter.pitch = 0.9;
  utter.volume = 0.9;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}