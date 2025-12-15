// =============== CONFIGURAÇÕES INICIAIS ===============
const config = {
    snow: {
        count: 150,
        speed: 1,
        size: 3
    },
    tree: {
        x: 0.5,
        y: 0.7,
        size: 250
    },
    lights: {
        colors: ['#FF0000', '#00FF00', '#FFFFFF', '#FFD700', '#00CED1', '#FF69B4'],
        blinkSpeed: 500
    }
};

// =============== VARIÁVEIS GLOBAIS ===============
let snowflakes = [];
let ornaments = [];
let currentLightColorIndex = 0;
let isMusicPlaying = false;
let starClicked = false;
let animationId = null;

// =============== INICIALIZAÇÃO ===============
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎄 Cartão de Natal carregando...');
    
    // Inicializar sistemas
    initFotoSistema();
    initSnowCanvas();
    initTreeCanvas();
    initLuzes();
    setupEventListeners();
    startCountdown();
    animate();
    
    console.log('✅ Cartão de Natal carregado! Feliz Natal! ❤️');
});

// =============== SISTEMA DE FOTO ESPECIAL ===============
function initFotoSistema() {
    const fotoBtn = document.getElementById('fotoBtn');
    const fotoPopup = document.getElementById('fotoPopup');
    const fecharFotoBtn = document.getElementById('fecharFotoBtn');
    const fecharPopupBtn = document.querySelector('.fechar-popup-btn');
    
    if (!fotoBtn || !fotoPopup) {
        console.error('❌ Elementos da foto não encontrados!');
        return;
    }
    
    // Abrir popup da foto
    fotoBtn.addEventListener('click', function() {
        console.log('📸 Abrindo foto especial...');
        fotoPopup.classList.remove('hidden');
        createConfetti();
        playPhotoSound();
        
        // Efeito no botão
        this.style.transform = 'scale(0.9)';
        this.innerHTML = '<i class="fas fa-heart"></i> Nosso Amor!';
        this.style.background = 'linear-gradient(135deg, #FF69B4 0%, #C71585 100%)';
        
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-camera"></i> Nossa Foto Especial';
            this.style.background = 'linear-gradient(135deg, #FF69B4, #C71585)';
        }, 3000);
    });
    
    // Fechar com botão X (no canto)
    if (fecharPopupBtn) {
        fecharPopupBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fecharFoto();
        });
    }
    
    // Fechar com botão "Fechar ❤️"
    if (fecharFotoBtn) {
        fecharFotoBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fecharFoto();
        });
    }
    
    // Fechar clicando fora do conteúdo
    fotoPopup.addEventListener('click', function(e) {
        if (e.target === fotoPopup) {
            fecharFoto();
        }
    });
    
    // Fechar com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !fotoPopup.classList.contains('hidden')) {
            fecharFoto();
        }
    });
}

// Função para fechar a foto (global para ser acessada pelo onclick)
function fecharFoto() {
    const fotoPopup = document.getElementById('fotoPopup');
    if (fotoPopup) {
        console.log('📸 Fechando foto especial...');
        
        // Animação de fechamento
        const fotoContent = fotoPopup.querySelector('.foto-content');
        if (fotoContent) {
            fotoContent.style.animation = 'zoomOut 0.3s ease-out forwards';
        }
        
        setTimeout(() => {
            fotoPopup.classList.add('hidden');
            if (fotoContent) {
                fotoContent.style.animation = 'zoomIn 0.3s ease-out';
            }
        }, 300);
    }
}

function playPhotoSound() {
    try {
        if (typeof AudioContext !== 'undefined') {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Tocar acorde feliz
            [523.25, 659.25, 783.99].forEach((freq, i) => {
                setTimeout(() => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    
                    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                    
                    osc.start();
                    osc.stop(audioContext.currentTime + 0.3);
                }, i * 100);
            });
        }
    } catch (e) {
        console.log('🔇 Áudio da foto não disponível');
    }
}

// =============== NEVE ===============
function initSnowCanvas() {
    const canvas = document.getElementById('snowCanvas');
    if (!canvas) {
        console.error('❌ Canvas da neve não encontrado!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Criar flocos de neve
    for (let i = 0; i < config.snow.count; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * config.snow.size + 1,
            speed: Math.random() * config.snow.speed + 0.5,
            opacity: Math.random() * 0.5 + 0.5,
            sway: Math.random() * 0.5 - 0.25
        });
    }
    
    window.drawSnow = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (const flake of snowflakes) {
            flake.y += flake.speed;
            flake.x += flake.sway;
            
            if (flake.y > canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * canvas.width;
            }
            
            if (flake.x > canvas.width) flake.x = 0;
            if (flake.x < 0) flake.x = canvas.width;
            
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    };
}

// =============== LUZES DE NATAL ===============
function initLuzes() {
    const container = document.getElementById('luzesContainer');
    if (!container) {
        console.error('❌ Container de luzes não encontrado!');
        return;
    }
    
    container.innerHTML = '';
    
    // Criar 25 luzes
    for (let i = 0; i < 25; i++) {
        const luz = document.createElement('div');
        const corIndex = i % config.lights.colors.length;
        const corClass = getCorClass(config.lights.colors[corIndex]);
        
        luz.className = `luz-natal ${corClass}`;
        
        // Posição em formato de árvore
        const angulo = (i / 25) * Math.PI * 2;
        const distancia = 120 + Math.random() * 80;
        const x = 50 + Math.cos(angulo) * distancia;
        const y = 40 + Math.sin(angulo) * distancia + i * 2;
        
        luz.style.left = `${x}%`;
        luz.style.top = `${y}%`;
        luz.style.animationDelay = `${Math.random() * 2}s`;
        luz.style.animationDuration = `${1 + Math.random()}s`;
        
        container.appendChild(luz);
    }
    
    console.log('💡 Luzes criadas!');
}

function getCorClass(corHex) {
    const cores = {
        '#FF0000': 'luz-vermelha',
        '#00FF00': 'luz-verde',
        '#FFFFFF': 'luz-branca',
        '#FFD700': 'luz-dourada',
        '#00CED1': 'luz-azul',
        '#FF69B4': 'luz-rosa'
    };
    return cores[corHex] || 'luz-branca';
}

// =============== ÁRVORE DE NATAL ===============
function initTreeCanvas() {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas) {
        console.error('❌ Canvas da árvore não encontrado!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        if (window.drawTree) drawTree();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Função para desenhar estrela
    function drawStar(ctx, cx, cy, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        let rotation = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rotation) * outerRadius;
            y = cy + Math.sin(rotation) * outerRadius;
            ctx.lineTo(x, y);
            rotation += step;
            
            x = cx + Math.cos(rotation) * innerRadius;
            y = cy + Math.sin(rotation) * innerRadius;
            ctx.lineTo(x, y);
            rotation += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        
        // Gradiente para a estrela
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Contorno
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Brilho
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Guardar posição da estrela
        window.starPosition = { 
            cx: cx, 
            cy: cy, 
            radius: outerRadius + 5
        };
    }
    
    // Função principal para desenhar a árvore
    window.drawTree = function() {
        if (!canvas || !ctx) return;
        
        const centerX = canvas.width * config.tree.x;
        const baseY = canvas.height * config.tree.y;
        const treeHeight = Math.min(config.tree.size, canvas.height * 0.5);
        const treeWidth = treeHeight * 0.6;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Tronco
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(centerX - 15, baseY, 30, 50);
        
        // Camadas da árvore
        const layers = 4;
        for (let i = 0; i < layers; i++) {
            const layerHeight = treeHeight / layers;
            const layerY = baseY - (i * layerHeight);
            const layerWidth = treeWidth * (1 - i * 0.2);
            
            ctx.fillStyle = i % 2 === 0 ? '#228B22' : '#006400';
            ctx.beginPath();
            ctx.moveTo(centerX, layerY - layerHeight);
            ctx.lineTo(centerX - layerWidth/2, layerY);
            ctx.lineTo(centerX + layerWidth/2, layerY);
            ctx.closePath();
            ctx.fill();
            
            // Efeito de neve nas bordas
            if (i === 0 || i === 2) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 3]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
        
        // Estrela no topo
        const starY = baseY - treeHeight - 5;
        drawStar(ctx, centerX, starY, 20);
        
        // Desenhar enfeites
        drawOrnaments(ctx);
        
        // Desenhar presentes
        drawPresents(ctx, centerX, baseY + 40);
    };
    
    // Desenhar enfeites
    function drawOrnaments(ctx) {
        for (const ornament of ornaments) {
            ctx.beginPath();
            ctx.arc(ornament.x, ornament.y, ornament.radius, 0, Math.PI * 2);
            
            const gradient = ctx.createRadialGradient(
                ornament.x - 3, ornament.y - 3, 0,
                ornament.x, ornament.y, ornament.radius
            );
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(1, ornament.color);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Brilho
            ctx.shadowColor = ornament.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Gancho no topo
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(ornament.x - 2, ornament.y - ornament.radius - 3, 4, 6);
        }
    }
    
    // Desenhar presentes
    function drawPresents(ctx, centerX, baseY) {
        const presents = [
            { x: centerX - 60, y: baseY, width: 50, height: 35, color: '#C41E3A', ribbon: '#FFFFFF' },
            { x: centerX - 5, y: baseY, width: 55, height: 40, color: '#228B22', ribbon: '#FFD700' },
            { x: centerX + 50, y: baseY, width: 45, height: 50, color: '#1E90FF', ribbon: '#FFFFFF' }
        ];
        
        for (const present of presents) {
            // Caixa
            ctx.fillStyle = present.color;
            ctx.fillRect(present.x, present.y, present.width, present.height);
            
            // Fita
            ctx.fillStyle = present.ribbon;
            ctx.fillRect(present.x + present.width/2 - 3, present.y, 6, present.height);
            ctx.fillRect(present.x, present.y + present.height/2 - 3, present.width, 6);
            
            // Laço
            ctx.beginPath();
            ctx.arc(present.x + present.width/2, present.y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Adicionar evento de clique na árvore
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Verificar clique na estrela
        if (window.starPosition) {
            const distance = Math.sqrt(
                Math.pow(x - window.starPosition.cx, 2) + 
                Math.pow(y - window.starPosition.cy, 2)
            );
            
            if (distance < window.starPosition.radius && !starClicked) {
                starClicked = true;
                revealSecretMessage();
                return;
            }
        }
        
        // Adicionar enfeite onde clicar
        const centerX = canvas.width * config.tree.x;
        const baseY = canvas.height * config.tree.y;
        const treeHeight = config.tree.size;
        const treeWidth = treeHeight * 0.6;
        
        const inTreeArea = (
            y < baseY && 
            y > baseY - treeHeight && 
            x > centerX - treeWidth/2 && 
            x < centerX + treeWidth/2
        );
        
        if (inTreeArea) {
            ornaments.push({
                x: x,
                y: y,
                radius: 8 + Math.random() * 6,
                color: config.lights.colors[Math.floor(Math.random() * config.lights.colors.length)]
            });
            
            drawTree();
            playOrnamentSound();
        }
    });
    
    // Desenhar árvore inicial
    drawTree();
}

// =============== FUNÇÕES DE INTERAÇÃO ===============
function setupEventListeners() {
    // Botão para trocar luzes
    const changeLightsBtn = document.getElementById('changeLights');
    if (changeLightsBtn) {
        changeLightsBtn.addEventListener('click', function() {
            currentLightColorIndex = (currentLightColorIndex + 1) % config.lights.colors.length;
            
            // Rotacionar cores
            const temp = config.lights.colors[0];
            config.lights.colors[0] = config.lights.colors[currentLightColorIndex];
            config.lights.colors[currentLightColorIndex] = temp;
            
            initLuzes();
            
            this.style.transform = 'scale(0.9)';
            setTimeout(() => this.style.transform = '', 200);
            
            mostrarMensagemTemporaria('💡 Cores das luzes trocadas!');
        });
    }
    
    // Botão para adicionar enfeite
    const addOrnamentBtn = document.getElementById('addOrnament');
    if (addOrnamentBtn) {
        addOrnamentBtn.addEventListener('click', function() {
            const canvas = document.getElementById('treeCanvas');
            if (!canvas) return;
            
            const centerX = canvas.width * config.tree.x;
            const baseY = canvas.height * config.tree.y;
            const treeHeight = config.tree.size;
            const treeWidth = treeHeight * 0.6;
            
            const x = centerX + (Math.random() - 0.5) * treeWidth * 0.8;
            const y = baseY - treeHeight + Math.random() * treeHeight * 0.8;
            
            ornaments.push({
                x: x,
                y: y,
                radius: 10 + Math.random() * 8,
                color: config.lights.colors[Math.floor(Math.random() * config.lights.colors.length)]
            });
            
            if (window.drawTree) drawTree();
            playOrnamentSound();
            
            mostrarMensagemTemporaria('🎁 Enfeite adicionado!');
        });
    }
    
    // Botão de surpresa
    const surpriseBtn = document.getElementById('surpriseBtn');
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', function() {
            createConfetti();
            
            const message = document.getElementById('secretMessage');
            if (message) {
                const messages = [
                    "Você é o melhor presente que eu poderia ter! ❤️",
                    "Meu melhor amigo sempre",
                    "Cada dia com você é especial!",
                    "Você é meu porto seguro, e a melhor coisa que já aconteceu em minha vida...",
                    "Te amo mais que tudo neste mundo. Feliz Natal! ⭐"
                ];
                
                message.textContent = messages[Math.floor(Math.random() * messages.length)];
                message.style.animation = 'float 1s ease';
                setTimeout(() => message.style.animation = '', 1000);
            }
            
            // Efeito no botão
            this.innerHTML = '<i class="fas fa-heart"></i> Você é Incrível!';
            this.style.background = 'linear-gradient(135deg, #FF69B4 0%, #C71585 100%)';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-gift"></i> Surpresa Especial!';
                this.style.background = '';
            }, 3000);
        });
    }
    
    // Controle de música
    const musicBtn = document.getElementById('musicToggle');
    const music = document.getElementById('backgroundMusic');
    
    if (musicBtn && music) {
        musicBtn.addEventListener('click', function() {
            if (isMusicPlaying) {
                music.pause();
                musicBtn.innerHTML = '<i class="fas fa-play"></i> Tocar Música';
            } else {
                music.play().catch(e => {
                    console.log('Reprodução automática bloqueada');
                    musicBtn.innerHTML = '<i class="fas fa-play"></i> Clique para tocar';
                });
                musicBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar Música';
            }
            isMusicPlaying = !isMusicPlaying;
            musicBtn.style.transform = 'scale(0.95)';
            setTimeout(() => musicBtn.style.transform = '', 150);
        });
    }
    
    // Easter egg para devs
    const devEggBtn = document.getElementById('devEgg');
    if (devEggBtn) {
        devEggBtn.addEventListener('click', function() {
            const codeOutput = document.getElementById('codeOutput');
            if (codeOutput) {
                codeOutput.classList.toggle('hidden');
                this.innerHTML = codeOutput.classList.contains('hidden') 
                    ? '<i class="fas fa-terminal"></i> Modo Dev'
                    : '<i class="fas fa-times"></i> Fechar Código';
            }
        });
    }
}

// =============== CONTADOR REGRESSIVO ===============
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const christmas = new Date(now.getFullYear(), 11, 25);
        
        if (now > christmas) {
            christmas.setFullYear(christmas.getFullYear() + 1);
        }
        
        const diff = christmas - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        const countdownEl = document.querySelector('.countdown');
        if (countdownEl && days === 0 && hours < 6) {
            countdownEl.style.background = 'rgba(255, 215, 0, 0.2)';
            countdownEl.style.borderColor = 'rgba(255, 215, 0, 0.5)';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// =============== EFEITOS ESPECIAIS ===============
function revealSecretMessage() {
    const message = document.getElementById('secretMessage');
    if (message) {
        message.innerHTML = `
            <span style="color:#FFD700">✨ MENSAGEM SECRETA ✨</span><br><br>
            Meu amor, você é a estrela mais brilhante da minha vida!<br>
            Que nosso amor seja eterno como o Natal no coração.<br>
            <span style="color:#FF69B4">Te amo mais que tudo! ❤️</span><br><br>
            <small>Você merece todo o amor do mundo!</small>
        `;
        
        message.parentElement.style.background = 'rgba(255, 215, 0, 0.1)';
        message.parentElement.style.border = '2px solid #FFD700';
        
        createStarParticles();
    }
}

function createConfetti() {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 8 + 3;
            const color = config.lights.colors[Math.floor(Math.random() * config.lights.colors.length)];
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            setTimeout(() => {
                ctx.clearRect(x - size - 2, y - size - 2, size * 2 + 4, size * 2 + 4);
                if (window.drawTree) drawTree();
            }, 800);
        }, i * 30);
    }
}

function createStarParticles() {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas || !window.starPosition) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = window.starPosition.cx;
    const centerY = window.starPosition.cy;
    
    for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const speed = 1.5 + Math.random() * 2;
        const size = 2 + Math.random() * 3;
        const color = config.lights.colors[i % config.lights.colors.length];
        
        let x = centerX;
        let y = centerY;
        
        const particle = setInterval(() => {
            ctx.clearRect(x - size - 1, y - size - 1, size * 2 + 2, size * 2 + 2);
            
            x += Math.cos(angle) * speed;
            y += Math.sin(angle) * speed;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
                clearInterval(particle);
                ctx.clearRect(x - size - 1, y - size - 1, size * 2 + 2, size * 2 + 2);
                if (window.drawTree) drawTree();
            }
        }, 20);
    }
}

function playOrnamentSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600 + Math.random() * 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('🔇 Áudio não disponível');
    }
}

// =============== ANIMAÇÃO PRINCIPAL ===============
function animate() {
    if (window.drawSnow) drawSnow();
    if (window.drawTree) drawTree();
    
    animationId = requestAnimationFrame(animate);
}

// =============== FUNÇÕES AUXILIARES ===============
function mostrarMensagemTemporaria(texto) {
    const msgAnterior = document.getElementById('msgTemp');
    if (msgAnterior) msgAnterior.remove();
    
    const mensagem = document.createElement('div');
    mensagem.id = 'msgTemp';
    mensagem.textContent = texto;
    mensagem.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: #FFD700;
        padding: 10px 20px;
        border-radius: 10px;
        border: 2px solid #FFD700;
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.3s ease-out, slideOut 0.3s ease-out 1.7s;
    `;
    
    document.body.appendChild(mensagem);
    
    setTimeout(() => {
        if (mensagem.parentNode) mensagem.remove();
    }, 2000);
}

// =============== INICIALIZAÇÃO FINAL ===============
window.addEventListener('load', function() {
    console.log('🚀 Inicialização final...');
    
    const snowCanvas = document.getElementById('snowCanvas');
    const treeCanvas = document.getElementById('treeCanvas');
    
    if (snowCanvas && treeCanvas) {
        const container = snowCanvas.parentElement;
        snowCanvas.width = container.clientWidth;
        snowCanvas.height = container.clientHeight;
        
        treeCanvas.width = container.clientWidth;
        treeCanvas.height = container.clientHeight;
        
        if (window.drawTree) drawTree();
    }
    
    console.log('%c🎄 FELIZ NATAL! ❤️', 'color: #FFD700; font-size: 20px; font-weight: bold;');
    console.log('%cCartão de Natal Interativo', 'color: #00CED1; font-size: 14px;');
});

// Parar animação ao sair
window.addEventListener('beforeunload', function() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});