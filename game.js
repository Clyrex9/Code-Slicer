// ⚔️ CODE SLICER - RELEASE QUALITY VERSION
// Professional-grade game engine with advanced systems

// =============================================================================
// CORE ENGINE & PERFORMANCE MONITORING
// =============================================================================

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;
        
        // Performance monitoring
        this.performanceMetrics = {
            renderTime: 0,
            updateTime: 0,
            totalObjects: 0,
            avgFps: 60
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.loadAssets();
    }
    
    setupCanvas() {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Smooth rendering
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }
}

// =============================================================================
// ENHANCED AUDIO SYSTEM
// =============================================================================

class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = new Map();
        this.currentMusic = null;
        this.masterVolume = 1.0;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.4;
        this.audioContext = null;
        
        this.init();
    }
    
    async init() {
        // Initialize Web Audio API for advanced audio processing
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupAudioNodes();
        } catch (e) {
            console.warn('Web Audio API not supported, falling back to HTML5 audio');
        }
        
        this.loadAudioAssets();
    }
    
    setupAudioNodes() {
        // Create audio processing chain
        this.masterGain = this.audioContext.createGain();
        this.sfxGain = this.audioContext.createGain();
        this.musicGain = this.audioContext.createGain();
        
        this.masterGain.connect(this.audioContext.destination);
        this.sfxGain.connect(this.masterGain);
        this.musicGain.connect(this.masterGain);
        
        // Dynamic range compressor for professional sound
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
        this.compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
        
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.audioContext.destination);
    }
    
    loadAudioAssets() {
        const audioFiles = {
            // Enhanced sound effects
            shoot: 'sounds/bullet.mp3',
            shootHeavy: 'sounds/bullet.mp3', // Will be pitch-shifted
            enemyHit: 'sounds/typing.mp3',
            enemyDestroy: 'sounds/error_start.mp3',
            playerHit: 'sounds/typing.mp3',
            levelUp: 'sounds/error_start.mp3',
            powerUp: 'sounds/typing.mp3',
            bossWarning: 'sounds/error_start.mp3',
            explosion: 'sounds/error_start.mp3',
            
            // Music tracks
            menuMusic: 'sounds/music5.mp3',
            gameMusic1: 'sounds/music1.mp3',
            gameMusic2: 'sounds/music2.mp3',
            intenseMusic1: 'sounds/music3.mp3',
            intenseMusic2: 'sounds/music4.mp3',
            bossMusic: 'sounds/music6.mp3'
        };
        
        // Load all audio files
        Object.entries(audioFiles).forEach(([name, path]) => {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.volume = 0.7;
            
            if (name.includes('Music')) {
                audio.loop = true;
                this.music.set(name, audio);
            } else {
                this.sounds.set(name, audio);
            }
        });
    }
    
    playSound(name, volume = 1.0, pitch = 1.0, pan = 0) {
        const sound = this.sounds.get(name);
        if (!sound) return;
        
        try {
            // Clone audio for overlapping sounds
            const audioClone = sound.cloneNode();
            audioClone.volume = volume * this.sfxVolume * this.masterVolume;
            audioClone.playbackRate = pitch;
            audioClone.currentTime = 0;
            
            // 3D audio positioning
            if (this.audioContext && audioClone.mozCaptureStream) {
                // Advanced audio positioning would go here
            }
            
            audioClone.play().catch(e => console.log('Audio play failed:', e));
            
            // Cleanup after playback
            audioClone.addEventListener('ended', () => {
                audioClone.remove();
            });
            
        } catch (e) {
            console.log('Sound playback error:', e);
        }
    }
    
    playMusic(name, fadeTime = 1000) {
        const newMusic = this.music.get(name);
        if (!newMusic || newMusic === this.currentMusic) return;
        
        // Fade out current music
        if (this.currentMusic) {
            this.fadeOut(this.currentMusic, fadeTime);
        }
        
        // Fade in new music
        newMusic.volume = 0;
        newMusic.currentTime = 0;
        newMusic.play().catch(e => console.log('Music play failed:', e));
        this.fadeIn(newMusic, fadeTime);
        this.currentMusic = newMusic;
    }
    
    fadeIn(audio, duration) {
        const targetVolume = this.musicVolume * this.masterVolume;
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = targetVolume / steps;
        
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(interval);
                audio.volume = targetVolume;
                return;
            }
            
            audio.volume = volumeStep * currentStep;
            currentStep++;
        }, stepTime);
    }
    
    fadeOut(audio, duration) {
        const initialVolume = audio.volume;
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = initialVolume / steps;
        
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(interval);
                audio.pause();
                audio.volume = initialVolume;
                return;
            }
            
            audio.volume = initialVolume - (volumeStep * currentStep);
            currentStep++;
        }, stepTime);
    }
}

// =============================================================================
// ADVANCED VISUAL EFFECTS SYSTEM
// =============================================================================

class VFXManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.effects = [];
        this.particlePools = new Map();
        this.screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
        this.flashEffect = { active: false, color: '#ffffff', alpha: 0, duration: 0 };
        this.timeScale = 1.0;
        
        this.initParticlePools();
    }
    
    initParticlePools() {
        // Pre-allocate particle pools for performance
        const poolTypes = ['spark', 'smoke', 'explosion', 'blood', 'energy'];
        poolTypes.forEach(type => {
            this.particlePools.set(type, []);
            for (let i = 0; i < 100; i++) {
                this.particlePools.get(type).push(this.createParticle(type));
            }
        });
    }
    
    createParticle(type) {
        return {
            x: 0, y: 0, vx: 0, vy: 0,
            life: 0, maxLife: 0, size: 0, color: '#ffffff',
            alpha: 1, rotation: 0, rotationSpeed: 0,
            gravity: 0, drag: 0.98, type: type, active: false
        };
    }
    
    getParticle(type) {
        const pool = this.particlePools.get(type);
        if (!pool) return null;
        
        for (let particle of pool) {
            if (!particle.active) {
                particle.active = true;
                return particle;
            }
        }
        
        // If no free particles, create new one
        const newParticle = this.createParticle(type);
        newParticle.active = true;
        pool.push(newParticle);
        return newParticle;
    }
    
    createMuzzleFlash(x, y, angle, intensity = 1.0) {
        for (let i = 0; i < 8 * intensity; i++) {
            const particle = this.getParticle('spark');
            if (!particle) continue;
            
            const spread = 0.3;
            const particleAngle = angle + (Math.random() - 0.5) * spread;
            const speed = (3 + Math.random() * 4) * intensity;
            
            Object.assign(particle, {
                x: x, y: y,
                vx: Math.cos(particleAngle) * speed,
                vy: Math.sin(particleAngle) * speed,
                life: 15 + Math.random() * 10,
                maxLife: 15 + Math.random() * 10,
                size: 2 + Math.random() * 3,
                color: `hsl(${45 + Math.random() * 30}, 100%, ${60 + Math.random() * 40}%)`,
                alpha: 1,
                drag: 0.92,
                gravity: 0.1
            });
        }
        
        // Screen shake for shooting
        this.addScreenShake(1 * intensity, 100);
    }
    
    createExplosion(x, y, size = 1.0, color = '#ff4400') {
        const particleCount = Math.floor(20 * size);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.getParticle('explosion');
            if (!particle) continue;
            
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const speed = (2 + Math.random() * 6) * size;
            
            Object.assign(particle, {
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30 + Math.random() * 20,
                maxLife: 30 + Math.random() * 20,
                size: (3 + Math.random() * 4) * size,
                color: color,
                alpha: 1,
                drag: 0.95,
                gravity: 0.05
            });
        }
        
        // Intense screen shake for explosions
        this.addScreenShake(8 * size, 300);
        
        // Flash effect
        this.addFlashEffect('#ffaa00', 0.3, 200);
    }
    
    createImpactEffect(x, y, angle, intensity = 1.0) {
        for (let i = 0; i < 12 * intensity; i++) {
            const particle = this.getParticle('spark');
            if (!particle) continue;
            
            // Particles fly away from impact point
            const spread = Math.PI * 0.6;
            const particleAngle = angle + Math.PI + (Math.random() - 0.5) * spread;
            const speed = (1 + Math.random() * 3) * intensity;
            
            Object.assign(particle, {
                x: x, y: y,
                vx: Math.cos(particleAngle) * speed,
                vy: Math.sin(particleAngle) * speed,
                life: 20 + Math.random() * 15,
                maxLife: 20 + Math.random() * 15,
                size: 1 + Math.random() * 2,
                color: `hsl(${Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`,
                alpha: 1,
                drag: 0.9,
                gravity: 0.2
            });
        }
    }
    
    addScreenShake(intensity, duration) {
        this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
        this.screenShake.duration = Math.max(this.screenShake.duration, duration);
    }
    
    addFlashEffect(color, alpha, duration) {
        this.flashEffect.active = true;
        this.flashEffect.color = color;
        this.flashEffect.alpha = alpha;
        this.flashEffect.duration = duration;
        this.flashEffect.maxDuration = duration;
    }
    
    update(deltaTime) {
        // Update screen shake
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= deltaTime;
            const shakeAmount = this.screenShake.intensity * (this.screenShake.duration / 300);
            this.screenShake.x = (Math.random() - 0.5) * shakeAmount;
            this.screenShake.y = (Math.random() - 0.5) * shakeAmount;
            
            if (this.screenShake.duration <= 0) {
                this.screenShake.x = 0;
                this.screenShake.y = 0;
                this.screenShake.intensity = 0;
            }
        }
        
        // Update flash effect
        if (this.flashEffect.active) {
            this.flashEffect.duration -= deltaTime;
            this.flashEffect.alpha = Math.max(0, this.flashEffect.duration / this.flashEffect.maxDuration);
            
            if (this.flashEffect.duration <= 0) {
                this.flashEffect.active = false;
            }
        }
        
        // Update all particles
        this.particlePools.forEach(pool => {
            pool.forEach(particle => {
                if (!particle.active) return;
                
                particle.life -= deltaTime * this.timeScale;
                if (particle.life <= 0) {
                    particle.active = false;
                    return;
                }
                
                // Physics update
                particle.vx *= particle.drag;
                particle.vy *= particle.drag;
                particle.vy += particle.gravity;
                
                particle.x += particle.vx * deltaTime * 0.1;
                particle.y += particle.vy * deltaTime * 0.1;
                
                particle.rotation += particle.rotationSpeed * deltaTime * 0.1;
                particle.alpha = particle.life / particle.maxLife;
            });
        });
    }
    
    render() {
        // Apply screen shake
        this.ctx.save();
        this.ctx.translate(this.screenShake.x, this.screenShake.y);
        
        // Render all active particles
        this.particlePools.forEach(pool => {
            pool.forEach(particle => {
                if (!particle.active || particle.alpha <= 0) return;
                
                this.ctx.save();
                this.ctx.globalAlpha = particle.alpha;
                this.ctx.fillStyle = particle.color;
                
                this.ctx.translate(particle.x, particle.y);
                if (particle.rotation !== 0) {
                    this.ctx.rotate(particle.rotation);
                }
                
                // Different rendering based on particle type
                switch (particle.type) {
                    case 'spark':
                        this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
                        break;
                    case 'explosion':
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                    default:
                        this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
                }
                
                this.ctx.restore();
            });
        });
        
        this.ctx.restore();
        
        // Render flash effect
        if (this.flashEffect.active && this.flashEffect.alpha > 0) {
            this.ctx.save();
            this.ctx.globalAlpha = this.flashEffect.alpha;
            this.ctx.fillStyle = this.flashEffect.color;
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.restore();
        }
    }
    
    setTimeScale(scale) {
        this.timeScale = scale;
    }
}

// =============================================================================
// ENHANCED WEAPON SYSTEM
// =============================================================================

class WeaponSystem {
    constructor(audioManager, vfxManager) {
        this.audioManager = audioManager;
        this.vfxManager = vfxManager;
        this.weapons = new Map();
        this.currentWeapon = 'basic';
        this.fireRate = 250; // ms between shots
        this.lastFireTime = 0;
        
        this.initWeapons();
    }
    
    initWeapons() {
        this.weapons.set('basic', {
            name: 'Basic Cannon',
            damage: 1,
            fireRate: 250,
            bulletSpeed: 8,
            bulletSize: 8,
            spread: 0,
            projectileCount: 1,
            piercing: 1,
            explosive: false,
            homing: false,
            color: '#00ff88',
            sound: 'shoot',
            muzzleFlashIntensity: 1.0
        });
        
        this.weapons.set('rapidfire', {
            name: 'Rapid Fire',
            damage: 1,
            fireRate: 100,
            bulletSpeed: 10,
            bulletSize: 6,
            spread: 0.1,
            projectileCount: 1,
            piercing: 1,
            explosive: false,
            homing: false,
            color: '#ffff00',
            sound: 'shoot',
            muzzleFlashIntensity: 0.7
        });
        
        this.weapons.set('shotgun', {
            name: 'Scatter Cannon',
            damage: 1,
            fireRate: 500,
            bulletSpeed: 6,
            bulletSize: 6,
            spread: 0.6,
            projectileCount: 5,
            piercing: 1,
            explosive: false,
            homing: false,
            color: '#ff8800',
            sound: 'shootHeavy',
            muzzleFlashIntensity: 2.0
        });
        
        this.weapons.set('explosive', {
            name: 'Rocket Launcher',
            damage: 3,
            fireRate: 800,
            bulletSpeed: 5,
            bulletSize: 12,
            spread: 0,
            projectileCount: 1,
            piercing: 1,
            explosive: true,
            explosionRadius: 60,
            homing: false,
            color: '#ff4400',
            sound: 'shootHeavy',
            muzzleFlashIntensity: 1.5
        });
    }
    
    fire(x, y, targetX, targetY, upgrades = {}) {
        const currentTime = Date.now();
        const weapon = this.weapons.get(this.currentWeapon);
        if (!weapon) return [];
        
        // Apply fire rate with upgrades
        const modifiedFireRate = weapon.fireRate * (upgrades.fireRateMultiplier || 1.0);
        if (currentTime - this.lastFireTime < modifiedFireRate) return [];
        
        this.lastFireTime = currentTime;
        
        // Calculate firing angle
        const angle = Math.atan2(targetY - y, targetX - x);
        
        // Create muzzle flash
        this.vfxManager.createMuzzleFlash(x, y, angle, weapon.muzzleFlashIntensity);
        
        // Play sound with slight pitch variation
        const pitchVariation = 0.9 + Math.random() * 0.2;
        this.audioManager.playSound(weapon.sound, 1.0, pitchVariation);
        
        // Create projectiles
        const bullets = [];
        const projectileCount = weapon.projectileCount * (upgrades.multiShotMultiplier || 1);
        
        for (let i = 0; i < projectileCount; i++) {
            const spreadAngle = weapon.spread * (Math.random() - 0.5);
            const bulletAngle = angle + spreadAngle;
            
            // Calculate spread offset for multiple projectiles
            let offsetX = 0, offsetY = 0;
            if (projectileCount > 1) {
                const spreadOffset = (i - (projectileCount - 1) / 2) * 8;
                offsetX = Math.cos(angle + Math.PI/2) * spreadOffset;
                offsetY = Math.sin(angle + Math.PI/2) * spreadOffset;
            }
            
            const bullet = {
                x: x + offsetX,
                y: y + offsetY,
                dx: Math.cos(bulletAngle) * weapon.bulletSpeed,
                dy: Math.sin(bulletAngle) * weapon.bulletSpeed,
                width: weapon.bulletSize,
                height: weapon.bulletSize,
                damage: weapon.damage * (upgrades.damageMultiplier || 1),
                color: weapon.color,
                piercing: weapon.piercing + (upgrades.piercingBonus || 0),
                explosive: weapon.explosive,
                explosionRadius: weapon.explosionRadius || 0,
                homing: weapon.homing || (upgrades.homingStrength || 0),
                hitCount: 0,
                life: 300, // Bullet lifetime in frames
                trail: [] // For visual trail effect
            };
            
            bullets.push(bullet);
        }
        
        return bullets;
    }
    
    switchWeapon(weaponId) {
        if (this.weapons.has(weaponId)) {
            this.currentWeapon = weaponId;
            return true;
        }
        return false;
    }
    
    getCurrentWeapon() {
        return this.weapons.get(this.currentWeapon);
    }
}

// =============================================================================
// GAME STATE AND INITIALIZATION
// =============================================================================

// Global game instances
let gameEngine;
let audioManager;
let vfxManager;
let weaponSystem;

// Game state
let gameState = {
    running: true,
    paused: false,
    score: 0,
    health: 100,
    maxHealth: 100,
    shield: 0,
    maxShield: 0,
    level: 1,
    nextLevelScore: 100,
    showUpgrade: false,
    gameTime: 0,
    combo: 0,
    maxCombo: 0,
    comboTimer: 0,
    bossActive: false,
    wave: 1
};

// Enhanced upgrade system
let upgrades = {
    attack: {
        multiShot: 0,        // Increases projectile count
        directionalShot: 0,  // Adds directional firing
        bulletSpeed: 0,      // Increases bullet velocity
        bulletSize: 0,       // Increases bullet size and damage
        fireRate: 0,         // Increases fire rate
        piercing: 0,         // Bullets penetrate enemies
        explosive: 0,        // Bullets explode on impact
        homingShots: 0,      // Bullets track enemies
        criticalHit: 0,      // Chance for critical hits
        weaponType: 0        // Unlocks different weapon types
    },
    defense: {
        health: 0,           // Increases max health
        shield: 0,           // Adds energy shield
        regeneration: 0,     // Health regeneration over time
        armor: 0,            // Reduces incoming damage
        invincibility: 0,    // Brief invincibility after taking damage
        thorns: 0,           // Reflects damage to attackers
        magneticField: 0,    // Repels enemies
        absorption: 0        // Converts damage to shield/health
    },
    mobility: {
        speed: 0,            // Movement speed
        dash: 0,             // Dash ability
        teleport: 0,         // Teleportation ability
        ghostMode: 0,        // Temporary invulnerability
        wallBounce: 0,       // Bounce off walls
        phaseShift: 0,       // Chance to avoid damage
        timeSlowdown: 0,     // Slow down time during combat
        doubleJump: 0        // Air mobility
    },
    utility: {
        scanner: 0,          // Enemy/item detection
        autoTarget: 0,       // Automatic targeting
        scoreMultiplier: 0,  // Increases score gain
        bonusSpawn: 0,       // More bonus items
        experienceBoost: 0,  // Faster leveling
        magnet: 0,           // Attracts items
        companion: 0,        // AI companion
        overcharge: 0        // Temporary power boost
    }
};

// Player object with enhanced properties
let player = {
    x: 400,
    y: 300,
    width: 55,
    height: 55,
    speed: 2.5,
    direction: 'front',
    lastDirection: 'front',
    animationFrame: 0,
    animationSpeed: 8,
    
    // Combat properties
    invulnerable: false,
    invulnerabilityTime: 0,
    dashCooldown: 0,
    dashDistance: 0,
    
    // Visual effects
    trail: [],
    glowIntensity: 0
};

// Enhanced game objects
let bullets = [];
let enemies = [];
let bonuses = [];
let boss = null;

// Mouse and input
let mouse = { x: 400, y: 300, isMoving: false, lastMoveTime: 0 };
let keys = {};

// Timing
let enemySpawnTimer = 0;
let bonusSpawnTimer = 0;
let lastTime = Date.now();

// Asset loading
const characterImages = {};
const errorImages = {};
const uiImages = {};
let imagesLoaded = 0;
let totalImages = 0;

// =============================================================================
// INITIALIZATION
// =============================================================================

function initGame() {
    console.log('🎮 Initializing Code Slicer - Release Quality');
    
    // Initialize core systems
    gameEngine = new GameEngine();
    audioManager = new AudioManager();
    vfxManager = new VFXManager(gameEngine.ctx);
    weaponSystem = new WeaponSystem(audioManager, vfxManager);
    
    // Load assets
    loadAllAssets();
    
    // Setup input handling
    setupInputHandlers();
    
    // Start background music
    audioManager.playMusic('menuMusic');
    
    console.log('✅ Game initialization complete');
}

function loadAllAssets() {
    const imageList = [
        // Character sprites
        'character_front_1', 'character_front_2',
        'character_back_1', 'character_back_2', 
        'character_left', 'character_left_2',
        'character_right_1', 'character_right_2',
        
        // Enemy sprites
        'error1', 'error2', 'error3', 'error4',
        'error_boss1', 'error_boss2',
        
        // UI elements
        'skor', 'paused', 'resume', 'restart'
    ];
    
    totalImages = imageList.length;
    
    imageList.forEach(name => {
        const img = new Image();
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                startGame();
            }
        };
        img.onerror = () => {
            imagesLoaded++;
            console.warn(`Failed to load image: ${name}`);
            if (imagesLoaded === totalImages) {
                startGame();
            }
        };
        
        img.src = `images/${name}.png`;
        
        // Categorize images
        if (name.startsWith('character_')) {
            characterImages[name] = img;
        } else if (name.startsWith('error')) {
            errorImages[name] = img;
        } else {
            uiImages[name] = img;
        }
    });
}

function setupInputHandlers() {
    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Mouse events
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent context menu
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Custom cursor tracking
    document.addEventListener('mousemove', updateCustomCursor);
}

function handleKeyDown(e) {
    keys[e.code] = true;
    
    switch(e.code) {
        case 'Escape':
            togglePause();
            break;
        case 'ShiftLeft':
        case 'ShiftRight':
            performDash();
            break;
        case 'KeyW':
            e.preventDefault();
            shootDirection('back');
            break;
        case 'KeyA':
            e.preventDefault();
            shootDirection('left');
            break;
        case 'KeyS':
            e.preventDefault();
            shootDirection('front');
            break;
        case 'KeyD':
            e.preventDefault();
            shootDirection('right');
            break;
        case 'Space':
            e.preventDefault();
            shoot();
            break;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
            const weaponIndex = parseInt(e.code.slice(-1)) - 1;
            const weaponIds = ['basic', 'rapidfire', 'shotgun', 'explosive'];
            if (weaponIds[weaponIndex]) {
                weaponSystem.switchWeapon(weaponIds[weaponIndex]);
            }
            break;
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;
}

function handleMouseMove(e) {
    const rect = gameEngine.canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isMoving = true;
    mouse.lastMoveTime = Date.now();
}

function handleMouseDown(e) {
    if (e.button === 0) { // Left click
        shoot();
    }
}

function handleMouseUp(e) {
    // Handle mouse release events if needed
}

function updateCustomCursor(e) {
    const cursor = document.getElementById('customCursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
}

// =============================================================================
// CORE GAME LOOP
// =============================================================================

function startGame() {
    console.log('🚀 Starting game loop');
    audioManager.playMusic('gameMusic1');
    gameLoop();
}

function gameLoop() {
    if (!gameState.running) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Performance monitoring
    const updateStart = performance.now();
    
    if (!gameState.paused) {
        gameState.gameTime += deltaTime;
        update(deltaTime);
    }
    
    const updateEnd = performance.now();
    const renderStart = performance.now();
    
    render();
    
    const renderEnd = performance.now();
    
    // Update performance metrics
    gameEngine.performanceMetrics.updateTime = updateEnd - updateStart;
    gameEngine.performanceMetrics.renderTime = renderEnd - renderStart;
    gameEngine.performanceMetrics.totalObjects = bullets.length + enemies.length + bonuses.length;
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Update core systems
    vfxManager.update(deltaTime);
    
    // Update player
    updatePlayer(deltaTime);
    
    // Update game objects
    updateBullets(deltaTime);
    updateEnemies(deltaTime);
    updateBonuses(deltaTime);
    
    if (boss) {
        updateBoss(deltaTime);
    }
    
    // Update game state
    updateGameState(deltaTime);
    
    // Check collisions
    checkCollisions();
    
    // Update combo system
    updateComboSystem(deltaTime);
}

function render() {
    const ctx = gameEngine.ctx;
    
    // Clear canvas with background
    drawBackground(ctx);
    
    // Render game objects
    drawPlayer(ctx);
    drawBullets(ctx);
    drawEnemies(ctx);
    drawBonuses(ctx);
    
    if (boss) {
        drawBoss(ctx);
    }
    
    // Render VFX (includes screen shake)
    vfxManager.render();
    
    // Draw UI
    drawUI(ctx);
    
    // Draw performance metrics in debug mode
    if (keys['KeyF3']) {
        drawDebugInfo(ctx);
    }
}

// =============================================================================
// PLACEHOLDER FUNCTIONS (TO BE IMPLEMENTED IN NEXT ITERATIONS)
// =============================================================================

function drawBackground(ctx) {
    // Enhanced background rendering
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Grid pattern with glow effect
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 2;
    
    for (let i = 0; i < ctx.canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, ctx.canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < ctx.canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
}

function updatePlayer(deltaTime) {
    // Enhanced player movement with acceleration
    const targetSpeed = upgradeDetails?.speed?.effects[upgrades.mobility.speed] || player.speed;
    
    // Handle movement input
    if (mouse.isMoving && Date.now() - mouse.lastMoveTime < 100) {
        const dx = mouse.x - (player.x + player.width / 2);
        const dy = mouse.y - (player.y + player.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) { // Dead zone
            const moveX = (dx / distance) * targetSpeed;
            const moveY = (dy / distance) * targetSpeed;
            
            player.x += moveX;
            player.y += moveY;
            
            // Update direction for animation
            if (Math.abs(dx) > Math.abs(dy)) {
                player.direction = dx > 0 ? 'right' : 'left';
            } else {
                player.direction = dy > 0 ? 'front' : 'back';
            }
        }
    }
    
    // Keep player in bounds
    player.x = Math.max(0, Math.min(gameEngine.canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(gameEngine.canvas.height - player.height, player.y));
    
    // Update animation
    player.animationFrame += deltaTime * 0.01;
    
    // Update invulnerability
    if (player.invulnerable) {
        player.invulnerabilityTime -= deltaTime;
        if (player.invulnerabilityTime <= 0) {
            player.invulnerable = false;
        }
    }
    
    // Update dash cooldown
    if (player.dashCooldown > 0) {
        player.dashCooldown -= deltaTime;
    }
}

function updateBullets(deltaTime) {
    bullets = bullets.filter(bullet => {
        // Move bullet
        bullet.x += bullet.dx * deltaTime * 0.1;
        bullet.y += bullet.dy * deltaTime * 0.1;
        
        // Update lifetime
        bullet.life -= deltaTime * 0.1;
        
        // Add trail effect
        if (bullet.trail.length > 10) {
            bullet.trail.shift();
        }
        bullet.trail.push({ x: bullet.x, y: bullet.y, alpha: 1.0 });
        
        // Update trail alpha
        bullet.trail.forEach((point, index) => {
            point.alpha = index / bullet.trail.length;
        });
        
        // Remove if out of bounds or lifetime expired
        return bullet.x > -bullet.width && bullet.x < gameEngine.canvas.width + bullet.width &&
               bullet.y > -bullet.height && bullet.y < gameEngine.canvas.height + bullet.height &&
               bullet.life > 0;
    });
}

function updateEnemies(deltaTime) {
    // Enemy spawning logic
    enemySpawnTimer += deltaTime;
    const timeMinutes = gameState.gameTime / 60000;
    
    let baseSpawnRate = 2000 - (gameState.level * 100) - (timeMinutes * 50);
    baseSpawnRate = Math.max(baseSpawnRate, 500);
    
    if (enemySpawnTimer >= baseSpawnRate) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }
    
    // Update existing enemies
    enemies.forEach(enemy => {
        // AI behavior
        const dx = (player.x + player.width / 2) - (enemy.x + enemy.width / 2);
        const dy = (player.y + player.height / 2) - (enemy.y + enemy.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed * deltaTime * 0.1;
            enemy.y += (dy / distance) * enemy.speed * deltaTime * 0.1;
        }
    });
    
    // Remove enemies that are too far away
    enemies = enemies.filter(enemy => {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 1000; // Remove if too far
    });
}

function updateBonuses(deltaTime) {
    // Bonus spawning
    bonusSpawnTimer += deltaTime;
    if (bonusSpawnTimer >= 5000) {
        spawnBonus();
        bonusSpawnTimer = 0;
    }
    
    // Update bonus animations
    bonuses.forEach(bonus => {
        bonus.pulseTimer += deltaTime * 0.005;
        
        // Magnetic attraction if player has magnet upgrade
        if (upgrades.utility.magnet > 0) {
            const dx = (player.x + player.width / 2) - (bonus.x + bonus.width / 2);
            const dy = (player.y + player.height / 2) - (bonus.y + bonus.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const magnetRange = 100 + (upgrades.utility.magnet * 50);
            if (distance < magnetRange && distance > 0) {
                const pullStrength = 0.1 + (upgrades.utility.magnet * 0.05);
                bonus.x += (dx / distance) * pullStrength * deltaTime * 0.1;
                bonus.y += (dy / distance) * pullStrength * deltaTime * 0.1;
            }
        }
    });
}

function updateBoss(deltaTime) {
    // Boss update logic - placeholder
    if (!boss) return;
    
    // Basic AI for now
    const dx = player.x - boss.x;
    const dy = player.y - boss.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
        boss.x += (dx / distance) * boss.speed * deltaTime * 0.05;
        boss.y += (dy / distance) * boss.speed * deltaTime * 0.05;
    }
}

function updateGameState(deltaTime) {
    // Level progression
    if (gameState.score >= gameState.nextLevelScore) {
        levelUp();
    }
    
    // Boss spawning logic
    if (!gameState.bossActive && gameState.level % 5 === 0 && gameState.level > 0) {
        spawnBoss();
    }
    
    // Dynamic music based on intensity
    updateDynamicMusic();
}

function updateComboSystem(deltaTime) {
    if (gameState.comboTimer > 0) {
        gameState.comboTimer -= deltaTime;
        if (gameState.comboTimer <= 0) {
            gameState.combo = 0;
        }
    }
}

function checkCollisions() {
    // Bullet-Enemy collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (isColliding(bullets[i], enemies[j])) {
                handleBulletEnemyCollision(bullets[i], enemies[j], i, j);
            }
        }
        
        // Bullet-Boss collision
        if (boss && isColliding(bullets[i], boss)) {
            handleBulletBossCollision(bullets[i], boss, i);
        }
    }
    
    // Player-Enemy collisions
    if (!player.invulnerable) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (isColliding(player, enemies[i])) {
                handlePlayerEnemyCollision(enemies[i], i);
            }
        }
        
        // Player-Boss collision
        if (boss && !player.invulnerable && isColliding(player, boss)) {
            handlePlayerBossCollision(boss);
        }
    }
    
    // Player-Bonus collisions
    for (let i = bonuses.length - 1; i >= 0; i--) {
        if (isColliding(player, bonuses[i])) {
            handlePlayerBonusCollision(bonuses[i], i);
        }
    }
}

function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Collision handlers
function handleBulletEnemyCollision(bullet, enemy, bulletIndex, enemyIndex) {
    // Create impact effect
    vfxManager.createImpactEffect(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 
                                 Math.atan2(bullet.dy, bullet.dx));
    
    // Apply damage
    let damage = bullet.damage;
    if (Math.random() < (upgrades.attack.criticalHit * 0.1)) {
        damage *= 2;
        vfxManager.addFlashEffect('#ffff00', 0.2, 100);
    }
    
    enemy.health -= damage;
    audioManager.playSound('enemyHit', 0.8, 0.9 + Math.random() * 0.2);
    
    // Handle piercing
    bullet.hitCount = (bullet.hitCount || 0) + 1;
    if (bullet.hitCount >= bullet.piercing) {
        bullets.splice(bulletIndex, 1);
    }
    
    // Handle explosive
    if (bullet.explosive) {
        vfxManager.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 1.5);
        audioManager.playSound('explosion');
        
        // Damage nearby enemies
        enemies.forEach(otherEnemy => {
            if (otherEnemy !== enemy) {
                const dx = (otherEnemy.x + otherEnemy.width/2) - (enemy.x + enemy.width/2);
                const dy = (otherEnemy.y + otherEnemy.height/2) - (enemy.y + enemy.height/2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= bullet.explosionRadius) {
                    otherEnemy.health -= Math.floor(damage * 0.7);
                }
            }
        });
    }
    
    // Check if enemy is dead
    if (enemy.health <= 0) {
        // Award points with combo multiplier
        const basePoints = enemy.points;
        const comboMultiplier = 1 + (gameState.combo * 0.1);
        const points = Math.floor(basePoints * comboMultiplier * (upgrades.utility.scoreMultiplier + 1));
        
        gameState.score += points;
        gameState.combo++;
        gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
        gameState.comboTimer = 3000; // 3 seconds to maintain combo
        
        // Death effects
        vfxManager.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 1.0, enemy.color);
        audioManager.playSound('enemyDestroy');
        
        enemies.splice(enemyIndex, 1);
    }
}

function handleBulletBossCollision(bullet, boss, bulletIndex) {
    // Similar to enemy collision but with boss-specific logic
    vfxManager.createImpactEffect(boss.x + boss.width/2, boss.y + boss.height/2, 
                                 Math.atan2(bullet.dy, bullet.dx), 2.0);
    
    boss.health -= bullet.damage;
    audioManager.playSound('enemyHit', 1.0, 0.7); // Lower pitch for boss
    
    // Remove bullet unless piercing
    bullet.hitCount = (bullet.hitCount || 0) + 1;
    if (bullet.hitCount >= bullet.piercing) {
        bullets.splice(bulletIndex, 1);
    }
    
    // Check if boss is defeated
    if (boss.health <= 0) {
        defeatBoss();
    }
}

function handlePlayerEnemyCollision(enemy, enemyIndex) {
    takeDamage(enemy.damage);
    enemies.splice(enemyIndex, 1);
    
    // Visual feedback
    vfxManager.createImpactEffect(player.x + player.width/2, player.y + player.height/2, 0, 1.5);
    vfxManager.addScreenShake(5, 200);
    vfxManager.addFlashEffect('#ff0000', 0.4, 300);
}

function handlePlayerBossCollision(boss) {
    takeDamage(boss.damage);
    
    // Stronger visual feedback for boss collision
    vfxManager.addScreenShake(10, 400);
    vfxManager.addFlashEffect('#ff0000', 0.6, 500);
}

function handlePlayerBonusCollision(bonus, bonusIndex) {
    // Award points
    let points = bonus.value;
    if (upgrades.utility.scoreMultiplier > 0) {
        points *= (1 + upgrades.utility.scoreMultiplier);
    }
    
    gameState.score += points;
    
    // Bonus effects
    vfxManager.createExplosion(bonus.x + bonus.width/2, bonus.y + bonus.height/2, 0.8, '#00ff00');
    audioManager.playSound('powerUp');
    
    bonuses.splice(bonusIndex, 1);
}

// More placeholder functions for core mechanics
function shoot() {
    const newBullets = weaponSystem.fire(
        player.x + player.width/2, 
        player.y + player.height/2,
        mouse.x, 
        mouse.y, 
        {
            multiShotMultiplier: 1 + upgrades.attack.multiShot,
            damageMultiplier: 1 + upgrades.attack.bulletSize * 0.5,
            fireRateMultiplier: Math.max(0.2, 1 - upgrades.attack.fireRate * 0.2),
            piercingBonus: upgrades.attack.piercing,
            homingStrength: upgrades.attack.homingShots * 0.05
        }
    );
    
    bullets.push(...newBullets);
}

function shootDirection(direction) {
    const directions = {
        'front': { x: 0, y: 1 },
        'back': { x: 0, y: -1 },
        'left': { x: -1, y: 0 },
        'right': { x: 1, y: 0 }
    };
    
    const dir = directions[direction];
    if (!dir) return;
    
    const targetX = player.x + player.width/2 + dir.x * 100;
    const targetY = player.y + player.height/2 + dir.y * 100;
    
    const newBullets = weaponSystem.fire(
        player.x + player.width/2,
        player.y + player.height/2,
        targetX,
        targetY,
        {
            multiShotMultiplier: 1 + upgrades.attack.multiShot,
            damageMultiplier: 1 + upgrades.attack.bulletSize * 0.5,
            fireRateMultiplier: Math.max(0.2, 1 - upgrades.attack.fireRate * 0.2),
            piercingBonus: upgrades.attack.piercing,
            homingStrength: upgrades.attack.homingShots * 0.05
        }
    );
    
    bullets.push(...newBullets);
}

function performDash() {
    if (player.dashCooldown > 0 || upgrades.mobility.dash === 0) return;
    
    const dashDistance = 50 + upgrades.mobility.dash * 25;
    const dx = mouse.x - (player.x + player.width/2);
    const dy = mouse.y - (player.y + player.height/2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
        const dashX = (dx / distance) * dashDistance;
        const dashY = (dy / distance) * dashDistance;
        
        player.x += dashX;
        player.y += dashY;
        
        // Keep in bounds
        player.x = Math.max(0, Math.min(gameEngine.canvas.width - player.width, player.x));
        player.y = Math.max(0, Math.min(gameEngine.canvas.height - player.height, player.y));
        
        // Visual effects
        vfxManager.createExplosion(player.x + player.width/2, player.y + player.height/2, 0.5, '#00ffff');
        audioManager.playSound('powerUp', 0.8, 1.2);
        
        // Cooldown
        player.dashCooldown = 2000 - (upgrades.mobility.dash * 300);
        
        // Brief invulnerability during dash
        player.invulnerable = true;
        player.invulnerabilityTime = 200;
    }
}

function takeDamage(amount) {
    // Apply armor reduction
    if (upgrades.defense.armor > 0) {
        amount *= (1 - upgrades.defense.armor * 0.15);
    }
    
    amount = Math.ceil(amount);
    
    // Shield absorbs damage first
    if (gameState.shield > 0) {
        if (amount <= gameState.shield) {
            gameState.shield -= amount;
            amount = 0;
        } else {
            amount -= gameState.shield;
            gameState.shield = 0;
        }
    }
    
    // Apply remaining damage to health
    gameState.health -= amount;
    
    // Invulnerability frames
    player.invulnerable = true;
    player.invulnerabilityTime = 500 + (upgrades.defense.invincibility * 250);
    
    // Audio feedback
    audioManager.playSound('playerHit');
    
    // Break combo on taking damage
    gameState.combo = 0;
    gameState.comboTimer = 0;
    
    // Check for game over
    if (gameState.health <= 0) {
        gameOver();
    }
}

function spawnEnemy() {
    const enemyTypes = ['error1', 'error2', 'error3', 'error4'];
    const timeMinutes = gameState.gameTime / 60000;
    
    // Time-based enemy type probability
    let enemyType;
    if (timeMinutes < 0.5) {
        enemyType = 'error1';
    } else if (timeMinutes < 1) {
        enemyType = Math.random() < 0.8 ? 'error1' : 'error2';
    } else if (timeMinutes < 2) {
        const rand = Math.random();
        if (rand < 0.6) enemyType = 'error1';
        else if (rand < 0.9) enemyType = 'error2';
        else enemyType = 'error3';
    } else {
        const rand = Math.random();
        if (rand < 0.4) enemyType = 'error1';
        else if (rand < 0.7) enemyType = 'error2';
        else if (rand < 0.9) enemyType = 'error3';
        else enemyType = 'error4';
    }
    
    const enemyData = getEnemyData(enemyType);
    const side = Math.floor(Math.random() * 4);
    
    const enemy = {
        ...enemyData,
        type: enemyType,
        health: enemyData.maxHealth,
        maxHealth: enemyData.maxHealth
    };
    
    // Spawn position based on side
    switch (side) {
        case 0: // Top
            enemy.x = Math.random() * (gameEngine.canvas.width - enemy.width);
            enemy.y = -enemy.height;
            break;
        case 1: // Right
            enemy.x = gameEngine.canvas.width;
            enemy.y = Math.random() * (gameEngine.canvas.height - enemy.height);
            break;
        case 2: // Bottom
            enemy.x = Math.random() * (gameEngine.canvas.width - enemy.width);
            enemy.y = gameEngine.canvas.height;
            break;
        case 3: // Left
            enemy.x = -enemy.width;
            enemy.y = Math.random() * (gameEngine.canvas.height - enemy.height);
            break;
    }
    
    enemies.push(enemy);
}

function spawnBonus() {
    const bonus = {
        x: Math.random() * (gameEngine.canvas.width - 20),
        y: Math.random() * (gameEngine.canvas.height - 20),
        width: 20,
        height: 20,
        color: '#00ff00',
        value: 10,
        pulseTimer: 0
    };
    
    bonuses.push(bonus);
}

function spawnBoss() {
    gameState.bossActive = true;
    
    boss = {
        x: gameEngine.canvas.width / 2 - 50,
        y: -100,
        width: 100,
        height: 100,
        health: 50 + gameState.level * 25,
        maxHealth: 50 + gameState.level * 25,
        speed: 1,
        damage: 25,
        color: '#ff0000',
        attackTimer: 0,
        phase: 1
    };
    
    // Boss music
    audioManager.playMusic('bossMusic');
    
    // Visual announcement
    vfxManager.addFlashEffect('#ff0000', 0.5, 1000);
    audioManager.playSound('bossWarning');
}

function defeatBoss() {
    // Award massive points
    const points = boss.maxHealth * 10;
    gameState.score += points;
    
    // Epic death explosion
    vfxManager.createExplosion(boss.x + boss.width/2, boss.y + boss.height/2, 3.0, '#ff4400');
    audioManager.playSound('explosion', 1.5, 0.8);
    
    // Screen effects
    vfxManager.addScreenShake(15, 800);
    vfxManager.addFlashEffect('#ffffff', 0.8, 600);
    
    boss = null;
    gameState.bossActive = false;
    
    // Return to normal music
    audioManager.playMusic('gameMusic1');
}

function levelUp() {
    gameState.level++;
    gameState.nextLevelScore += 100 + (gameState.level * 50);
    gameState.showUpgrade = true;
    gameState.paused = true;
    
    // Effects
    vfxManager.addFlashEffect('#00ff00', 0.4, 500);
    audioManager.playSound('levelUp');
    
    // Show upgrade menu
    document.getElementById('upgradeMenu').style.display = 'block';
    showCategorySelection();
}

function gameOver() {
    gameState.running = false;
    
    // Stop all audio
    if (audioManager.currentMusic) {
        audioManager.currentMusic.pause();
    }
    
    // Final score display
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameOver').style.display = 'block';
    
    // Play game over music
    audioManager.playMusic('menuMusic');
}

function togglePause() {
    gameState.paused = !gameState.paused;
    
    if (gameState.paused) {
        document.getElementById('pauseMenu').style.display = 'block';
        if (audioManager.currentMusic) {
            audioManager.currentMusic.pause();
        }
    } else {
        document.getElementById('pauseMenu').style.display = 'none';
        if (audioManager.currentMusic) {
            audioManager.currentMusic.play();
        }
    }
}

function updateDynamicMusic() {
    // Dynamic music system based on game state
    const enemyCount = enemies.length;
    const timeMinutes = gameState.gameTime / 60000;
    
    if (gameState.bossActive) return; // Boss music takes priority
    
    let targetMusic = 'gameMusic1';
    
    if (enemyCount > 10 || timeMinutes > 3) {
        targetMusic = Math.random() < 0.5 ? 'intenseMusic1' : 'intenseMusic2';
    } else {
        targetMusic = Math.random() < 0.5 ? 'gameMusic1' : 'gameMusic2';
    }
    
    if (audioManager.currentMusic?.src?.includes(targetMusic)) return;
    
    audioManager.playMusic(targetMusic, 2000);
}

// Drawing functions
function drawPlayer(ctx) {
    ctx.save();
    
    // Invulnerability flashing
    if (player.invulnerable) {
        ctx.globalAlpha = Math.sin(Date.now() * 0.02) * 0.5 + 0.5;
    }
    
    // Get current character image
    let imageName = player.direction + '_1';
    const isMoving = mouse.isMoving || Object.values(keys).some(k => k);
    
    if (isMoving) {
        const frameNumber = Math.floor(player.animationFrame * 0.2) % 2 + 1;
        if (player.direction === 'left') {
            imageName = frameNumber === 1 ? 'character_left' : 'character_left_2';
        } else {
            imageName = `character_${player.direction}_${frameNumber}`;
        }
    }
    
    const img = characterImages[imageName];
    if (img && img.complete) {
        ctx.drawImage(img, player.x, player.y, player.width, player.height);
    } else {
        // Fallback rendering
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    
    ctx.restore();
}

function drawBullets(ctx) {
    bullets.forEach(bullet => {
        ctx.save();
        
        // Draw trail
        if (bullet.trail && bullet.trail.length > 1) {
            ctx.strokeStyle = bullet.color;
            ctx.lineWidth = bullet.width * 0.5;
            ctx.lineCap = 'round';
            
            for (let i = 1; i < bullet.trail.length; i++) {
                ctx.globalAlpha = bullet.trail[i].alpha * 0.7;
                ctx.beginPath();
                ctx.moveTo(bullet.trail[i-1].x, bullet.trail[i-1].y);
                ctx.lineTo(bullet.trail[i].x, bullet.trail[i].y);
                ctx.stroke();
            }
        }
        
        // Draw bullet with glow
        ctx.globalAlpha = 1;
        ctx.fillStyle = bullet.color;
        ctx.shadowColor = bullet.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(bullet.x - bullet.width/2, bullet.y - bullet.height/2, bullet.width, bullet.height);
        
        ctx.restore();
    });
}

function drawEnemies(ctx) {
    enemies.forEach(enemy => {
        ctx.save();
        
        // Enemy image or fallback
        const img = errorImages[enemy.type];
        if (img && img.complete) {
            ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
        
        // Health bar for damaged enemies
        if (enemy.health < enemy.maxHealth) {
            const barWidth = enemy.width;
            const barHeight = 4;
            const barX = enemy.x;
            const barY = enemy.y - 8;
            
            // Background
            ctx.fillStyle = '#333333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Health
            const healthPercent = enemy.health / enemy.maxHealth;
            ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : '#ff0000';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
            
            // Border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
        
        ctx.restore();
    });
}

function drawBonuses(ctx) {
    bonuses.forEach(bonus => {
        ctx.save();
        
        const pulse = Math.sin(bonus.pulseTimer) * 0.3 + 1;
        const size = bonus.width * pulse;
        const offset = (size - bonus.width) / 2;
        
        ctx.fillStyle = bonus.color;
        ctx.shadowColor = bonus.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(bonus.x - offset, bonus.y - offset, size, size);
        
        // Plus symbol
        ctx.fillStyle = '#000000';
        ctx.font = '14px bold monospace';
        ctx.textAlign = 'center';
        ctx.fillText('+', bonus.x + bonus.width/2, bonus.y + bonus.height/2 + 5);
        
        ctx.restore();
    });
}

function drawBoss(ctx) {
    if (!boss) return;
    
    ctx.save();
    
    // Boss with special effects
    ctx.fillStyle = boss.color;
    ctx.shadowColor = boss.color;
    ctx.shadowBlur = 15;
    ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
    
    // Boss health bar (prominent)
    const barWidth = 300;
    const barHeight = 20;
    const barX = (gameEngine.canvas.width - barWidth) / 2;
    const barY = 20;
    
    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health
    const healthPercent = boss.health / boss.maxHealth;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Border and text
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px bold monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', barX + barWidth/2, barY - 5);
    ctx.fillText(`${boss.health}/${boss.maxHealth}`, barX + barWidth/2, barY + barHeight/2 + 4);
    
    ctx.restore();
}

function drawUI(ctx) {
    ctx.save();
    
    // Score display
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
    
    // Level and combo
    ctx.font = '16px monospace';
    ctx.fillText(`Level: ${gameState.level}`, 20, 55);
    if (gameState.combo > 1) {
        ctx.fillStyle = '#ffff00';
        ctx.fillText(`Combo: ${gameState.combo}x`, 20, 75);
    }
    
    // Health bar (bottom center)
    const barWidth = 200;
    const barHeight = 20;
    const barX = (gameEngine.canvas.width - barWidth) / 2;
    const barY = gameEngine.canvas.height - 50;
    
    // Health background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health fill
    const healthPercent = gameState.health / gameState.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Shield bar if applicable
    if (gameState.maxShield > 0) {
        const shieldY = barY - 25;
        const shieldPercent = gameState.shield / gameState.maxShield;
        
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, shieldY, barWidth, 15);
        
        ctx.fillStyle = '#4444ff';
        ctx.fillRect(barX, shieldY, barWidth * shieldPercent, 15);
        
        ctx.strokeStyle = '#4444ff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, shieldY, barWidth, 15);
    }
    
    // Health bar border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Health text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${gameState.health}/${gameState.maxHealth}`, barX + barWidth/2, barY + barHeight/2 + 4);
    
    // Weapon info (top right)
    const weapon = weaponSystem.getCurrentWeapon();
    ctx.textAlign = 'right';
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.fillText(`Weapon: ${weapon.name}`, gameEngine.canvas.width - 20, 30);
    
    // Controls hint
    ctx.textAlign = 'left';
    ctx.font = '12px monospace';
    ctx.fillStyle = '#888888';
    ctx.fillText('WASD: Directional Fire | Mouse: Move & Aim | Space: Fire | Shift: Dash | 1-4: Weapons', 20, gameEngine.canvas.height - 20);
    
    ctx.restore();
}

function drawDebugInfo(ctx) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    
    const metrics = gameEngine.performanceMetrics;
    const debugY = 100;
    
    ctx.fillText(`FPS: ${Math.round(metrics.avgFps)}`, 20, debugY);
    ctx.fillText(`Update: ${metrics.updateTime.toFixed(1)}ms`, 20, debugY + 15);
    ctx.fillText(`Render: ${metrics.renderTime.toFixed(1)}ms`, 20, debugY + 30);
    ctx.fillText(`Objects: ${metrics.totalObjects}`, 20, debugY + 45);
    ctx.fillText(`Enemies: ${enemies.length}`, 20, debugY + 60);
    ctx.fillText(`Bullets: ${bullets.length}`, 20, debugY + 75);
    
    ctx.restore();
}

// Helper functions
function getEnemyData(type) {
    const enemyTypes = {
        error1: { width: 25, height: 25, speed: 0.8, damage: 5, points: 3, maxHealth: 1, color: '#ff6666' },
        error2: { width: 30, height: 30, speed: 1.0, damage: 10, points: 7, maxHealth: 2, color: '#ff4444' },
        error3: { width: 35, height: 35, speed: 1.2, damage: 15, points: 12, maxHealth: 3, color: '#ff2222' },
        error4: { width: 40, height: 40, speed: 1.5, damage: 25, points: 20, maxHealth: 4, color: '#ff0000' }
    };
    
    return enemyTypes[type] || enemyTypes.error1;
}

// Upgrade system placeholders
function showCategorySelection() {
    document.getElementById('categorySelection').style.display = 'block';
    document.getElementById('upgradeSelection').style.display = 'none';
}

function showCategoryUpgrades(category) {
    // Implementation will be added in next phase
    console.log(`Showing upgrades for category: ${category}`);
}

function selectCategoryUpgrade(category, upgrade) {
    // Implementation will be added in next phase
    console.log(`Selected upgrade: ${category}.${upgrade}`);
}

function restartGame() {
    // Reset all game state
    gameState = {
        running: true,
        paused: false,
        score: 0,
        health: 100,
        maxHealth: 100,
        shield: 0,
        maxShield: 0,
        level: 1,
        nextLevelScore: 100,
        showUpgrade: false,
        gameTime: 0,
        combo: 0,
        maxCombo: 0,
        comboTimer: 0,
        bossActive: false,
        wave: 1
    };
    
    // Reset player
    player.x = gameEngine.canvas.width / 2 - player.width / 2;
    player.y = gameEngine.canvas.height / 2 - player.height / 2;
    player.invulnerable = false;
    player.invulnerabilityTime = 0;
    player.dashCooldown = 0;
    
    // Clear game objects
    bullets = [];
    enemies = [];
    bonuses = [];
    boss = null;
    
    // Reset timers
    enemySpawnTimer = 0;
    bonusSpawnTimer = 0;
    lastTime = Date.now();
    
    // Hide menus
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('upgradeMenu').style.display = 'none';
    document.getElementById('pauseMenu').style.display = 'none';
    
    // Start game music
    audioManager.playMusic('gameMusic1');
    
    // Resume game loop
    gameLoop();
}

function resumeGame() {
    gameState.paused = false;
    document.getElementById('pauseMenu').style.display = 'none';
    
    if (audioManager.currentMusic) {
        audioManager.currentMusic.play();
    }
}

function restartFromPause() {
    document.getElementById('pauseMenu').style.display = 'none';
    restartGame();
}

// =============================================================================
// GAME INITIALIZATION
// =============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

console.log('🎮 Code Slicer - Release Quality Edition Loaded');