// Oyun değişkenleri
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Oyun durumu
let gameState = {
    running: true,
    paused: false,
    score: 0,
    health: 100,
    maxHealth: 100,
    level: 1,
    nextLevelScore: 100,
    showUpgrade: false,
    gameTime: 0 // Oyun süresi tracking için
};

// Gelişmiş Upgrade Sistemi
let upgrades = {
    // Saldırı Kategorisi
    attack: {
        multiShot: 0,        // 0: Tek, 1: İkili, 2: Dörtlü, 3: Altılı
        directionalShot: 0,  // 0: Tek yön, 1: Çift yön, 2: Dört yön, 3: Sekiz yön
        bulletSpeed: 0,      // 0: Normal, 1: Hızlı, 2: Çok hızlı, 3: Işık hızı
        bulletSize: 0,       // 0: Normal, 1: Büyük, 2: Dev, 3: Mega
        fireRate: 0,         // 0: Normal, 1: Hızlı, 2: Çok hızlı, 3: Makine tabancası
        piercing: 0,         // 0: Yok, 1: 2 düşman, 2: 3 düşman, 3: Sınırsız
        explosive: 0,        // 0: Yok, 1: Küçük patlama, 2: Orta, 3: Büyük
        homingShots: 0       // 0: Yok, 1: Hafif, 2: Orta, 3: Güçlü takip
    },
    
    // Savunma Kategorisi
    defense: {
        health: 0,           // 0: 100HP, 1: 150HP, 2: 200HP, 3: 300HP
        shield: 0,           // 0: Yok, 1: 50 kalkan, 2: 100, 3: 200
        regeneration: 0,     // 0: Yok, 1: Yavaş, 2: Orta, 3: Hızlı
        armor: 0,            // 0: Yok, 1: %10 azaltma, 2: %20, 3: %35
        invincibility: 0,    // 0: Yok, 1: 0.5s, 2: 1s, 3: 1.5s hasar sonrası
        thorns: 0,           // 0: Yok, 1: %25 geri tepme, 2: %50, 3: %100
        magneticField: 0     // 0: Yok, 1: Küçük, 2: Orta, 3: Büyük alan
    },
    
    // Hareket Kategorisi
    mobility: {
        speed: 0,            // 0: Normal, 1: Hızlı, 2: Çok hızlı, 3: Işık hızı
        dash: 0,             // 0: Yok, 1: Kısa dash, 2: Orta, 3: Uzun
        teleport: 0,         // 0: Yok, 1: Mouse pozisyonuna, 2: Rastgele, 3: İkisi de
        ghostMode: 0,        // 0: Yok, 1: 1s geçirgenlik, 2: 2s, 3: 3s
        wallBounce: 0,       // 0: Yok, 1: Tek sıçrama, 2: Çift, 3: Sınırsız
        phaseShift: 0        // 0: Yok, 1: %10 kaçma, 2: %20, 3: %35
    },
    
    // Yardımcı Kategorisi
    utility: {
        scanner: 0,          // 0: Yok, 1: Düşman konumu, 2: Bonus, 3: Her şey
        timeSlowdown: 0,     // 0: Yok, 1: Hafif, 2: Orta, 3: Matrix modu
        autoTarget: 0,       // 0: Yok, 1: En yakın, 2: En güçlü, 3: Akıllı hedef
        doubleScore: 0,      // 0: Normal, 1: %150, 2: %200, 3: %300
        bonusSpawn: 0,       // 0: Normal, 1: Daha sık, 2: Çok sık, 3: Sürekli
        experienceBoost: 0,  // 0: Normal, 1: %150 XP, 2: %200, 3: %300
        criticalHit: 0       // 0: Yok, 1: %10 şans, 2: %20, 3: %35
    }
};

// Upgrade kategorileri ve açıklamaları
const upgradeCategories = {
    attack: {
        name: "⚔️ Saldırı",
        color: "#ff4444",
        description: "Hasar ve ateş gücü"
    },
    defense: {
        name: "🛡️ Savunma", 
        color: "#4444ff",
        description: "Dayanıklılık ve koruma"
    },
    mobility: {
        name: "⚡ Hareket",
        color: "#ffff44",
        description: "Hız ve çeviklik"
    },
    utility: {
        name: "🔧 Yardımcı",
        color: "#44ff44",
        description: "Özel yetenekler"
    }
};

// Her upgrade'in detaylı bilgileri
const upgradeDetails = {
    // Saldırı upgrades
    multiShot: {
        name: "Çoklu Mermi",
        levels: ["Tek mermi", "İkili mermi", "Dörtlü mermi", "Altılı mermi"],
        effects: [1, 2, 4, 6]
    },
    directionalShot: {
        name: "Yönlü Saldırı", 
        levels: ["Tek yön", "Çift yön", "Dört yön", "Sekiz yön"],
        effects: [1, 2, 4, 8]
    },
    bulletSpeed: {
        name: "Mermi Hızı",
        levels: ["Normal", "Hızlı", "Çok hızlı", "Işık hızı"],
        effects: [6, 8, 10, 15]
    },
    bulletSize: {
        name: "Mermi Boyutu",
        levels: ["Normal", "Büyük", "Dev", "Mega"],
        effects: [8, 12, 16, 24]
    },
    fireRate: {
        name: "Atış Hızı",
        levels: ["Normal", "Hızlı", "Çok hızlı", "Makine tabancası"],
        effects: [1, 0.7, 0.4, 0.2]
    },
    piercing: {
        name: "Delici Mermi",
        levels: ["Normal", "2 düşman", "3 düşman", "Sınırsız"],
        effects: [1, 2, 3, 999]
    },
    explosive: {
        name: "Patlayıcı Mermi",
        levels: ["Normal", "Küçük patlama", "Orta patlama", "Büyük patlama"],
        effects: [0, 30, 50, 80]
    },
    homingShots: {
        name: "Takipçi Mermi",
        levels: ["Normal", "Hafif takip", "Orta takip", "Güçlü takip"],
        effects: [0, 0.02, 0.05, 0.1]
    },
    
    // Savunma upgrades
    health: {
        name: "Maksimum Can",
        levels: ["100 HP", "150 HP", "200 HP", "300 HP"],
        effects: [100, 150, 200, 300]
    },
    shield: {
        name: "Enerji Kalkanı",
        levels: ["Yok", "50 kalkan", "100 kalkan", "200 kalkan"],
        effects: [0, 50, 100, 200]
    },
    regeneration: {
        name: "Can Yenilenmesi",
        levels: ["Yok", "Yavaş", "Orta", "Hızlı"],
        effects: [0, 0.5, 1, 2]
    },
    armor: {
        name: "Zırh",
        levels: ["Yok", "%10 azaltma", "%20 azaltma", "%35 azaltma"],
        effects: [0, 0.1, 0.2, 0.35]
    },
    
    // Hareket upgrades
    speed: {
        name: "Hareket Hızı",
        levels: ["Normal", "Hızlı", "Çok hızlı", "Işık hızı"],
        effects: [2.5, 3.5, 4.5, 6]
    },
    dash: {
        name: "Dash Yeteneği",
        levels: ["Yok", "Kısa dash", "Orta dash", "Uzun dash"],
        effects: [0, 100, 150, 200]
    },
    
    // Yardımcı upgrades
    doubleScore: {
        name: "Skor Çarpanı",
        levels: ["Normal", "%150", "%200", "%300"],
        effects: [1, 1.5, 2, 3]
    },
    criticalHit: {
        name: "Kritik Vuruş",
        levels: ["Yok", "%10 şans", "%20 şans", "%35 şans"],
        effects: [0, 0.1, 0.2, 0.35]
    }
};

// Oyuncu
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 55,  // 40'dan 55'e çıkardık
    height: 55, // 40'dan 55'e çıkardık
    speed: 2.5,
    direction: 'front',
    lastDirection: 'front',
    animationFrame: 0,
    animationSpeed: 8 // Animasyon hızı (düşük = hızlı)
};

// Mouse durumu
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    isMoving: false,
    lastMoveTime: 0
};

// Tuş durumları
let keys = {};

// Oyun nesneleri
let bullets = [];
let enemies = [];
let bonuses = [];
let particles = [];

// Zamanlayıcılar
let enemySpawnTimer = 0;
let bonusSpawnTimer = 0;
let animationFrame = 0;
let lastTime = Date.now();

// Arka plan görseli
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.png';

// Karakter görselleri yükleme
const characterImageNames = ['character_front_1', 'character_front_2', 'character_back_1', 'character_back_2', 'character_left', 'character_left_2', 'character_right', 'character_right_2'];

// Karakter görselleri yükleme
const characterImages = {};
const imageNames = [
    'character_front_1', 'character_front_2',
    'character_back_1', 'character_back_2',
    'character_left', 'character_left_2',
    'character_right_1', 'character_right_2'
];

// Görselleri yükle
let imagesLoaded = 0;
imageNames.forEach(name => {
    const img = new Image();
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === imageNames.length) {
            startGame();
        }
    };
    img.onerror = () => {
        imagesLoaded++;
        if (imagesLoaded === imageNames.length) {
            startGame();
        }
    };
    img.src = `images/${name}.png`;
    characterImages[name] = img;
});

// Error türleri
const errorTypes = {
    error1: { damage: 5, speed: 0.3, points: 3, size: 25, health: 1, image: null },
    error2: { damage: 10, speed: 0.5, points: 7, size: 30, health: 2, image: null },
    error3: { damage: 15, speed: 0.7, points: 12, size: 35, health: 3, image: null },
    error4: { damage: 25, speed: 1.0, points: 20, size: 40, health: 4, image: null }
};

// Error görsellerini yükle
const errorImageNames = ['error1', 'error2', 'error3', 'error4'];
let errorImagesLoaded = 0;

errorImageNames.forEach(name => {
    const img = new Image();
    img.onload = () => {
        errorImagesLoaded++;
    };
    img.onerror = () => {
        errorImagesLoaded++;
    };
    img.src = `images/${name}.png`;
    errorTypes[name].image = img;
});

// UI görselleri yükle
const uiImages = {};
const uiImageNames = ['skor', 'paused', 'resume', 'restart'];
let uiImagesLoaded = 0;

uiImageNames.forEach(name => {
    const img = new Image();
    img.onload = () => {
        uiImagesLoaded++;
    };
    img.onerror = () => {
        uiImagesLoaded++;
    };
    img.src = `images/${name}.png`;
    uiImages[name] = img;
});

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    if (e.code === 'Escape') {
        togglePause();
    }
    
    // WASD ile ateş etme
    if (e.code === 'KeyW') {
        e.preventDefault();
        shootDirection('back'); // Yukarı
    }
    if (e.code === 'KeyA') {
        e.preventDefault();
        shootDirection('left'); // Sol
    }
    if (e.code === 'KeyS') {
        e.preventDefault();
        shootDirection('front'); // Aşağı
    }
    if (e.code === 'KeyD') {
        e.preventDefault();
        shootDirection('right'); // Sağ
    }
    
    if (e.code === 'Space') {
        e.preventDefault();
        shoot(); // Mouse yönüne veya son yöne ateş et
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Mouse event listeners
document.addEventListener('mousemove', (e) => {
    // Custom cursor pozisyonu güncelle
    const customCursor = document.getElementById('customCursor');
    if (customCursor) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    }
    
    const rect = canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;
    
    // Sadece canvas içindeyken mouse hareketini aktif et
    if (newX >= 0 && newX <= canvas.width && newY >= 0 && newY <= canvas.height) {
        mouse.x = newX;
        mouse.y = newY;
        mouse.isMoving = true;
        mouse.lastMoveTime = Date.now();
    }
});

// Mouse durma kontrolü
setInterval(() => {
    if (Date.now() - mouse.lastMoveTime > 100) { // 100ms sonra durdu kabul et
        mouse.isMoving = false;
    }
}, 50);

canvas.addEventListener('click', () => {
    shoot();
});

// Oyunu başlatma fonksiyonu
function startGame() {
    canvas.style.cursor = 'none';
    gameState.running = true;
    gameState.paused = false;
    lastTime = Date.now();
    gameLoop();
}

// Ana oyun döngüsü
function gameLoop() {
    if (!gameState.running || gameState.paused) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Oyun zamanını güncelle
    gameState.gameTime += deltaTime;
    
    // Animasyon frame'ini güncelle
    animationFrame++;
    player.animationFrame++;
    
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateBonuses();
    updateParticles();
    
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Oyuncu güncelleme
function updatePlayer() {
    let moving = false;
    let newDirection = player.direction;
    
    // Sadece Mouse kontrolü
    if (mouse.isMoving) {
        const dx = mouse.x - (player.x + player.width / 2);
        const dy = mouse.y - (player.y + player.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 8) { // Daha büyük dead zone
            const moveX = (dx / distance) * player.speed;
            const moveY = (dy / distance) * player.speed;
            
            player.x += moveX;
            player.y += moveY;
            moving = true;
            
            // Yön belirleme - mouse hareketine göre
            if (Math.abs(dx) > Math.abs(dy)) {
                newDirection = dx > 0 ? 'right' : 'left';
            } else {
                newDirection = dy > 0 ? 'front' : 'back';
            }
        }
    }
    
    // WASD tuşlarına basıldığında yön değiştir (ateş için)
    if (keys['KeyW']) {
        newDirection = 'back'; // Yukarı
    } else if (keys['KeyS']) {
        newDirection = 'front'; // Aşağı
    } else if (keys['KeyA']) {
        newDirection = 'left'; // Sol
    } else if (keys['KeyD']) {
        newDirection = 'right'; // Sağ
    }
    
    if (moving || keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD']) {
        player.direction = newDirection;
        player.lastDirection = newDirection;
    }
    
    // Sınırlar içinde tut
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

// Belirli yöne ateş etme
function shootDirection(direction) {
    if (gameState.paused) return;
    
    const bulletData = {
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 8,
        height: 8,
        speed: 6,
        direction: direction,
        color: '#00ff00'
    };
    
    if (upgrades.attack.directionalShot > 0) {
        createDirectionalBullets(bulletData);
    } else {
        createDirectionalBullets(bulletData, direction);
    }
}

// Ateş etme
function shoot() {
    if (gameState.paused) return;
    
    const bulletData = {
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 8,
        height: 8,
        speed: 6,
        direction: player.lastDirection,
        color: '#00ff00'
    };
    
    if (upgrades.attack.directionalShot > 0) {
        createDirectionalBullets(bulletData);
    } else {
        createBullets(bulletData);
    }
}

// Normal mermi oluşturma
function createBullets(bulletData) {
    const multiShotLevel = upgrades.attack.multiShot;
    const bulletCount = upgradeDetails.multiShot.effects[multiShotLevel];
    
    // Upgrade etkilerini uygula
    const bulletSpeed = upgradeDetails.bulletSpeed.effects[upgrades.attack.bulletSpeed];
    const bulletSize = upgradeDetails.bulletSize.effects[upgrades.attack.bulletSize];
    
    for (let i = 0; i < bulletCount; i++) {
        const bullet = { ...bulletData };
        bullet.speed = bulletSpeed;
        bullet.width = bulletSize;
        bullet.height = bulletSize;
        
        if (mouse.isMoving) {
            const dx = mouse.x - bullet.x;
            const dy = mouse.y - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                bullet.dx = (dx / distance) * bullet.speed;
                bullet.dy = (dy / distance) * bullet.speed;
                
                if (bulletCount > 1) {
                    const angle = Math.atan2(dy, dx);
                    const spreadAngle = (i - (bulletCount - 1) / 2) * 0.3;
                    const newAngle = angle + spreadAngle;
                    bullet.dx = Math.cos(newAngle) * bullet.speed;
                    bullet.dy = Math.sin(newAngle) * bullet.speed;
                }
            }
        } else {
            switch (bullet.direction) {
                case 'front':
                    bullet.dy = bullet.speed;
                    bullet.dx = 0;
                    break;
                case 'back':
                    bullet.dy = -bullet.speed;
                    bullet.dx = 0;
                    break;
                case 'left':
                    bullet.dx = -bullet.speed;
                    bullet.dy = 0;
                    break;
                case 'right':
                    bullet.dx = bullet.speed;
                    bullet.dy = 0;
                    break;
            }
            
            if (bulletCount > 1) {
                const spreadOffset = (i - (bulletCount - 1) / 2) * 15;
                if (bullet.dx === 0) {
                    bullet.x += spreadOffset;
                } else {
                    bullet.y += spreadOffset;
                }
            }
        }
        
        // Upgrade özelliklerini ekle
        bullet.piercing = upgradeDetails.piercing.effects[upgrades.attack.piercing];
        bullet.explosive = upgradeDetails.explosive.effects[upgrades.attack.explosive];
        bullet.homing = upgradeDetails.homingShots.effects[upgrades.attack.homingShots];
        bullet.hitCount = 0; // Kaç düşmana çarptığını takip et
        
        bullets.push(bullet);
    }
}

// Yönlü mermi oluşturma
function createDirectionalBullets(bulletData, singleDirection = null) {
    let directions;
    
    if (singleDirection) {
        // Tek yön için
        switch (singleDirection) {
            case 'front':
                directions = [{ dx: 0, dy: 1 }];
                break;
            case 'back':
                directions = [{ dx: 0, dy: -1 }];
                break;
            case 'left':
                directions = [{ dx: -1, dy: 0 }];
                break;
            case 'right':
                directions = [{ dx: 1, dy: 0 }];
                break;
        }
    } else {
        // Upgrade'li çoklu yön
        const directionalLevel = upgrades.attack.directionalShot;
        if (directionalLevel === 1) {
            directions = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }];
        } else if (directionalLevel === 2) {
            directions = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];
        } else if (directionalLevel === 3) {
            // 8 yön
            directions = [
                { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
                { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: 1 }
            ];
        }
    }
    
    const multiShotLevel = upgrades.attack.multiShot;
    const bulletsPerDirection = upgradeDetails.multiShot.effects[multiShotLevel];
    
    // Upgrade etkilerini al
    const bulletSpeed = upgradeDetails.bulletSpeed.effects[upgrades.attack.bulletSpeed];
    const bulletSize = upgradeDetails.bulletSize.effects[upgrades.attack.bulletSize];
    
    directions.forEach(dir => {
        for (let i = 0; i < bulletsPerDirection; i++) {
            const bullet = { ...bulletData };
            bullet.speed = bulletSpeed;
            bullet.width = bulletSize;
            bullet.height = bulletSize;
            bullet.dx = dir.dx * bullet.speed;
            bullet.dy = dir.dy * bullet.speed;
            
            if (bulletsPerDirection > 1) {
                const offset = (i - (bulletsPerDirection - 1) / 2) * 10;
                if (dir.dx === 0) {
                    bullet.x += offset;
                } else {
                    bullet.y += offset;
                }
            }
            
            // Upgrade özelliklerini ekle
            bullet.piercing = upgradeDetails.piercing.effects[upgrades.attack.piercing];
            bullet.explosive = upgradeDetails.explosive.effects[upgrades.attack.explosive];
            bullet.homing = upgradeDetails.homingShots.effects[upgrades.attack.homingShots];
            bullet.hitCount = 0;
            
            bullets.push(bullet);
        }
    });
}

// Mermi güncelleme
function updateBullets() {
    bullets = bullets.filter(bullet => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        
        return bullet.x > -bullet.width && bullet.x < canvas.width + bullet.width &&
               bullet.y > -bullet.height && bullet.y < canvas.height + bullet.height;
    });
}

// Düşmanları güncelle
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // Oyuncuya doğru hareket et
        const dx = (player.x + player.width / 2) - (enemy.x + enemy.width / 2);
        const dy = (player.y + player.height / 2) - (enemy.y + enemy.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }
        
        // Ekran dışına çıkan düşmanları kaldır
        if (enemy.x < -enemy.width || enemy.x > canvas.width + enemy.width ||
            enemy.y < -enemy.height || enemy.y > canvas.height + enemy.height) {
            enemies.splice(i, 1);
        }
    }
    
    // Düşman spawn - çok daha yavaş başlangıç
    enemySpawnTimer += 16;
    const timeMinutes = gameState.gameTime / 60000;
    
    // Başlangıçta çok yavaş, zamanla hızlanır
    let baseSpawnRate = 3000; // 3 saniye başlangıç
    let levelBonus = (gameState.level - 1) * 200; // Level başına 200ms hızlanma
    let timeBonus = timeMinutes * 100; // Dakika başına 100ms hızlanma
    
    const spawnRate = Math.max(baseSpawnRate - levelBonus - timeBonus, 800); // En az 0.8 saniye
    
    if (enemySpawnTimer >= spawnRate) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }
    
    checkCollisions();
}

// Bonus güncelleme
function updateBonuses() {
    // Bonus spawn
    bonusSpawnTimer += 16;
    
    if (bonusSpawnTimer >= 5000) { // 5 saniyede bir bonus
        bonusSpawnTimer = 0;
        
        const bonus = {
            x: Math.random() * (canvas.width - 20),
            y: Math.random() * (canvas.height - 20),
            width: 20,
            height: 20,
            color: '#00ff00',
            value: 10,
            pulseTimer: 0
        };
        
        bonuses.push(bonus);
    }
    
    // Bonus animasyonu
    bonuses.forEach(bonus => {
        bonus.pulseTimer += 0.1;
    });
}

// Parçacık güncelleme
function updateParticles() {
    particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.alpha = particle.life / particle.maxLife;
        
        return particle.life > 0;
    });
}

// Çarpışma kontrolü
function checkCollisions() {
    // Mermi-düşman çarpışması
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (bullets[i] && enemies[j] && 
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y) {
                
                // Enemy'ye hasar ver
                enemies[j].health -= 1;
                
                // Mermiyi kaldır
                bullets.splice(i, 1);
                
                // Enemy öldü mü kontrol et
                if (enemies[j].health <= 0) {
                    // Enemy türüne göre puan ver
                    gameState.score += enemies[j].points;
                    
                    // Parçacık efekti
                    createParticles(enemies[j].x + enemies[j].width/2, enemies[j].y + enemies[j].height/2, '#ff0000');
                    
                    enemies.splice(j, 1);
                } else {
                    // Hasar aldığında küçük parçacık efekti
                    createParticles(enemies[j].x + enemies[j].width/2, enemies[j].y + enemies[j].height/2, '#ffaa00', 3);
                }
                
                break;
            }
        }
    }
    
    // Oyuncu-düşman çarpışması  
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y) {
            
            // Enemy türüne göre hasar ver
            gameState.health -= enemies[i].damage;
            
            // Parçacık efekti
            createParticles(enemies[i].x + enemies[i].width/2, enemies[i].y + enemies[i].height/2, '#ff0000');
            
            enemies.splice(i, 1);
            
            if (gameState.health <= 0) {
                gameState.running = false;
                alert('Oyun Bitti! Skorunuz: ' + gameState.score);
                location.reload();
            }
        }
    }
    
    // Oyuncu-bonus çarpışması
    for (let i = bonuses.length - 1; i >= 0; i--) {
        if (player.x < bonuses[i].x + bonuses[i].width &&
            player.x + player.width > bonuses[i].x &&
            player.y < bonuses[i].y + bonuses[i].height &&
            player.y + player.height > bonuses[i].y) {
            
            gameState.score += 10;
            createParticles(bonuses[i].x + bonuses[i].width/2, bonuses[i].y + bonuses[i].height/2, '#00ff00');
            bonuses.splice(i, 1);
        }
    }
    
    // Level kontrolü
    if (gameState.score >= gameState.nextLevelScore) {
        gameState.level++;
        gameState.nextLevelScore += 100 + (gameState.level * 50);
        gameState.showUpgrade = true;
        gameState.paused = true;
        document.getElementById('upgradeMenu').style.display = 'block';
        showCategorySelection(); // Kategori seçimini göster
    }
}

// Çarpışma kontrolü
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Parçacık oluşturma
function createParticles(x, y, color, particleCount = 8) {
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 30,
            maxLife: 30,
            color: color,
            size: 4
        });
    }
}

// Çizim fonksiyonu
function draw() {
    // Arka plan
    if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
        // bg.png görselini çiz
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        // Fallback: Siyah arka plan + grid
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid pattern
        ctx.strokeStyle = '#003300';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
    }
    
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawBonuses();
    drawParticles();
    drawUI();
}

// Oyuncu çizme
function drawPlayer() {
    let imageName = player.direction + '_1';
    
    // Animasyon için frame değiştir - hareket halindeyken veya tuşa basıldığında
    const isMoving = mouse.isMoving || keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'];
    
    if (isMoving) {
        const frameNumber = Math.floor(player.animationFrame / player.animationSpeed) % 2 + 1;
        
        // Her yön için ayrı kontrol
        if (player.direction === 'front') {
            // Aşağı hareket: front_1 ve front_2
            imageName = 'character_front_' + frameNumber;
        } else if (player.direction === 'back') {
            // Yukarı hareket: back_1 ve back_2
            imageName = 'character_back_' + frameNumber;
        } else if (player.direction === 'left') {
            // Sol hareket: left ve left_2 (özel durum)
            imageName = frameNumber === 1 ? 'character_left' : 'character_left_2';
        } else if (player.direction === 'right') {
            // Sağ hareket: right_1 ve right_2
            imageName = 'character_right_' + frameNumber;
        }
    } else {
        // Durağan pozisyonlar
        if (player.direction === 'front') {
            imageName = 'character_front_1';
        } else if (player.direction === 'back') {
            imageName = 'character_back_1';
        } else if (player.direction === 'left') {
            imageName = 'character_left';
        } else if (player.direction === 'right') {
            imageName = 'character_right_1';
        }
    }
    
    const img = characterImages[imageName];
    if (img && img.complete) {
        ctx.drawImage(img, player.x, player.y, player.width, player.height);
    } else {
        // Yedek çizim - yön gösterici ile
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Yön göstergesi
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const directionSymbols = {
            'front': '↓',
            'back': '↑', 
            'left': '←',
            'right': '→'
        };
        ctx.fillText(directionSymbols[player.direction] || '?', 
                    player.x + player.width/2, 
                    player.y + player.height/2 + 4);
    }
}

// Mermi çizme
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.shadowColor = bullet.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });
}

// Düşmanları çiz
function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.image && enemy.image.complete) {
            // Error görselini çiz
            ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            // Fallback: renkli kare
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Error türü yazısı
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(enemy.type, enemy.x + enemy.width/2, enemy.y + enemy.height/2 + 3);
        }
        
        // Can barı (sadece hasar almış enemy'ler için)
        if (enemy.health < enemy.maxHealth) {
            const barWidth = enemy.width;
            const barHeight = 4;
            const barX = enemy.x;
            const barY = enemy.y - 8;
            
            // Can barı arka plan
            ctx.fillStyle = '#333333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Can barı
            const healthPercent = enemy.health / enemy.maxHealth;
            ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : '#ff0000';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
            
            // Can barı çerçeve
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
    });
}

// Bonus çizme
function drawBonuses() {
    bonuses.forEach(bonus => {
        const pulse = Math.sin(bonus.pulseTimer) * 0.2 + 1;
        const size = bonus.width * pulse;
        const offset = (size - bonus.width) / 2;
        
        ctx.fillStyle = bonus.color;
        ctx.shadowColor = bonus.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(bonus.x - offset, bonus.y - offset, size, size);
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#000000';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('+', bonus.x + bonus.width / 2, bonus.y + bonus.height / 2 + 4);
    });
}

// Parçacık çizme
function drawParticles() {
    particles.forEach(particle => {
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
    ctx.globalAlpha = 1;
}

// UI çizimi
function drawUI() {
    // Sol üst köşe - Sadece skor görseli
    const skorImg = uiImages['skor'];
    if (skorImg && skorImg.complete) {
        // Skor görselini çiz
        const skorWidth = 150;
        const skorHeight = 40;
        ctx.drawImage(skorImg, 10, 10, skorWidth, skorHeight);
        
        // Skor değerini görsel içine yaz
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 18px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(gameState.score.toString(), 10 + skorWidth/2, 10 + skorHeight/2 + 6);
    }
    
    // Sağ üst köşe - Oyun bilgileri
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Courier New';
    ctx.textAlign = 'right';
    
    ctx.fillText(`Level: ${gameState.level}`, canvas.width - 10, 25);
    ctx.fillText(`Can: ${gameState.health}`, canvas.width - 10, 45);
    
    // Oyun süresi
    const minutes = Math.floor(gameState.gameTime / 60000);
    const seconds = Math.floor((gameState.gameTime % 60000) / 1000);
    ctx.fillText(`Süre: ${minutes}:${seconds.toString().padStart(2, '0')}`, canvas.width - 10, 65);
    
    // Sol alt köşe - Kontroller
    ctx.textAlign = 'left';
    ctx.font = '12px Courier New';
    ctx.fillText('W/A/S/D: Ateş Et', 10, 70);
    ctx.fillText('Mouse: Hareket', 10, 85);
    ctx.fillText('Space: Ateş', 10, 100);
    ctx.fillText('ESC: Duraklat', 10, 115);
    
    // Can barı
    const barWidth = 200;
    const barHeight = 20;
    const barX = (canvas.width - barWidth) / 2;
    const barY = canvas.height - 40;
    
    // Can barı arka plan
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Can barı
    const healthPercent = gameState.health / gameState.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Can barı çerçeve
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Can yazısı
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`${gameState.health}/${gameState.maxHealth}`, barX + barWidth/2, barY + barHeight/2 + 4);
}

// Oyunu duraklat
function togglePause() {
    gameState.paused = !gameState.paused;
}

// Oyunu bitir
function endGame() {
    gameState.running = false;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameOver').style.display = 'block';
}

// Upgrade seçimi
function selectUpgrade(type) {
    // Geriye uyumluluk için - eski sistem
    if (type === 'multiShot') {
        selectCategoryUpgrade('attack', 'multiShot');
    } else if (type === 'directionalShot') {
        selectCategoryUpgrade('attack', 'directionalShot');
    }
}

// Upgrade açıklamalarını güncelle
function updateUpgradeDescriptions() {
    const multiShotDesc = document.getElementById('multiShotDesc');
    const directionalDesc = document.getElementById('directionalDesc');
    
    if (multiShotDesc) {
        if (upgrades.attack.multiShot === 0) {
            multiShotDesc.textContent = 'Aynı anda 2 mermi at';
        } else if (upgrades.attack.multiShot === 1) {
            multiShotDesc.textContent = 'Aynı anda 4 mermi at';
        } else {
            multiShotDesc.textContent = 'Maksimum seviye!';
        }
    }
    
    if (directionalDesc) {
        if (upgrades.attack.directionalShot === 0) {
            directionalDesc.textContent = 'Önden ve arkadan ateş et';
        } else if (upgrades.attack.directionalShot === 1) {
            directionalDesc.textContent = 'Dört yöne ateş et';
        } else {
            directionalDesc.textContent = 'Maksimum seviye!';
        }
    }
}

// Oyunu yeniden başlat
function restartGame() {
    gameState = {
        running: true,
        paused: false,
        score: 0,
        health: 100,
        maxHealth: 100,
        level: 1,
        nextLevelScore: 100,
        showUpgrade: false,
        gameTime: 0
    };
    
    upgrades = {
        attack: {
            multiShot: 0,
            directionalShot: 0,
            bulletSpeed: 0,
            bulletSize: 0,
            fireRate: 0,
            piercing: 0,
            explosive: 0,
            homingShots: 0
        },
        defense: {
            health: 0,
            shield: 0,
            regeneration: 0,
            armor: 0,
            invincibility: 0,
            thorns: 0,
            magneticField: 0
        },
        mobility: {
            speed: 0,
            dash: 0,
            teleport: 0,
            ghostMode: 0,
            wallBounce: 0,
            phaseShift: 0
        },
        utility: {
            scanner: 0,
            timeSlowdown: 0,
            autoTarget: 0,
            doubleScore: 0,
            bonusSpawn: 0,
            experienceBoost: 0,
            criticalHit: 0
        }
    };
    
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.direction = 'front';
    player.lastDirection = 'front';
    player.animationFrame = 0;
    
    bullets = [];
    enemies = [];
    bonuses = [];
    particles = [];
    
    enemySpawnTimer = 0;
    bonusSpawnTimer = 0;
    animationFrame = 0;
    
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('upgradeMenu').style.display = 'none';
    
    document.getElementById('multiShotBtn').disabled = false;
    document.getElementById('multiShotBtn').style.opacity = '1';
    document.getElementById('directionalBtn').disabled = false;
    document.getElementById('directionalBtn').style.opacity = '1';
    
    gameLoop();
}

// Error türü seçme (zaman bazlı)
function getRandomErrorType() {
    const timeMinutes = gameState.gameTime / 60000; // Milisaniyeyi dakikaya çevir
    
    // İlk 30 saniye sadece error1
    if (timeMinutes < 0.5) {
        return 'error1';
    }
    
    // İlk 1 dakika sadece error1 ve error2
    if (timeMinutes < 1) {
        const random = Math.random() * 100;
        return random < 85 ? 'error1' : 'error2';
    }
    
    // İlk 2 dakika error1, error2, error3
    if (timeMinutes < 2) {
        const random = Math.random() * 100;
        if (random < 70) return 'error1';
        else if (random < 95) return 'error2';
        else return 'error3';
    }
    
    // 2 dakika sonra tüm error türleri - kademeli artış
    let error1Chance = Math.max(40, 75 - timeMinutes * 5); // 75'den başlayıp 40'a kadar düşer
    let error4Chance = Math.min(15, timeMinutes * 2); // 0'dan başlayıp 15'e kadar çıkar
    let error3Chance = Math.min(20, 5 + timeMinutes * 1.5); // 5'den başlayıp 20'ye kadar çıkar
    let error2Chance = 100 - error1Chance - error3Chance - error4Chance; // Kalan yüzde
    
    const random = Math.random() * 100;
    
    if (random < error1Chance) return 'error1';
    else if (random < error1Chance + error2Chance) return 'error2';
    else if (random < error1Chance + error2Chance + error3Chance) return 'error3';
    else return 'error4';
}

// Düşman oluşturma
function spawnEnemy() {
    const side = Math.floor(Math.random() * 4);
    const errorType = getRandomErrorType();
    const errorData = errorTypes[errorType];
    
    let enemy = {
        width: errorData.size,
        height: errorData.size,
        speed: errorData.speed + (gameState.level - 1) * 0.1,
        color: '#ff0000',
        type: errorType,
        damage: errorData.damage,
        points: errorData.points,
        health: errorData.health,
        maxHealth: errorData.health,
        image: errorData.image
    };
    
    switch (side) {
        case 0: // Top
            enemy.x = Math.random() * (canvas.width - enemy.width);
            enemy.y = -enemy.height;
            enemy.dx = 0;
            enemy.dy = enemy.speed;
            break;
        case 1: // Right
            enemy.x = canvas.width;
            enemy.y = Math.random() * (canvas.height - enemy.height);
            enemy.dx = -enemy.speed;
            enemy.dy = 0;
            break;
        case 2: // Bottom
            enemy.x = Math.random() * (canvas.width - enemy.width);
            enemy.y = canvas.height;
            enemy.dx = 0;
            enemy.dy = -enemy.speed;
            break;
        case 3: // Left
            enemy.x = -enemy.width;
            enemy.y = Math.random() * (canvas.height - enemy.height);
            enemy.dx = enemy.speed;
            enemy.dy = 0;
            break;
    }
    
    enemies.push(enemy);
}

// Kategori seçimi göster
function showCategorySelection() {
    document.getElementById('categorySelection').style.display = 'block';
    document.getElementById('upgradeSelection').style.display = 'none';
}

// Kategori upgrade'lerini göster
function showCategoryUpgrades(category) {
    document.getElementById('categorySelection').style.display = 'none';
    document.getElementById('upgradeSelection').style.display = 'block';
    
    const categoryData = upgradeCategories[category];
    document.getElementById('selectedCategoryTitle').textContent = categoryData.name;
    document.getElementById('selectedCategoryTitle').style.color = categoryData.color;
    
    const upgradeGrid = document.getElementById('upgradeGrid');
    upgradeGrid.innerHTML = '';
    
    // Bu kategorideki tüm upgrade'leri listele
    const categoryUpgrades = upgrades[category];
    
    Object.keys(categoryUpgrades).forEach(upgradeKey => {
        const currentLevel = categoryUpgrades[upgradeKey];
        const upgradeInfo = upgradeDetails[upgradeKey];
        
        if (upgradeInfo && currentLevel < 3) { // Maksimum level 3
            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = 'upgrade-item';
            upgradeDiv.onclick = () => selectCategoryUpgrade(category, upgradeKey);
            
            const nextLevel = currentLevel + 1;
            const nextLevelText = upgradeInfo.levels[nextLevel];
            
            upgradeDiv.innerHTML = `
                <div class="upgrade-name">${upgradeInfo.name}</div>
                <div class="upgrade-level">Level ${currentLevel} → ${nextLevel}</div>
                <div class="upgrade-effect">${nextLevelText}</div>
            `;
            
            upgradeGrid.appendChild(upgradeDiv);
        }
    });
}

// Kategori upgrade'i seç
function selectCategoryUpgrade(category, upgradeKey) {
    // Upgrade level'ını artır
    upgrades[category][upgradeKey] = Math.min(upgrades[category][upgradeKey] + 1, 3);
    
    // Upgrade menüsünü kapat ve oyunu devam ettir
    gameState.showUpgrade = false;
    gameState.paused = false;
    document.getElementById('upgradeMenu').style.display = 'none';
    
    // Kategori seçimini tekrar göster (bir sonraki level için)
    showCategorySelection();
    
    // Upgrade etkilerini uygula
    applyUpgradeEffects();
    
    // Oyun döngüsünü yeniden başlat
    gameLoop();
}

// Upgrade etkilerini uygula
function applyUpgradeEffects() {
    // Hareket hızı
    if (upgrades.mobility.speed > 0) {
        player.speed = upgradeDetails.speed.effects[upgrades.mobility.speed];
    }
    
    // Maksimum can
    if (upgrades.defense.health > 0) {
        const newMaxHealth = upgradeDetails.health.effects[upgrades.defense.health];
        const healthRatio = gameState.health / 100; // Mevcut can oranı
        gameState.maxHealth = newMaxHealth;
        gameState.health = Math.min(gameState.health, newMaxHealth); // Can taşmasını önle
    } else {
        gameState.maxHealth = 100;
    }
}

// Oyunu başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
} else {
    startGame();
} 