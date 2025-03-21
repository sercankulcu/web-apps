import { positions, modes, tarotDeck, cardMeanings, translations } from 'https://sercankulcu.github.io/game/tarot/tarot.js';

let currentLanguage = 'tr';
let drawnCards = [];
let drawnCardsClicked = [];

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

function drawCards() {
  const cardContainer = document.getElementById('card-container');
  const reading = document.getElementById('reading');
  cardContainer.innerHTML = '';
  reading.innerHTML = '';

  drawnCards = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * tarotDeck['en'].length);
    const card = tarotDeck['en'][randomIndex];
    drawnCards.push(card);

    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerHTML = `
        <div class="card-front"></div>
        <div class="card-back"></div>
    `;
    cardElement.querySelector('.card-front').style.backgroundImage = `url(https://sercankulcu.github.io/game/tarot/${card.toLowerCase().replace(/ /g, '-')}.jpg)`;
    cardElement.addEventListener('click', () => flipCard(cardElement, card));
    cardContainer.appendChild(cardElement);
  }

  reading.textContent = translations[currentLanguage].clickToReveal;
}

function flipCard(cardElement, card) {
  if (!cardElement.classList.contains('flipped')) {
    cardElement.classList.add('flipped');
    drawnCardsClicked.push(card);
    updateReading(card);
  }
}

function updateReading(card) {
  const reading = document.getElementById('reading');
  const flippedCards = document.querySelectorAll('.card.flipped');

  if (flippedCards.length === 1) {
    reading.innerHTML = '';
  }

  if (flippedCards.length > 0) {
    reading.innerHTML += `<h3><center>${positions[currentLanguage][flippedCards.length - 1]} </center></h3>`;
    reading.innerHTML += `<p><strong>${card}:</strong> ${cardMeanings[card][currentLanguage][modes[flippedCards.length - 1]]}</p>`;
  }
}

function updateReadingLanguage() {
  const reading = document.getElementById('reading');
  const flippedCards = document.querySelectorAll('.card.flipped');

  if (flippedCards.length > 0) {
    reading.innerHTML = '';
    drawnCardsClicked.forEach((card, index) => {
      reading.innerHTML += `<h3><center>${positions[currentLanguage][index]} </center></h3>`;
      reading.innerHTML += `<p><strong>${card}:</strong> ${cardMeanings[card][currentLanguage][modes[index]]}</p>`;
    });
  }
}

function shareOnTwitter() {
  const reading = document.getElementById('reading').textContent;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(reading)}&url=https://dorukdayim.netlify.app/tarot.html&hashtags=tarot`;
  window.open(twitterUrl, '_blank');
}

function shareOnWhatsApp() {
  const reading = document.getElementById('reading').textContent;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reading)}%20https://dorukdayim.netlify.app/tarot.html`;
  window.open(whatsappUrl, '_blank');
}

function shareOnFacebook() {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=https://dorukdayim.netlify.app/tarot.html`;
  window.open(facebookUrl, '_blank');
}

function shareNative() {
  const reading = document.getElementById('reading').textContent;
  const shareData = {
    title: 'My Daily Fortune from Tarot Reader',
    text: reading,
    url: 'https://dorukdayim.netlify.app/tarot.html'
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

function updateLanguage(lang) {
  currentLanguage = lang;
  document.getElementById('title').textContent = translations[currentLanguage].title;

  document.querySelectorAll('.language-flag').forEach(flag => {
    flag.classList.remove('active');
    if (flag.dataset.lang === lang) {
      flag.classList.add('active');
    }
  });

  const reading = document.getElementById('reading');
  reading.textContent = translations[currentLanguage].clickToReveal;

  updateReadingLanguage();
}

document.querySelectorAll('.language-flag').forEach(flag => {
  flag.addEventListener('click', () => updateLanguage(flag.dataset.lang));
});

document.getElementById('native-share').addEventListener('click', shareNative);
document.getElementById('twitter-share').addEventListener('click', shareOnTwitter);
document.getElementById('whatsapp-share').addEventListener('click', shareOnWhatsApp);
document.getElementById('facebook-share').addEventListener('click', shareOnFacebook);

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

updateLanguage('tr');
drawCards();