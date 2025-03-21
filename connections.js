const words = [
    { text: 'Elma', group: 1 }, { text: 'Armut', group: 1 }, { text: 'Portakal', group: 1 }, { text: 'Muz', group: 1 },
    { text: 'Çilek', group: 1 }, { text: 'Üzüm', group: 1 }, { text: 'Ananas', group: 1 }, { text: 'Kiraz', group: 1 },
    { text: 'Vişne', group: 1 }, { text: 'Karpuz', group: 1 }, { text: 'Kavun', group: 1 }, { text: 'Şeftali', group: 1 },

    { text: 'Kırmızı', group: 2 }, { text: 'Mavi', group: 2 }, { text: 'Yeşil', group: 2 }, { text: 'Sarı', group: 2 },
    { text: 'Turuncu', group: 2 }, { text: 'Kahverengi', group: 2 }, { text: 'Mor', group: 2 }, { text: 'Pembe', group: 2 },
    { text: 'Beyaz', group: 2 }, { text: 'Siyah', group: 2 }, { text: 'Gri', group: 2 }, { text: 'Turkuaz', group: 2 },

    { text: 'Kedi', group: 3 }, { text: 'Köpek', group: 3 }, { text: 'Kuş', group: 3 }, { text: 'Balık', group: 3 },
    { text: 'Aslan', group: 3 }, { text: 'Kaplan', group: 3 }, { text: 'Fil', group: 3 }, { text: 'Zebra', group: 3 },
    { text: 'Maymun', group: 3 }, { text: 'Tavşan', group: 3 }, { text: 'At', group: 3 }, { text: 'Kurt', group: 3 },

    { text: 'Araba', group: 4 }, { text: 'Bisiklet', group: 4 }, { text: 'Otobüs', group: 4 }, { text: 'Kamyon', group: 4 },
    { text: 'Motorsiklet', group: 4 }, { text: 'Uçak', group: 4 }, { text: 'Helikopter', group: 4 }, { text: 'Tren', group: 4 },
    { text: 'Gemi', group: 4 }, { text: 'Yat', group: 4 }, { text: 'Traktör', group: 4 }, { text: 'Tır', group: 4 },

    { text: 'Bir', group: 5 }, { text: 'İki', group: 5 }, { text: 'Üç', group: 5 }, { text: 'Dört', group: 5 },
    { text: 'Beş', group: 5 }, { text: 'Altı', group: 5 }, { text: 'Yedi', group: 5 }, { text: 'Sekiz', group: 5 },
    { text: 'Dokuz', group: 5 }, { text: 'On', group: 5 },

    { text: 'Bahar', group: 6 }, { text: 'Yaz', group: 6 }, { text: 'Sonbahar', group: 6 }, { text: 'Kış', group: 6 },

    { text: 'Pazartesi', group: 7 }, { text: 'Salı', group: 7 }, { text: 'Çarşamba', group: 7 }, { text: 'Perşembe', group: 7 },
    { text: 'Cuma', group: 7 }, { text: 'Cumartesi', group: 7 }, { text: 'Pazar', group: 7 },

    { text: 'Ocak', group: 8 }, { text: 'Şubat', group: 8 }, { text: 'Mart', group: 8 }, { text: 'Nisan', group: 8 },
    { text: 'Mayıs', group: 8 }, { text: 'Haziran', group: 8 }, { text: 'Temmuz', group: 8 }, { text: 'Ağustos', group: 8 },
    { text: 'Eylül', group: 8 }, { text: 'Ekim', group: 8 }, { text: 'Kasım', group: 8 }, { text: 'Aralık', group: 8 },

    { text: 'İstanbul', group: 9 }, { text: 'Ankara', group: 9 }, { text: 'İzmir', group: 9 }, { text: 'Antalya', group: 9 },
    { text: 'Bursa', group: 9 }, { text: 'Adana', group: 9 }, { text: 'Eskişehir', group: 9 }, { text: 'Trabzon', group: 9 },
    { text: 'Samsun', group: 9 }, { text: 'Konya', group: 9 }, { text: 'Gaziantep', group: 9 }, { text: 'Mersin', group: 9 },
    { text: 'Diyarbakır', group: 9 }, { text: 'Malatya', group: 9 }, { text: 'Van', group: 9 }, { text: 'Şanlıurfa', group: 9 },
    { text: 'Denizli', group: 9 }, { text: 'Muğla', group: 9 }, { text: 'Aydın', group: 9 }, { text: 'Gümüşhane', group: 9 },
    { text: 'Balıkesir', group: 9 }, { text: 'Çanakkale', group: 9 }, { text: 'Kütahya', group: 9 }, { text: 'Afyon', group: 9 },
    { text: 'Kocaeli', group: 9 }, { text: 'Sakarya', group: 9 }, { text: 'Kastamonu', group: 9 }, { text: 'Karabük', group: 9 },
    { text: 'Zonguldak', group: 9 }, { text: 'Bolu', group: 9 }, { text: 'Düzce', group: 9 }, { text: 'Bartın', group: 9 },
    { text: 'Ardahan', group: 9 }, { text: 'Artvin', group: 9 }, { text: 'Rize', group: 9 }, { text: 'Giresun', group: 9 },
    { text: 'Ordu', group: 9 }, { text: 'Tokat', group: 9 }, { text: 'Amasya', group: 9 }, { text: 'Çorum', group: 9 },
    { text: 'Sinop', group: 9 }, { text: 'Sivas', group: 9 }, { text: 'Erzurum', group: 9 }, { text: 'Erzincan', group: 9 },
    { text: 'Ağrı', group: 9 }, { text: 'Iğdır', group: 9 }, { text: 'Kars', group: 9 }, { text: 'Bayburt', group: 9 },

    { text: 'Türkiye', group: 10 }, { text: 'Almanya', group: 10 }, { text: 'Fransa', group: 10 }, { text: 'İngiltere', group: 10 },
    { text: 'İtalya', group: 10 }, { text: 'İspanya', group: 10 }, { text: 'Rusya', group: 10 }, { text: 'Çin', group: 10 },
    { text: 'Japonya', group: 10 }, { text: 'ABD', group: 10 }, { text: 'Kanada', group: 10 }, { text: 'Meksika', group: 10 },
    { text: 'Brezilya', group: 10 }, { text: 'Arjantin', group: 10 }, { text: 'Avustralya', group: 10 }, { text: 'Yeni Zelanda', group: 10 },
    { text: 'Hindistan', group: 10 }, { text: 'Endonezya', group: 10 }, { text: 'Küba', group: 10 },
    { text: 'Malezya', group: 10 }, { text: 'Filipinler', group: 10 }, { text: 'Vietnam', group: 10 }, { text: 'Tayland', group: 10 },
    { text: 'Güney Kore', group: 10 }, { text: 'Kuzey Kore', group: 10 }, { text: 'Mısır', group: 10 }, { text: 'Polonya', group: 10 },
    { text: 'Hollanda', group: 10 }, { text: 'Belçika', group: 10 }, { text: 'İsviçre', group: 10 }, { text: 'Avusturya', group: 10 },
    { text: 'Yunanistan', group: 10 }, { text: 'Portekiz', group: 10 }, { text: 'İsveç', group: 10 }, { text: 'Norveç', group: 10 },
    { text: 'Finlandiya', group: 10 }, { text: 'Danimarka', group: 10 }, { text: 'İrlanda', group: 10 }, { text: 'İzlanda', group: 10 },

    { text: 'Doktor', group: 11 }, { text: 'Öğretmen', group: 11 }, { text: 'Mühendis', group: 11 }, { text: 'Polis', group: 11 },
    { text: 'Avukat', group: 11 }, { text: 'Mimar', group: 11 }, { text: 'Aşçı', group: 11 }, { text: 'Hemşire', group: 11 },
    { text: 'Pilot', group: 11 }, { text: 'Astronot', group: 11 }, { text: 'Manken', group: 11 }, { text: 'Müzisyen', group: 11 },
    { text: 'Yazar', group: 11 }, { text: 'Oyuncu', group: 11 }, { text: 'Ressam', group: 11 },
    { text: 'Sporcu', group: 11 }, { text: 'Şair', group: 11 }, { text: 'Şarkıcı', group: 11 }, { text: 'Yönetmen', group: 11 },
    { text: 'Gazeteci', group: 11 }, { text: 'Kameraman', group: 11 }, { text: 'Fotoğrafçı', group: 11 }, { text: 'Radyocu', group: 11 },
    { text: 'Bilim Adamı', group: 11 }, { text: 'Yazılımcı', group: 11 },
    { text: 'Girişimci', group: 11 }, { text: 'Yatırımcı', group: 11 }, { text: 'Müteahhit', group: 11 },
    { text: 'Modacı', group: 11 }, { text: 'Kuaför', group: 11 }, { text: 'Terzi', group: 11 }, { text: 'Ayakkabıcı', group: 11 },
    { text: 'Marangoz', group: 11 }, { text: 'Demirci', group: 11 }, { text: 'Kaynakçı', group: 11 }, { text: 'Boyacı', group: 11 },
    { text: 'Tesisatçı', group: 11 }, { text: 'Elektrikçi', group: 11 },

    { text: 'Yüzme', group: 12 }, { text: 'Müzik', group: 12 }, { text: 'Dans', group: 12 }, { text: 'Resim', group: 12 },
    { text: 'Kitap', group: 12 }, { text: 'Spor', group: 12 }, { text: 'Yemek', group: 12 }, { text: 'Gezi', group: 12 },
    { text: 'Sinema', group: 12 }, { text: 'Tiyatro', group: 12 }, { text: 'Konser', group: 12 },
    { text: 'Kamp', group: 12 }, { text: 'Piknik', group: 12 }, { text: 'Balık Tutma', group: 12 },
    { text: 'Koşu', group: 12 }, { text: 'Yürüyüş', group: 12 }, { text: 'Kayak', group: 12 },
    { text: 'Dağcılık', group: 12 }, { text: 'Paraşüt', group: 12 }, { text: 'Dalış', group: 12 },
    { text: 'Yelken', group: 12 }, { text: 'Sörf', group: 12 }, { text: 'Rafting', group: 12 },

    { text: 'Toplama', group: 13 }, { text: 'Çıkarma', group: 13 }, { text: 'Çarpma', group: 13 }, { text: 'Bölme', group: 13 },
    { text: 'Üs Alma', group: 13 }, { text: 'Karekök', group: 13 }, { text: 'Faktöriyel', group: 13 }, { text: 'Logaritma', group: 13 },

    { text: 'Küçük', group: 14 }, { text: 'Büyük', group: 14 }, { text: 'Uzun', group: 14 }, { text: 'Kısa', group: 14 },
    { text: 'Geniş', group: 14 }, { text: 'Dar', group: 14 }, { text: 'Yüksek', group: 14 }, { text: 'Alçak', group: 14 },
    { text: 'Kalın', group: 14 }, { text: 'İnce', group: 14 }, { text: 'Ağır', group: 14 }, { text: 'Hafif', group: 14 },
    { text: 'Sıcak', group: 14 }, { text: 'Soğuk', group: 14 }, { text: 'Yumuşak', group: 14 }, { text: 'Sert', group: 14 },
    { text: 'Kuru', group: 14 }, { text: 'Islak', group: 14 }, { text: 'Temiz', group: 14 }, { text: 'Kirli', group: 14 },
    { text: 'Güzel', group: 14 }, { text: 'Çirkin', group: 14 }, { text: 'Sağlam', group: 14 }, { text: 'Zayıf', group: 14 },
    { text: 'Mutlu', group: 14 }, { text: 'Üzgün', group: 14 }, { text: 'Yavaş', group: 14 }, { text: 'Hızlı', group: 14 },
    { text: 'Zengin', group: 14 }, { text: 'Fakir', group: 14 }, { text: 'Genç', group: 14 }, { text: 'Yaşlı', group: 14 },
    { text: 'Güçlü', group: 14 }, { text: 'Zayıf', group: 14 }, { text: 'Açık', group: 14 }, { text: 'Kapalı', group: 14 },
    { text: 'Doğru', group: 14 }, { text: 'Yanlış', group: 14 },

    { text: 'Kuzey', group: 15 }, { text: 'Güney', group: 15 }, { text: 'Doğu', group: 15 }, { text: 'Batı', group: 15 },
    { text: 'Kuzeydoğu', group: 15 }, { text: 'Kuzeybatı', group: 15 }, { text: 'Güneydoğu', group: 15 }, { text: 'Güneybatı', group: 15 }
  ];

  let selectedWords = [];
  let foundGroups = 0;
  const maxMistakes = 4;
  let mistakes = 0;

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

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getRandomWords() {
    const groups = Array.from(new Set(words.map(word => word.group)));
    shuffle(groups);
    const selectedGroups = groups.slice(0, 4);
    const selectedWords = [];
    selectedGroups.forEach(group => {
      const groupWords = words.filter(word => word.group === group);
      shuffle(groupWords);
      selectedWords.push(...groupWords.slice(0, 4));
    });
    return selectedWords;
  }

  function createWordGrid() {
    const grid = document.getElementById('wordGrid');
    const selectedWords = getRandomWords();
    shuffle(selectedWords);
    selectedWords.forEach(word => {
      const div = document.createElement('div');
      div.className = 'word';
      div.textContent = word.text;
      div.dataset.group = word.group;
      div.addEventListener('click', () => selectWord(div));
      grid.appendChild(div);
    });
    document.getElementById('newGameBtn').style.display = 'none';
  }

  function selectWord(element) {
    if (element.classList.contains('selected')) {
      selectedWords = selectedWords.filter(word => word !== element);
      element.classList.remove('selected');
    } else if (!element.classList.contains('group-color-1') && !element.classList.contains('group-color-2') &&
      !element.classList.contains('group-color-3') && !element.classList.contains('group-color-4')) {
      element.classList.add('selected');
      selectedWords.push(element);
    }

    if (selectedWords.length === 4) {
      checkSelection();
    }
  }

  function checkSelection() {
    const group = selectedWords[0].dataset.group;
    const isGroup = selectedWords.every(word => word.dataset.group === group);

    if (isGroup) {
      const colorIndex = (foundGroups % 4) + 1; // Cycle through 1 to 4
      selectedWords.forEach(word => {
        word.classList.remove('selected');
        word.classList.add(`group-color-${colorIndex}`);
      });
      foundGroups++;
      if (foundGroups === 4) {
        document.getElementById('message').textContent = 'Tebrikler! Tüm grupları buldunuz.';
        document.getElementById('newGameBtn').style.display = 'block';
      }
    } else {
      selectedWords.forEach(word => word.classList.remove('selected'));
      mistakes++;
      if (mistakes >= maxMistakes) {
        document.getElementById('message').textContent = 'Üzgünüz, çok fazla hata yaptınız.';
        document.querySelectorAll('.word').forEach(word => word.removeEventListener('click', selectWord));
        document.getElementById('newGameBtn').style.display = 'block';
      }
    }
    selectedWords = [];
  }

  function resetGame() {
    selectedWords = [];
    foundGroups = 0;
    mistakes = 0;
    document.getElementById('message').textContent = '';
    document.getElementById('newGameBtn').style.display = 'none';
    const grid = document.getElementById('wordGrid');
    grid.innerHTML = '';
    createWordGrid();
  }

  document.getElementById('newGameBtn').addEventListener('click', resetGame);

  document.addEventListener('click', () => {
    document.getElementById('initialMessage').style.display = 'none';
  });

  createWordGrid();