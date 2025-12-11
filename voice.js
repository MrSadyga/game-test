// voice.js — настройка мягкого голоса

let softVoice = null;

// выбираем подходящий голос
function pickSoftVoice() {
  if (!('speechSynthesis' in window)) {
    console.warn('speechSynthesis не поддерживается в этом браузере');
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  console.log('Найдено голосов:', voices.length, voices);

  if (!voices || !voices.length) {
    return;
  }

  const preferredNames = ['Google русский', 'Milena', 'Irina', 'Katya', 'Maria'];

  softVoice =
    voices.find(v =>
      v.lang && v.lang.toLowerCase().startsWith('ru') &&
      preferredNames.some(name => v.name.toLowerCase().includes(name.toLowerCase()))
    ) ||
    voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ru')) ||
    voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) ||
    null;

  console.log('Выбранный голос:', softVoice);
}

// инициализация голосов
if ('speechSynthesis' in window) {
  // на некоторых браузерах голоса приходят асинхронно
  window.speechSynthesis.onvoiceschanged = () => {
    console.log('onvoiceschanged сработал');
    pickSoftVoice();
  };

  // запасной вызов, если onvoiceschanged не сработает
  setTimeout(() => {
    if (!softVoice) {
      console.log('Повторный вызов pickSoftVoice по таймеру');
      pickSoftVoice();
    }
  }, 1000);
}

// функция озвучки
function speak(text, lang = 'ru-RU') {
  if (!('speechSynthesis' in window)) {
    console.warn('speechSynthesis не поддерживается в этом браузере');
    return;
  }

  if (!softVoice) {
    console.warn('Голос ещё не загружен или не найден, текст:', text);
    // можно всё равно попробовать без явного выбора голоса
    const fallbackUtter = new SpeechSynthesisUtterance(text);
    fallbackUtter.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(fallbackUtter);
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