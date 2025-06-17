# 🎮 Coder X - Hata Avcısı

**Coder X**, geliştiriciler için tasarlanmış eğlenceli bir web oyunudur! Bir kodlayıcı olarak hata kodlarıyla savaşırken yeşil çözüm kodları toplayın ve güçlenin.

## 🚀 Özellikler

### 🎯 Oynanış
- **Mouse Kontrolü**: Karakterinizi mouse ile yönlendirin
- **Yönlü Saldırı**: WASD tuşları ile 4 farklı yöne ateş edin
- **Space/Click**: Genel saldırı
- **ESC**: Oyunu duraklatın

### 🐛 Düşman Sistemi
- **4 Farklı Error Türü**: Error1'den Error4'e kadar artan zorluk
- **Kademeli Spawn**: Oyun başında kolay, zamanla zorlaşır
- **Dinamik Boyutlar**: Daha güçlü error'lar daha büyük
- **Can Sistemi**: Her error türü farklı dayanıklılığa sahip

### ⚡ Gelişmiş Upgrade Sistemi
4 ana kategori ile 28 farklı upgrade seçeneği:

#### ⚔️ **Saldırı**
- Çoklu Mermi (1→6 mermi)
- Yönlü Saldırı (1→8 yön)
- Mermi Hızı & Boyutu
- Delici & Patlayıcı Mermiler
- Takipçi Mermiler

#### 🛡️ **Savunma**
- Maksimum Can Artışı
- Enerji Kalkanı
- Can Yenilenmesi
- Zırh Sistemi

#### ⚡ **Hareket**
- Hız Artışı
- Dash Yeteneği
- Teleport
- Geçirgenlik Modu

#### 🔧 **Yardımcı**
- Skor Çarpanları
- Kritik Vuruş
- Otomatik Hedefleme
- Bonus Spawn Artışı

### 🎨 Görsel Özellikler
- **Retro Tema**: Matrix tarzı yeşil-siyah tasarım
- **Özel Cursor**: Parlayan yeşil imleç
- **Parçacık Efektleri**: Çarpışma ve hasar efektleri
- **Arka Plan**: Özel kodlayıcı temalı görsel
- **Can Barları**: Düşman durumu takibi

## 🛠️ Teknolojiler

- **HTML5 Canvas**: Oyun motoru
- **Vanilla JavaScript**: Saf JS, framework yok
- **CSS3**: Modern animasyonlar ve efektler
- **Responsive Design**: Farklı ekran boyutları

## 🎮 Nasıl Oynanır

1. **Hareket**: Mouse ile karakteri yönlendirin
2. **Saldırı**: 
   - W/A/S/D: Belirli yönlere ateş
   - Space/Click: Mouse yönüne ateş
3. **Hedef**: Hata kodlarını yok edin, yeşil bonusları toplayın
4. **Level Up**: Puan toplayıp seviye atlayın
5. **Upgrade**: 4 kategoriden birini seçip güçlenin

## 🚀 Kurulum

### Canlı Demo
[Oyunu Oyna](https://your-username.github.io/coder-x-game) *(yakında)*

### Yerel Kurulum
```bash
# Repository'yi klonlayın
git clone https://github.com/your-username/coder-x-game.git

# Klasöre girin
cd coder-x-game

# HTTP server başlatın
python -m http.server 8000

# Tarayıcıda açın
# http://localhost:8000
```

## 📁 Proje Yapısı

```
Coder X/
├── index.html          # Ana HTML dosyası
├── game.js             # Oyun motoru ve mantığı
├── images/             # Oyun görselleri
│   ├── bg.png          # Arka plan
│   ├── character_*.png # Karakter animasyonları
│   └── error*.png      # Error türü görselleri
└── README.md           # Bu dosya
```

## 🎯 Oyun Mekanikleri

### Puan Sistemi
- **Error1**: 3 puan
- **Error2**: 7 puan  
- **Error3**: 12 puan
- **Error4**: 20 puan
- **Bonus**: 10 puan

### Level Progression
- Her 100+ puan = 1 level
- Level başına upgrade seçimi
- Artan zorluk ve hız

### Build Örnekleri
- **Tank Build**: Savunma + Can + Zırh
- **DPS Build**: Çoklu mermi + Hız + Kritik
- **Speedster**: Hareket + Dash + Teleport
- **Support**: Skor çarpanı + Bonus spawn

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👨‍💻 Geliştirici

**Coder X Team** - Eğlenceli kodlama deneyimi için tasarlandı!

---

⭐ **Beğendiyseniz yıldız vermeyi unutmayın!** ⭐

*"Kod yazarken eğlenin, hata avlarken güçlenin!"* 🚀 