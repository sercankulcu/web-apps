const userLang = navigator.language || navigator.userLanguage;
const isTurkish = userLang.startsWith('tr');

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

const pairTranslations = {
    "Outgoing/Reserved": "Dışa Dönük/Çekingen",
    "Creative/Practical": "Yaratıcı/Pratik",
    "Objective/Subjective": "Tarafsız/Taraflı",
    "Planned/Spontaneous": "Planlı/Plansız",
    "Confident/Sensitive": "Kendinden Emin/Duyarlı"
};

if (isTurkish) {
    document.querySelectorAll('.word-box').forEach(box => {
        const englishPair = box.dataset.traitPair;
        box.dataset.traitPair = pairTranslations[englishPair];
    });
}

const translations = {
    en: {
        title: "Personality Test",
        instruction: '<br>The test consists of 5 sections. </br><br>In each section, choose the words that <span style="color: red; text-decoration: underline;">DON\'T</span> describe you to proceed. </br><br>In the final section, you can view your test result.</br>',
        nextButton: "Next",
        resultTitle: "Your Personality Type:",
        welcome: "Welcome!",
        message: "Click anywhere to start the test."
    },
    tr: {
        title: "Kişilik Testi",
        instruction: '<br>Test 5 bölümden oluşmaktadır. <br></br>Her bölümde sizi <span style="color: red; text-decoration: underline;">TANIMLAMAYAN</span> kelimeleri seçerek ilerleyin. <br></br>En son bölümde test sonucunuzu görebilirsiniz.</br>',
        nextButton: "İleri",
        resultTitle: "Kişilik Tipiniz:",
        welcome: "Hoş Geldiniz!",
        message: "Teste başlamak için herhangi bir yere tıklayın."
    }
};

function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = translations[lang][key];
    });
}
setLanguage(isTurkish ? 'tr' : 'en');

// Modified traits structure with translations
/*{
"Extraverted": 45%, 
"Introverted": 55%,
"Intuitive": 70%,
"Observant": 30%,
"Thinking": 60%,
"Feeling": 40%,
"Judging": 35%,
"Prospecting": 65%,
"Assertive": 50%,
"Turbulent": 50%,
"Final Personality": "INFP-T"
}*/
const traits = {
    en: {
        "Outgoing/Reserved": {
            "Outgoing": ["Sociable", "Interactive", "Engaging", "Expressive", "Enthusiastic", "Dynamic", "Vibrant"],
            "Reserved": ["Introspective", "Quiet", "Independent", "Calm", "Self Contained", "Thoughtful", "Grounded"]
        },
        "Creative/Practical": {
            "Creative": ["Imaginative", "Visionary", "Conceptual", "Future-Oriented", "Insightful", "Perceptive", "Innovative"],
            "Practical": ["Detail-Oriented", "Realistic", "Fact-Based", "Present-Focused", "Attentive", "Analytical", "Methodical"]
        },
        "Objective/Subjective": {
            "Objective": ["Logical", "Rational", "Critical", "Problem-Solver", "Strategic", "Decisive", "Analytical"],
            "Subjective": ["Empathetic", "Caring", "Cooperative", "Supportive", "Sensitive", "Passionate", "Value-Driven"]
        },
        "Planned/Spontaneous": {
            "Planned": ["Organized", "Decisive", "Scheduled", "Methodical", "Disciplined", "Efficient", "Goal-Oriented"],
            "Spontaneous": ["Flexible", "Adaptable", "Curious", "Open-Ended", "Exploratory", "Adventurous", "Options-Oriented"]
        },
        "Confident/Sensitive": {
            "Confident": ["Decisive", "Self-Assured", "Determined", "Independent", "Proactive", "Courageous", "Direct"],
            "Sensitive": ["Emotional", "Anxious", "Self-Conscious", "Insecure", "Perfectionistic", "Concerned", "Reflective"]
        }
    },
    tr: {
        "Dışa Dönük/Çekingen": {
            "Dışa Dönük": ["Sosyal", "Canayakın", "Etkileyici", "Hevesli", "Dinamik", "Enerjik", "Girişken"],
            "Çekingen": ["Düşünceli", "Sessiz", "İçe-Dönük", "Bağımsız", "Sakin", "Kendine-Yeten", "Temkinli"]
        },
        "Yaratıcı/Pratik": {
            "Yaratıcı": ["Hayalperest", "Vizyoner", "Gelecek-Odaklı", "Anlayışlı", "Yenilikçi", "Soyut", "Büyük-Resmi-Gören"],
            "Pratik": ["Detay-Odaklı", "Gerçekçi", "Pratik", "An'a-Odaklı", "Dikkatli", "Analitik", "Metodik"]
        },
        "Tarafsız/Taraflı": {
            "Tarafsız": ["Mantıklı", "Rasyonel", "Eleştirici", "Problem-Çözücü", "Stratejik", "Kararlı", "Analitik"],
            "Taraflı": ["Empati-Kuran", "Şefkatli", "Merhametli", "Uyumlu", "İşbirlikçi", "Destekleyici", "Değer-Odaklı"]
        },
        "Planlı/Plansız": {
            "Planlı": ["Organize", "Bilinçli", "Programlı", "Metodik", "Disiplinli", "Özenli", "Hedef-Odaklı"],
            "Plansız": ["Esnek", "Meraklı", "Açık-Fikirli", "Keşfedici", "Becerikli", "Maceraperest", "Seçenek-Odaklı"]
        },
        "Kendinden Emin/Duyarlı": {
            "Kendinden Emin": ["Kararlı", "Kendinden-Emin", "Azimli", "Bağımsız", "Cesur", "Güçlü", "Dik-Duruşlu"],
            "Duyarlı": ["Duyarlı", "Duygusal", "Endişeli", "Güvensiz", "Mükemmeliyetçi", "Değişken", "Düşünceli"]
        }
    }
};

let currentStage = 1;
let results = {};
const colorPalette = [
    "#FFCCCC", "#FF9999", "#FF6666", // Açık Kırmızı Tonları
    "#FFDDC1", "#FFBB99", "#FFA07A", // Açık Turuncu Tonları
    "#FFFF99", "#FFFF66", "#FFEE99", // Açık Sarı Tonları
    "#CCFFFF", "#99FFFF", "#66FFFF", // Açık Camgöbeği Tonları
    "#CCE5FF", "#99CCFF", "#66B3FF", // Açık Mavi Tonları
    "#CCFFCC", "#99FF99", "#66FF66", // Açık Yeşil Tonları
    "#E6E6FA", "#D8BFD8", "#DDA0DD", // Açık Mor Tonları
    "#FFD9E6", "#FFB6C1", "#FFAEC9", // Açık Pembe Tonları
    "#F5F5DC", "#FAEBD7", "#FFF8DC", // Açık Bej ve Krem Tonları
    "#F0F8FF", "#E0FFFF", "#F0FFF0", // Açık Pastel Tonları
    "#D3D3D3", "#C0C0C0", "#E8E8E8", // Açık Gri Tonları
    "#FFF0F5", "#FFE4E1", "#FFFAF0", // Açık Şeftali ve Pudra Tonları
    "#F8F8FF", "#F5FFFA", "#FFFFF0"  // Açık Nötr ve Beyaz Tonlar
];

function initializeTest() {
    const currentLang = isTurkish ? 'tr' : 'en';
    const currentTraits = traits[currentLang];

    document.querySelectorAll('.word-box').forEach((container, index) => {
        const pair = container.dataset.traitPair;
        const traitData = currentTraits[pair];
        const words = [...traitData[Object.keys(traitData)[0]], ...traitData[Object.keys(traitData)[1]]];

        container.innerHTML = words.map(word => {
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            return `<div class="word-item" 
                        data-trait="${getTraitForWord(currentTraits, pair, word)}"
                        style="background: ${color};">
                        ${word}
                    </div>`;
        }).join('');
    });

    document.querySelectorAll('.word-item').forEach(item => {
        item.addEventListener('click', function () {
            toggleWord(this);
        });
    });

    placeWordsEvenly();
}


function getTraitForWord(currentTraits, pair, word) {
    const traitPair = currentTraits[pair];
    for (const trait of Object.keys(traitPair)) {
        if (traitPair[trait].includes(word)) {
            return trait;
        }
    }
}

function toggleWord(element) {
    element.classList.toggle('popped');
    document.getElementById('nextBtn').disabled = false;
}

const boxWidth = window.innerWidth * 0.9; // Sayfa genişliği
const boxHeight = window.innerHeight * 0.75; // Sayfa yüksekliği

function nextStage() {
    const currentContainer = document.querySelector(`#stage${currentStage} .word-box`);
    const remainingWords = Array.from(currentContainer.querySelectorAll('.word-item:not(.popped)'));

    const traitPair = currentContainer.dataset.traitPair.split('/');
    const traitCounts = {
        [traitPair[0]]: 0,
        [traitPair[1]]: 0
    };

    remainingWords.forEach(word => {
        const trait = word.dataset.trait;
        traitCounts[trait]++;
    });

    const result = traitCounts[traitPair[0]] > traitCounts[traitPair[1]] ? traitPair[0] : traitPair[1];
    results[currentStage] = result;

    if (currentStage < 5) {
        document.querySelector(`#stage${currentStage}`).classList.remove('active-stage');
        currentStage++;
        document.querySelector(`#stage${currentStage}`).classList.add('active-stage');
        document.querySelector('.progress').style.width = `${(currentStage - 1) * 20}%`;
        document.getElementById('nextBtn').disabled = true;

        placeWordsEvenly();
    } else {
        showResults();
    }
}

function showResults() {
    const lang = isTurkish ? 'tr' : 'en';
    document.getElementById('nextBtn').style.display = 'none';
    document.querySelector('.progress').style.width = '100%';
    document.getElementById('result').style.display = 'block';

    const resultHTML = `
                <h2>${translations[lang].resultTitle}</h2>
                <h2>...</h2>
                <p>${results[1]} | ${results[2]} | ${results[3]} | ${results[4]} | ${results[5]}</p>
            `;

    document.getElementById('result').innerHTML = resultHTML;
}

document.getElementById('initialMessage').addEventListener('click', () => {
    document.getElementById('initialMessage').style.display = 'none';
});

document.getElementById('result').addEventListener('click', () => {
    document.getElementById('result').style.display = 'none';
    if (window.parent !== window) {
        window.parent.showMainContent();
    } else {
        window.location.href = 'index.html';
    }
});

const containerWidth = window.innerWidth;
const containerHeight = window.innerHeight;

function placeWordsEvenly() {

    const wordBox = document.querySelector(`#stage${currentStage} .word-box`);
    const words = Array.from(wordBox.children); // Kelime elemanlarını al

    let rows, cols;
    if (boxHeight > boxWidth) {
        rows = 5;
        cols = 3;
    } else {
        rows = 3;
        cols = 5;
    }

    const cellWidth = (containerWidth * 0.8) / cols;
    const cellHeight = (containerHeight * 0.8) / rows;

    words.forEach((word, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = col * cellWidth * (1.1 + (Math.random() * 0.2));
        const y = row * cellHeight + (Math.random() * 0.4) * cellHeight;

        word.innerHTML = word.innerHTML.replace(/-/g, '<br>');
        word.style.left = `${x}px`;
        word.style.top = `${y}px`;

    });

    document.getElementById('nextBtn').addEventListener('click', nextStage);

}

initializeTest();