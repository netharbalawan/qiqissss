document.addEventListener('DOMContentLoaded', () => {

    /* ========== ELEMENTS ========== */
    const landingPage = document.getElementById('landing-page');
    const mainPage = document.getElementById('main-page');
    const openBtn = document.getElementById('open-btn');
    const landingTitle = document.getElementById('landing-title');
    const landingBurstContainer = document.getElementById('landing-burst');
    const backBtn = document.getElementById('back-btn');
    const bgMusic = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const visualizer = document.getElementById('visualizer');
    const typingMessage = document.getElementById('typing-message');
    const closingMessage = document.getElementById('closing-message');
    const landingHearts = document.getElementById('landing-hearts');
    const mainHearts = document.getElementById('main-hearts');
    const sparklesContainer = document.getElementById('sparkles');
    const trailCanvas = document.getElementById('trail-canvas');
    const ctx = trailCanvas.getContext('2d');
    const bigHeartContainer = document.querySelector('.big-heart-container');
    const bgLoveLayer = document.getElementById('bg-love-layer');
    const cuteAnimalsContainer = document.getElementById('cute-animals');

    // TEKS UNTUK ADIK QIQIS
    const messageText = "Terima kasih banyak ya, Adik Qiqis, sudah jadi teman PKL yang seru dan sangat menyenangkan. Makasih juga udah sering bantuin aku selama di IKD, terutama nemenin ngopi bareng dan ngobrol seru di sela-sela waktu. Jujur, aku bakal kangen banget sama momen-momen santai kita. Semoga segala hal baik selalu menyertai kamu, dilancarkan semua urusannya, dan sukses terus ke depannya! Jangan lupa tetap semangat ya.";

    /* ========== CANVAS RESIZE ========== */
    function resizeCanvas() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* ========== CURSOR TRAIL HEARTS (UNGU) ========== */
    const trailParticles = [];
    const heartChars = ['♡', '♥', '❤', '💕', '💗'];

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 14 + 8;
            this.char = heartChars[Math.floor(Math.random() * heartChars.length)];
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.015;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5 - 0.5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.1;
            // Hue diubah ke area ungu (270-290)
            this.color = `hsla(${270 + Math.random() * 20}, 100%, ${70 + Math.random() * 15}%, `;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy -= 0.02;
            this.life -= this.decay;
            this.rotation += this.rotSpeed;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color + Math.max(0, this.life) + ')';
            ctx.font = `${this.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.char, 0, 0);
            ctx.restore();
        }
    }

    let lastMouseX = 0, lastMouseY = 0;

    function spawnTrail(x, y) {
        const dist = Math.hypot(x - lastMouseX, y - lastMouseY);
        if (dist > 8) {
            trailParticles.push(new TrailParticle(x, y));
            lastMouseX = x;
            lastMouseY = y;
        }
    }

    document.addEventListener('mousemove', (e) => spawnTrail(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            spawnTrail(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    function animateTrail() {
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i];
            p.update();
            p.draw();
            if (p.life <= 0) trailParticles.splice(i, 1);
        }
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    /* ========== FLOATING HEARTS GENERATOR (UNGU) ========== */
    function createFloatingHeart(container, isSpin = false) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        if (isSpin) heart.classList.add('spin');
        const hearts = ['♡', '♥', '❤', '💕', '💗', '💖'];
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-10%';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 8 + 7) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.3;

        // Array warna diubah ke palet ungu
        const colors = ['#9b51e0', '#c9a0f0', '#b388eb', '#d1b3ff', '#e6d3f8'];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(heart);

        const duration = (parseFloat(heart.style.animationDuration) + parseFloat(heart.style.animationDelay)) * 1000;
        setTimeout(() => { if (heart.parentNode) heart.remove(); }, duration);
    }

    function startHearts(container, count, interval, spin = false) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => createFloatingHeart(container, spin), i * 300);
        }
        return setInterval(() => createFloatingHeart(container, spin), interval);
    }

    const landingInterval = startHearts(landingHearts, 10, 900, false);
    
    const landingSpinInterval = setInterval(() => {
        if (landingPage.classList.contains('active')) {
            createFloatingHeart(landingHearts, true);
        }
    }, 600);

    /* ========== SPARKLE GENERATOR ========== */
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.width = sparkle.style.height = (Math.random() * 6 + 3) + 'px';
        sparkle.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
        sparklesContainer.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 3000);
    }

    let sparkleInterval = null;

    /* ========== BACKGROUND LOVE GENERATOR ========== */
    function createBgLove() {
        const love = document.createElement('div');
        love.classList.add('bg-love-icon');
        love.innerHTML = ['♡', '♥', '💖', '💕'][Math.floor(Math.random() * 4)];
        love.style.left = Math.random() * 100 + '%';
        love.style.animationDuration = (Math.random() * 4 + 4) + 's';
        love.style.fontSize = (Math.random() * 20 + 15) + 'px';
        bgLoveLayer.appendChild(love);
        setTimeout(() => love.remove(), 8000);
    }

    /* ========== ANIMASI BINATANG LUCU (GERAK BEBAS) ========== */
    const animals = ['🐈', '🐇', '🐻', '🐶', '🦊', '🐼'];
    
    function createWalkingAnimal() {
        const animal = document.createElement('div');
        animal.classList.add('cute-animal');
        animal.textContent = animals[Math.floor(Math.random() * animals.length)];
        
        let x = Math.random() * (window.innerWidth - 50);
        let y = Math.random() * (window.innerHeight - 50);
        
        animal.style.left = x + 'px';
        animal.style.top = y + 'px';
        
        cuteAnimalsContainer.appendChild(animal);

        let speedX = (Math.random() - 0.5) * 2; 
        let speedY = (Math.random() - 0.5) * 2; 
        
        let animationFrameId;
        let changeDirectionTimeout;

        function moveAnimal() {
            x += speedX;
            y += speedY;

            if (x <= 0 || x >= window.innerWidth - 50) {
                speedX *= -1; 
                x = Math.max(0, Math.min(x, window.innerWidth - 50));
            }
            if (y <= 0 || y >= window.innerHeight - 50) {
                speedY *= -1;
                y = Math.max(0, Math.min(y, window.innerHeight - 50));
            }

            animal.style.left = x + 'px';
            animal.style.top = y + 'px';
            
            if (speedX > 0) {
                animal.style.transform = 'scaleX(1)';
            } else {
                animal.style.transform = 'scaleX(-1)';
            }

            animationFrameId = requestAnimationFrame(moveAnimal);
        }

        moveAnimal();

        function changeDirection() {
            speedX = (Math.random() - 0.5) * 2;
            speedY = (Math.random() - 0.5) * 2;
            changeDirectionTimeout = setTimeout(changeDirection, Math.random() * 2000 + 2000);
        }
        changeDirection();

        setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(changeDirectionTimeout);
            if (animal.parentNode) animal.remove();
        }, 15000); 
    }

    /* ========== MODERN LOVE BURST EFFECT (MAIN PAGE) ========== */
    function createLoveBurst() {
        const numberOfHearts = 14;
        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement('span');
            heart.classList.add('burst-heart');
            heart.textContent = '♥';
            
            const angle = (Math.PI * 2 * i) / numberOfHearts;
            const distance = Math.random() * 70 + 80;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            const size = Math.random() * 1.2 + 1.2;
            heart.style.fontSize = `${size}rem`;
            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            
            heart.style.animationDelay = `${Math.random() * 0.2}s`;
            
            bigHeartContainer.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) heart.remove();
            }, 2000);
        }
    }

    let burstInterval = null;

    /* ========== LANDING PAGE BURST (INTERAKTIF) ========== */
    function createLandingBurst(x, y) {
        const numberOfHearts = 8;
        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement('span');
            heart.textContent = '♥';
            
            heart.style.position = 'absolute';
            heart.style.color = 'var(--hot-pink)'; // Mengikuti warna ungu dari CSS
            heart.style.fontSize = (Math.random() * 1 + 1) + 'rem';
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '100';
            
            const angle = (Math.PI * 2 * i) / numberOfHearts;
            const distance = Math.random() * 60 + 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            heart.style.animation = `burstOut 1s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
            heart.style.transform = `translate(-50%, -50%)`; 
            
            landingBurstContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 1000);
        }
    }

    openBtn.addEventListener('mouseenter', () => {
        const rect = openBtn.getBoundingClientRect();
        createLandingBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });

    landingTitle.addEventListener('click', (e) => {
        createLandingBurst(e.clientX, e.clientY);
    });

    /* ========== TYPING EFFECT (ANTI-NGACO) ========== */
    let typingTimeout = null;

    function typeText(text, element, speed = 25, callback) {
        if (typingTimeout) clearTimeout(typingTimeout);
        
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent = text.substring(0, i + 1);
                i++;
                typingTimeout = setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    /* ========== PAGE TRANSITIONS ========== */
    function goToMainPage() {
        if (openBtn.disabled) return;
        openBtn.disabled = true;
        
        landingPage.classList.remove('active');
        
        setTimeout(() => {
            mainPage.classList.add('active');
            
            playMusic();

            startHearts(mainHearts, 20, 500, true);
            window._mainHeartsInterval = setInterval(() => createFloatingHeart(mainHearts, true), 700);

            sparkleInterval = setInterval(createSparkle, 400);
            for (let i = 0; i < 8; i++) setTimeout(createSparkle, i * 150);

            window._bgLoveInterval = setInterval(createBgLove, 300);
            window._animalInterval = setInterval(createWalkingAnimal, 4000);
            createWalkingAnimal();

            typingMessage.textContent = '';
            closingMessage.textContent = '';
            closingMessage.classList.remove('show');

            setTimeout(() => {
                typeText(messageText, typingMessage, 25, () => {
                    closingMessage.textContent = "Stay Happy & Keep Smiling! ♡";
                    closingMessage.classList.add('show');
                });
            }, 600);

            createLoveBurst();
            burstInterval = setInterval(createLoveBurst, 3000);
            
        }, 400);

        clearInterval(landingInterval);
    }

    function goToLandingPage() {
        mainPage.classList.remove('active');
        
        setTimeout(() => {
            landingPage.classList.add('active');
            openBtn.disabled = false;
            
            clearInterval(window._mainHeartsInterval);
            clearInterval(sparkleInterval);
            clearInterval(burstInterval);
            clearInterval(window._bgLoveInterval);
            clearInterval(window._animalInterval);
            clearTimeout(typingTimeout);
            
            bgMusic.pause();
            updateMusicUI(false);
            
            typingMessage.textContent = '';
            closingMessage.textContent = '';
            closingMessage.classList.remove('show');
            
            document.querySelectorAll('.burst-heart').forEach(el => el.remove());
            document.querySelectorAll('.bg-love-icon').forEach(el => el.remove());
            document.querySelectorAll('.cute-animal').forEach(el => el.remove());
            
            if (!landingHearts.hasChildNodes()) {
                startHearts(landingHearts, 10, 900, false);
            }
        }, 400);
    }

    openBtn.addEventListener('click', goToMainPage);
    backBtn.addEventListener('click', goToLandingPage);

    function playMusic() {
        bgMusic.volume = 0.6;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updateMusicUI(true);
            }).catch(() => {
                updateMusicUI(false);
            });
        }
    }

    function updateMusicUI(isPlaying) {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            visualizer.classList.add('playing');
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            visualizer.classList.remove('playing');
        }
    }

    playPauseBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => updateMusicUI(true)).catch(() => {});
        } else {
            bgMusic.pause();
            updateMusicUI(false);
        }
    });

    bgMusic.addEventListener('play', () => updateMusicUI(true));
    bgMusic.addEventListener('pause', () => updateMusicUI(false));

    window.addEventListener('beforeunload', () => {
        if (window._mainHeartsInterval) clearInterval(window._mainHeartsInterval);
        if (sparkleInterval) clearInterval(sparkleInterval);
        if (burstInterval) clearInterval(burstInterval);
        if (window._bgLoveInterval) clearInterval(window._bgLoveInterval);
        if (window._animalInterval) clearInterval(window._animalInterval);
        if (typingTimeout) clearTimeout(typingTimeout);
        bgMusic.pause();
    });

    document.addEventListener('touchstart', (e) => {
        if (mainPage.classList.contains('active')) {
            for (let i = 0; i < 3; i++) {
                setTimeout(createSparkle, i * 100);
            }
        }
    }, { passive: true });
});
