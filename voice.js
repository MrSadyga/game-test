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
    ) ||
    voices.find(v => v.lang.startsWith('ru')) ||
    voices.find(v => v.lang.startsWith('en')) ||
    null;
}

// сначала проверяем поддержку
if ('speechSynthesis' in window) {
  // голоса могут прийти асинхронно
  window.speechSynthesis.onvoiceschanged = pickSoftVoice;
  // и один раз дергаем с задержкой на случай, если onvoiceschanged не сработает
  setTimeout(pickSoftVoice, 500);
}

function speak(text, lang = 'ru-RU') {
  if (!('speechSynthesis' in window)) {
    console.warn('speechSynthesis не поддерживается');
    return;
  }

  if (!softVoice) {
    console.warn('Голос ещё не загружен');
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.voice = softVoice;
  utter.rate = 0.8;
  utter.pitch = 0.9;
  utter.volume = 0.9;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}