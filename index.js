import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let auth, provider;

const buttonNames = [
    "hangman", "flagquiz", "fiveletters", "sixletters", "spellbee",
    "oneword", "connections", "strands", "memory", "mathmaster",
    "millionaire", "tictactoe", "basketball", "carrace", "connectfour",
    "fastreflex", "minesweeper", "sudoku", "fortuneteller", "tarot", "flipcoin", "iqtest", "personalitytest"
];

buttonNames.forEach(name => {
    document.getElementById(`${name}Button`).addEventListener('click', () => {
        loadPage(`${name}.html`);
    });
});

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const messagePopup = document.getElementById("messagePopup");
const installBtn = document.getElementById("installPWA");
const shareBtn = document.getElementById("shareBtn");

const profileBtn = document.getElementById("profileBtn");
const overlayProfile = document.getElementById("overlayProfile");
const closeProfileBtn = document.getElementById("closeProfileBtn");
const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const lastSignIn = document.getElementById("lastSignIn");
const highScoresList = document.getElementById("highScoresList");

const menuBtn = document.getElementById("menuBtn");
const menuDropdown = document.getElementById("menuDropdown");

const overlayaboutUs = document.getElementById("overlayaboutUs");
const closeaboutUsBtn = document.getElementById("closeaboutUsBtn");

const overlaygameSummaries = document.getElementById("overlaygameSummaries");
const closegameSummariesBtn = document.getElementById("closegameSummariesBtn");

fetch('/.netlify/functions/getFirebaseConfig')
    .then(response => {
        if (!response.ok) throw new Error('Config fetch failed');
        return response.json();
    })
    .then(firebaseConfig => {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        provider = new GoogleAuthProvider();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                signInBtn.style.display = "none";
                signOutBtn.style.display = "block";
                profileBtn.style.display = "block";
                showPopup(`Hoş geldin, ${user.displayName}!`);
            } else {
                signInBtn.style.display = "block";
                signOutBtn.style.display = "none";
                profileBtn.style.display = "none";
                messagePopup.style.display = "none";
            }
        });

        window.signOut = function () {
            signOut(auth)
                .then(() => {
                    showPopup("Çıkış yapıldı!");
                })
                .catch(error => console.error(error.message));
        };

        window.signInWithGoogle = function () {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    const currentTime = Date.now();
                    showPopup(`Hoş geldin, ${user.displayName}!`);
                })
                .catch(error => console.error(error.message));
        };

        signInBtn.addEventListener("click", window.signInWithGoogle);
        signOutBtn.addEventListener("click", window.signOut);
    })
    .catch(error => {
        console.error("❌ Config alınırken hata:", error);
        showPopup("Bağlantı hatası, lütfen daha sonra tekrar deneyin.");
    });

function showPopup(text) {
    messagePopup.innerText = text;
    messagePopup.style.display = "block";
    setTimeout(() => {
        messagePopup.style.display = "none";
    }, 3000);
}

// Register the service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => console.error(error.message));
    });
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.style.display = "block";
});

function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

if (isSafari()) {
    installBtn.style.display = "block";
    installBtn.addEventListener("click", () => {
        showPopup("Yüklemek için: Paylaş > Ana Ekrana Ekle");
    });
} else {
    installBtn.addEventListener("click", async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
        }
    });
}

if (window.matchMedia('(display-mode: standalone)').matches) {
    installBtn.style.display = "none";
}

window.addEventListener("appinstalled", () => {
    installBtn.style.display = "none";
});

menuBtn.addEventListener("click", () => {
    if (menuDropdown.style.display === "block") {
        menuDropdown.style.display = "none";
    } else {
        const menuBtnRect = menuBtn.getBoundingClientRect();

        menuDropdown.style.top = `${menuBtnRect.bottom + window.scrollY}px`; // menuBtn'un altından başlasın
        menuDropdown.style.right = `${document.documentElement.clientWidth - menuBtnRect.right}px`; // Sağ taraf hizalaması

        menuDropdown.style.display = "block";
    }
});

aboutUsOption.addEventListener("click", () => {
    overlayaboutUs.style.display = "block";
    overlaygameSummaries.style.display = "none";
    menuDropdown.style.display = "none";
});

gameSummariesOption.addEventListener("click", () => {
    overlaygameSummaries.style.display = "block";
    overlayaboutUs.style.display = "none";
    menuDropdown.style.display = "none";
});

closeaboutUsBtn.addEventListener("click", () => {
    overlayaboutUs.style.display = "none";
});

closegameSummariesBtn.addEventListener("click", () => {
    overlaygameSummaries.style.display = "none";
});

function showProfile(user) {
    profileImage.src = user.photoURL || "default-profile-image.svg"; // Varsayılan resim ekleyebilirsiniz
    profileName.textContent = user.displayName;
    profileEmail.textContent = user.email;
    lastSignIn.textContent = new Date(user.metadata.lastSignInTime).toLocaleString();

    const highScores = JSON.parse(localStorage.getItem('dorukdayimhighScores')) || {};
    const highScoresList = document.getElementById('highScoresList'); // Skorları göstereceğiniz elemanın ID'si

    highScoresList.innerHTML = ''; // Önce listeyi temizle

    for (const gameName in highScores) {
        const scoreData = highScores[gameName];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${gameName}</strong>: ${scoreData.score} puan (${scoreData.date})`;
        highScoresList.appendChild(listItem);
    }
}

profileBtn.addEventListener("click", () => {
    if (auth.currentUser) {
        showProfile(auth.currentUser);
        overlayProfile.style.display = "block";
    } else {
        showPopup("Lütfen önce giriş yapın.");
    }
});

closeProfileBtn.addEventListener("click", () => {
    overlayProfile.style.display = "none";
});

shareBtn.addEventListener("click", () => {
    if (navigator.share) {
        navigator.share({
            title: 'DorukDayım',
            text: 'Baba ve oğulun birlikte keşfettiği eğlenceli oyunlar!',
            url: window.location.href,
        })
            .then(() => console.log('Başarıyla paylaşıldı'))
            .catch(error => console.error(error.message));
    } else {
        showShareOptions();
    }
});

function showShareOptions() {
    const shareMessage = `DorukDayım: Baba ve oğulun birlikte keşfettiği eğlenceli oyunlar! ${window.location.href}`;
    const shareOptions = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <p>Paylaş:</p>
            <button onclick="shareTo('whatsapp', '${shareMessage}')">WhatsApp</button>
            <button onclick="shareTo('twitter', '${shareMessage}')">Twitter</button>
            <button onclick="shareTo('facebook', '${shareMessage}')">Facebook</button>
            <button onclick="closeShareOptions()">Kapat</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', shareOptions);
}

function shareTo(platform, message) {
    let url;
    if (platform === 'whatsapp') {
        url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    } else if (platform === 'twitter') {
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    } else if (platform === 'facebook') {
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(message)}`;
    }
    window.open(url, '_blank');
    closeShareOptions();
}

function closeShareOptions() {
    const shareOptionsDiv = document.querySelector('div[style*="position: fixed;"]');
    if (shareOptionsDiv) {
        shareOptionsDiv.remove();
    }
}

function loadPage(pageUrl) {
    document.getElementById("genericIframe").src = pageUrl;
    document.getElementById("genericContainer").style.display = "block";
}

function showMainContent() {
    document.getElementById("genericIframe").src = "";
    document.getElementById("genericContainer").style.display = "none";
}

window.showMainContent = showMainContent;