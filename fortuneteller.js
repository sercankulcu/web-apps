const lang = navigator.language || navigator.userLanguage;
const isTurkish = lang === "tr";

const translations = {
  title: {
    en: "Mystical Fortune Teller",
    tr: "Mistik Falcı"
  },
  message: {
    en: "Tap the crystal ball to reveal your daily fortune...",
    tr: "Kristal küreye dokunarak günlük falınızı görün..."
  },
  initialMessage: {
    en: `
  <p>Click the title <strong>(Mystical Fortune Teller)</strong> to return to the main page.</p>
  <p>Tap the crystal ball to see your daily fortune.</p>
`,
    tr: `
  <p>Ana sayfaya dönmek için başlığa <strong>(Mistik Falcı)</strong> tıklayınız.</p>
  <p>Günlük falınızı görmek için küreye tıklayınız.</p>
`
  }
};

import { fortunesTR, fortunesEN } from 'https://sercankulcu.github.io/game/fortuneteller.js';

const fortunes = isTurkish ? fortunesTR : fortunesEN;

document.getElementById('initialMessage').innerHTML = isTurkish
  ? translations.initialMessage.tr
  : translations.initialMessage.en;

document.getElementById('title').textContent = isTurkish ?
  translations.title.tr : translations.title.en;
document.getElementById('fortune').textContent = isTurkish ?
  translations.message.tr : translations.message.en;

const titleElement = document.getElementById('title');
titleElement.addEventListener('click', function () {
  if (window.parent !== window) {
    window.parent.showMainContent();
  } else {
    window.location.href = 'index.html';
  }
});

const infoButton = document.getElementById('infoButton');
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('closeButton');

infoButton.addEventListener('click', () => {
  overlay.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  overlay.style.display = 'none';
});

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char; // Bitwise operation for mixing
    hash = hash & hash; // Ensure it stays within 32-bit integer bounds
  }
  return Math.abs(hash); // Return a positive number
}

function getUserId() {
  let userId = localStorage.getItem('dorukdayimfortuneUserId');
  if (!userId) {
    userId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    localStorage.setItem('dorukdayimfortuneUserId', userId);
  }
  return userId;
}

function getDailyFortune() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // Months are zero-indexed
  const year = today.getFullYear();
  const userId = getUserId();
  const seed = `${year}${month}${day}${userId}`;
  const fortuneIndex = simpleHash(seed) % fortunes.length;
  return fortunes[fortuneIndex];
}

function getFortune() {
  const fortune = document.getElementById('fortune');
  const crystalBall = document.getElementById('crystal-ball');

  crystalBall.style.animation = 'pulse 0.5s';
  fortune.style.opacity = '0';

  setTimeout(() => {
    fortune.textContent = getDailyFortune();
    fortune.style.opacity = '1';
    crystalBall.style.animation = 'none';
  }, 500);
}

function shareOnTwitter() {
  const fortuneText = document.getElementById('fortune').textContent;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fortuneText)}&url=https://dorukdayim.netlify.app/fortuneteller.html&hashtags=fortuneteller`;
  window.open(twitterUrl, '_blank');
}

function shareOnWhatsApp() {
  const fortuneText = document.getElementById('fortune').textContent;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fortuneText)}%20https://dorukdayim.netlify.app/fortuneteller.html`;
  window.open(whatsappUrl, '_blank');
}

function shareOnFacebook() {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=https://dorukdayim.netlify.app/fortuneteller.html`;
  window.open(facebookUrl, '_blank');
}

function shareNative() {
  const fortuneText = document.getElementById('fortune').textContent;
  const shareData = {
    title: 'My Daily Fortune from Mystical Fortune Teller',
    text: fortuneText,
    url: 'https://dorukdayim.netlify.app/fortuneteller.html'
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Fortune shared successfully!'))
      .catch((err) => {
        console.error('Error sharing: ', err);
        alert('Failed to share natively. Try another option!');
      });
  } else {
    alert('Native sharing is not supported on this device/browser. Try another sharing option!');
  }
}

document.getElementById('crystal-ball').addEventListener('click', getFortune);

document.getElementById('native-share').addEventListener('click', shareNative);
document.getElementById('twitter-share').addEventListener('click', shareOnTwitter);
document.getElementById('whatsapp-share').addEventListener('click', shareOnWhatsApp);
document.getElementById('facebook-share').addEventListener('click', shareOnFacebook);

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});