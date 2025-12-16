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
        colors: [
            { hex: '#FF0000', name: 'red' },
            { hex: '#00FF00', name: 'green' },
            { hex: '#FFFFFF', name: 'white' },
            { hex: '#FFD700', name: 'gold' },
            { hex: '#00CED1', name: 'blue' },
            { hex: '#FF69B4', name: 'pink' }
        ],
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
let starPosition = null;

// Variáveis para Álbum de Fotos - AGORA COM 4 FOTOS
let fotoAtualIndex = 0;
const fotosAlbum = [
    {
        src: 'itens_importantes/nossa-foto.jpg',
        descricao: 'Você me apoia sempre que pode, cada momento desses, me faz te amar ainda mais ❤️',
        legenda: 'Cada momento com você é especial. Te amo mais que tudo! 🥰'
    },
    {
        src: 'itens_importantes/foto2.jpeg',
        descricao: 'Ás vezes eu olho nós dois juntos e entendo porque as pessoas diziam que ficariamos juntos! 😄',
        legenda: 'Seu sorriso é o que mais amo neste mundo! 💖'
    },
    {
        src: 'itens_importantes/foto3.jpeg',
        descricao: 'Nosso amor cheio de cumplicidade e carinho! 👫',
        legenda: 'Você é meu porto seguro e minha maior alegria! 🌟'
    },
    {
        src: 'itens_importantes/foto4.jpeg',
        descricao: 'Mais um momento especial do nosso amor! 💕',
        legenda: 'Cada instante ao seu lado é mágico e inesquecível! ✨'
    }
];

// Variáveis para Jogos
let presentesEncontrados = 0;
let jogoAtivo = false;
let cartasMemoria = [];
let cartaVirada = null;
let paresEncontrados = 0;
let pontosMemoria = 0;

// =============== INICIALIZAÇÃO ===============
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎄 Cartão de Natal carregando...');
    
    // Inicializar sistemas
    initFotoSistema();
    initSnowCanvas();
    initTreeCanvas();
    setupEventListeners();
    iniciarJogos();
    startCountdown();
    animate();
    
    // Aguardar a árvore ser desenhada antes de criar as luzes
    setTimeout(() => {
        initLuzes();
    }, 500);
    
    // Verificar inicialização
    setTimeout(() => {
        console.log('✅ Cartão de Natal carregado! Feliz Natal! ❤️');
        console.log('💡 Luzes criadas:', document.querySelectorAll('.luz-natal').length);
        console.log('❄️ Flocos de neve:', snowflakes.length);
        console.log('📸 Álbum com fotos:', fotosAlbum.length);
    }, 1000);
});

// =============== SISTEMA DE ÁLBUM DE FOTOS ===============
function initFotoSistema() {
    const fotoBtn = document.getElementById('fotoBtn');
    const fotoPopup = document.getElementById('fotoPopup');
    const fecharPopupBtn = document.querySelector('.fechar-popup-btn');
    const closePhotoBtn = document.getElementById('closePhotoBtn');
    const prevFotoBtn = document.getElementById('prevFoto');
    const nextFotoBtn = document.getElementById('nextFoto');
    
    if (!fotoBtn || !fotoPopup) {
        console.error('❌ Elementos do álbum não encontrados!');
        return;
    }
    
    // Abrir popup do álbum
    fotoBtn.addEventListener('click', function() {
        console.log('📸 Abrindo álbum de fotos...');
        fotoPopup.classList.remove('hidden');
        playPhotoSound();
        atualizarAlbum();
        
        // Efeito no botão
        this.style.transform = 'scale(0.9)';
        this.innerHTML = '<i class="fas fa-heart"></i> Nosso Amor!';
        this.style.background = 'linear-gradient(135deg, #FF69B4 0%, #C71585 100%)';
        
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-camera"></i> Nosso Álbum';
            this.style.background = 'linear-gradient(135deg, #FF69B4, #C71585)';
        }, 3000);
    });
    
    // Navegação do álbum
    if (prevFotoBtn) {
        prevFotoBtn.addEventListener('click', function() {
            fotoAtualIndex = (fotoAtualIndex - 1 + fotosAlbum.length) % fotosAlbum.length;
            atualizarAlbum();
        });
    }
    
    if (nextFotoBtn) {
        nextFotoBtn.addEventListener('click', function() {
            fotoAtualIndex = (fotoAtualIndex + 1) % fotosAlbum.length;
            atualizarAlbum();
        });
    }
    
    // Miniaturas
    document.querySelectorAll('.miniatura').forEach((miniatura, index) => {
        miniatura.addEventListener('click', function() {
            fotoAtualIndex = parseInt(this.getAttribute('data-index'));
            atualizarAlbum();
        });
    });
    
    // Fechar com botão X (no canto)
    if (fecharPopupBtn) {
        fecharPopupBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fecharFoto();
        });
    }
    
    // Fechar com botão "Fechar ❤️"
    if (closePhotoBtn) {
        closePhotoBtn.addEventListener('click', function(e) {
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
    
    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (!fotoPopup.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') {
                fotoAtualIndex = (fotoAtualIndex - 1 + fotosAlbum.length) % fotosAlbum.length;
                atualizarAlbum();
            } else if (e.key === 'ArrowRight') {
                fotoAtualIndex = (fotoAtualIndex + 1) % fotosAlbum.length;
                atualizarAlbum();
            }
        }
    });
}

function atualizarAlbum() {
    const fotoAtual = fotosAlbum[fotoAtualIndex];
    
    // Atualizar imagem
    const fotoImagem = document.getElementById('fotoImagem');
    if (fotoImagem) {
        fotoImagem.src = fotoAtual.src;
        fotoImagem.alt = fotoAtual.descricao;
    }
    
    // Atualizar descrição
    const descricaoFoto = document.getElementById('descricaoFoto');
    if (descricaoFoto) {
        descricaoFoto.textContent = fotoAtual.descricao;
    }
    
    // Atualizar legenda
    const legendaFoto = document.getElementById('legendaFoto');
    if (legendaFoto) {
        legendaFoto.textContent = fotoAtual.legenda;
    }
    
    // Atualizar contador
    const fotoAtualElement = document.getElementById('fotoAtual');
    const totalFotosElement = document.getElementById('totalFotos');
    if (fotoAtualElement) fotoAtualElement.textContent = fotoAtualIndex + 1;
    if (totalFotosElement) totalFotosElement.textContent = fotosAlbum.length;
    
    // Atualizar miniaturas ativas
    document.querySelectorAll('.miniatura').forEach((miniatura, index) => {
        if (index === fotoAtualIndex) {
            miniatura.classList.add('active');
        } else {
            miniatura.classList.remove('active');
        }
    });
    
    console.log(`📸 Foto ${fotoAtualIndex + 1}/${fotosAlbum.length} exibida`);
}

function fecharFoto() {
    const fotoPopup = document.getElementById('fotoPopup');
    if (fotoPopup) {
        console.log('📸 Fechando álbum de fotos...');
        fotoPopup.classList.add('hidden');
    }
}

function playPhotoSound() {
    try {
        // Criar um som simples
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // Nota C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('🔇 Áudio da foto não disponível');
    }
}

// =============== JOGOS INTERATIVOS ===============
function iniciarJogos() {
    // Jogo 1: Encontrar Presentes
    const iniciarJogoPresentesBtn = document.getElementById('iniciarJogoPresentes');
    if (iniciarJogoPresentesBtn) {
        iniciarJogoPresentesBtn.addEventListener('click', iniciarJogoPresentes);
    }
    
    // Jogo 2: Memória
    const iniciarJogoMemoriaBtn = document.getElementById('iniciarJogoMemoria');
    if (iniciarJogoMemoriaBtn) {
        iniciarJogoMemoriaBtn.addEventListener('click', iniciarJogoMemoria);
    }
    
    // Iniciar jogo de memória automaticamente
    setTimeout(() => {
        iniciarJogoMemoria();
    }, 2000);
}

// Jogo 1: Encontrar Presentes
function iniciarJogoPresentes() {
    if (jogoAtivo) return;
    
    jogoAtivo = true;
    presentesEncontrados = 0;
    atualizarContadorPresentes();
    
    const areaJogo = document.getElementById('areaJogo');
    if (!areaJogo) return;
    
    areaJogo.innerHTML = '';
    areaJogo.style.minHeight = '200px';
    
    // Criar 3 presentes escondidos
    const presentes = [
        { emoji: '🎁', mensagem: 'Encontrou um presente especial! Você ganhou 10 pontos de amor! 💖' },
        { emoji: '🍪', mensagem: 'Biscoitos de Natal! Deliciosos e cheios de amor! 🍪' },
        { emoji: '⭐', mensagem: 'Uma estrela brilhante para iluminar seu Natal! ✨' }
    ];
    
    presentes.forEach((presente, index) => {
        const elementoPresente = document.createElement('div');
        elementoPresente.className = 'presente-escondido';
        elementoPresente.innerHTML = presente.emoji;
        elementoPresente.style.fontSize = '30px';
        elementoPresente.style.position = 'absolute';
        
        // Posição aleatória
        const areaWidth = areaJogo.clientWidth - 50;
        const areaHeight = areaJogo.clientHeight - 50;
        const x = Math.random() * areaWidth;
        const y = Math.random() * areaHeight;
        
        elementoPresente.style.left = `${x}px`;
        elementoPresente.style.top = `${y}px`;
        
        elementoPresente.addEventListener('click', function() {
            if (this.classList.contains('encontrado')) return;
            
            this.classList.add('encontrado');
            this.style.transform = 'scale(1.5)';
            this.style.opacity = '0.7';
            this.style.cursor = 'default';
            
            presentesEncontrados++;
            atualizarContadorPresentes();
            
            // Efeitos
            createConfetti();
            mostrarMensagemTemporaria(presente.mensagem);
            playOrnamentSound();
            
            // Verificar se completou o jogo
            if (presentesEncontrados === presentes.length) {
                setTimeout(() => {
                    mostrarMensagemTemporaria('🎉 Parabéns! Você encontrou todos os presentes! 🏆');
                    jogoAtivo = false;
                }, 1000);
            }
        });
        
        areaJogo.appendChild(elementoPresente);
    });
    
    mostrarMensagemTemporaria('🔍 Encontre os 3 presentes escondidos! Clique neles!');
}

function atualizarContadorPresentes() {
    const contadorElement = document.getElementById('contadorPresentes');
    if (contadorElement) {
        contadorElement.textContent = presentesEncontrados;
    }
}

// Jogo 2: Memória Natalina
function iniciarJogoMemoria() {
    paresEncontrados = 0;
    pontosMemoria = 0;
    cartaVirada = null;
    
    atualizarPontosMemoria();
    
    const memoriaContainer = document.getElementById('memoriaContainer');
    if (!memoriaContainer) return;
    
    memoriaContainer.innerHTML = '';
    
    // Símbolos para o jogo da memória
    const simbolos = ['🎄', '🎅', '⭐', '🎁', '🔔', '🦌', '❄️', '🍪'];
    cartasMemoria = [...simbolos, ...simbolos]; // Duplicar para ter pares
    
    // Embaralhar cartas
    cartasMemoria.sort(() => Math.random() - 0.5);
    
    // Criar cartas
    cartasMemoria.forEach((simbolo, index) => {
        const carta = document.createElement('div');
        carta.className = 'carta-memoria';
        carta.dataset.simbolo = simbolo;
        carta.dataset.index = index;
        
        const conteudoFrente = document.createElement('div');
        conteudoFrente.className = 'carta-conteudo carta-frente';
        conteudoFrente.innerHTML = '?';
        conteudoFrente.style.fontSize = '1.8rem';
        
        const conteudoVerso = document.createElement('div');
        conteudoVerso.className = 'carta-conteudo carta-verso';
        conteudoVerso.innerHTML = simbolo;
        conteudoVerso.style.fontSize = '2rem';
        
        carta.appendChild(conteudoFrente);
        carta.appendChild(conteudoVerso);
        
        carta.addEventListener('click', () => virarCarta(carta));
        
        memoriaContainer.appendChild(carta);
    });
    
    mostrarMensagemTemporaria('🧠 Jogo da Memória iniciado! Encontre os pares iguais!');
}

function virarCarta(carta) {
    // Se a carta já está virada ou encontrada, não faz nada
    if (carta.classList.contains('virada') || carta.classList.contains('encontrada')) {
        return;
    }
    
    // Virar a carta
    carta.classList.add('virada');
    
    // Se não há carta virada, guardar esta
    if (!cartaVirada) {
        cartaVirada = carta;
        return;
    }
    
    // Se há uma carta virada, verificar se são iguais
    const simbolo1 = cartaVirada.dataset.simbolo;
    const simbolo2 = carta.dataset.simbolo;
    
    // Se forem iguais
    if (simbolo1 === simbolo2) {
        carta.classList.add('encontrada');
        cartaVirada.classList.add('encontrada');
        
        pontosMemoria += 20;
        paresEncontrados++;
        
        cartaVirada = null;
        
        // Efeitos
        createConfetti();
        playOrnamentSound();
        
        // Verificar se completou o jogo
        if (paresEncontrados === cartasMemoria.length / 2) {
            pontosMemoria += 100; // Bônus por completar
            setTimeout(() => {
                mostrarMensagemTemporaria('🎉 Parabéns! Você completou o jogo da memória! 🏆');
            }, 500);
        }
    } else {
        // Se forem diferentes, desvirar após um tempo
        pontosMemoria = Math.max(0, pontosMemoria - 5); // Penalidade por erro
        
        setTimeout(() => {
            carta.classList.remove('virada');
            cartaVirada.classList.remove('virada');
            cartaVirada = null;
        }, 1000);
    }
    
    atualizarPontosMemoria();
}

function atualizarPontosMemoria() {
    const pontosElement = document.getElementById('pontosMemoria');
    if (pontosElement) {
        pontosElement.textContent = pontosMemoria;
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
            ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
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
    
    // Limpar container
    container.innerHTML = '';
    
    // Obter dimensões do container
    const containerWidth = container.clientWidth || container.parentElement.clientWidth;
    const containerHeight = container.clientHeight || container.parentElement.clientHeight;
    
    console.log(`💡 Criando luzes em container: ${containerWidth}x${containerHeight}`);
    
    // Se ainda não tiver a posição da estrela, usar posição central mais alta
    if (!starPosition) {
        // Posicionar no centro superior da tela
        starPosition = {
            cx: containerWidth * 0.5,
            cy: containerHeight * 0.3, // 30% da altura (mais alto)
            radius: 30
        };
        console.log('📍 Usando posição central superior para a estrela');
    }
    
    console.log(`⭐ Centro do círculo: x=${starPosition.cx}, y=${starPosition.cy}`);
    
    // CENTRALIZAR O CÍRCULO
    const centerX = starPosition.cx;
    const centerY = starPosition.cy;
    
    // Configurações do círculo - RAIO adequado para tela
    const circleRadius = Math.min(containerWidth, containerHeight) * 0.15; // 15% da menor dimensão
    const numberOfLights = 24; // MENOS luzes, mas suficiente para formar círculo
    
    console.log(`🎯 Criando círculo com raio: ${circleRadius}px`);
    console.log(`💡 ${numberOfLights} luzes (quantidade reduzida)`);
    
    // Criar luzes em CÍRCULO COMPLETO
    let luzesCriadas = 0;
    
    for (let i = 0; i < numberOfLights; i++) {
        // Calcular posição no círculo - DE 0 a 360 GRAUS
        const angle = (i / numberOfLights) * Math.PI * 2;
        const degrees = (i / numberOfLights) * 360;
        
        // Calcular coordenadas
        const x = centerX + Math.cos(angle) * circleRadius;
        const y = centerY + Math.sin(angle) * circleRadius;
        
        // Criar elemento da luz
        const luz = document.createElement('div');
        
        // Escolher cor
        const corIndex = i % config.lights.colors.length;
        const cor = config.lights.colors[corIndex];
        
        // Configurar luz
        luz.className = 'luz-natal';
        luz.setAttribute('data-color', cor.name);
        luz.style.setProperty('--i', i);
        
        // Posição absoluta
        luz.style.position = 'absolute';
        luz.style.left = `${(x / containerWidth) * 100}%`;
        luz.style.top = `${(y / containerHeight) * 100}%`;
        luz.style.zIndex = '1';
        
        // Transformar para centralizar
        luz.style.transform = `translate(-50%, -50%) scale(${0.9 + Math.random() * 0.3})`;
        
        // Tamanho um pouco maior para compensar menor quantidade
        luz.style.width = '16px';
        luz.style.height = '16px';
        luz.style.backgroundColor = cor.hex;
        luz.style.boxShadow = `0 0 18px ${cor.hex}, 0 0 36px ${cor.hex}`;
        luz.style.borderRadius = '50%';
        
        // Animação mais lenta
        const animationDuration = 1.2 + Math.random() * 1.5;
        const animationDelay = Math.random() * 2;
        luz.style.animation = `piscar ${animationDuration}s infinite alternate ${animationDelay}s`;
        
        // Opacidade
        luz.style.opacity = '0.95';
        
        container.appendChild(luz);
        luzesCriadas++;
    }
    
    // Adicionar 4 luzes extras em pontos críticos para manter formato
    const pontosCriticos = [
        { angle: 0, name: "Topo" },
        { angle: 90, name: "Direita" },
        { angle: 180, name: "Baixo" },
        { angle: 270, name: "Esquerda" }
    ];
    
    pontosCriticos.forEach((ponto, index) => {
        const angleRad = (ponto.angle * Math.PI) / 180;
        const x = centerX + Math.cos(angleRad) * circleRadius;
        const y = centerY + Math.sin(angleRad) * circleRadius;
        
        const luzExtra = document.createElement('div');
        const corIndex = (index + numberOfLights) % config.lights.colors.length;
        const cor = config.lights.colors[corIndex];
        
        luzExtra.className = 'luz-natal luz-ponto-critico';
        luzExtra.setAttribute('data-color', cor.name);
        
        luzExtra.style.position = 'absolute';
        luzExtra.style.left = `${(x / containerWidth) * 100}%`;
        luzExtra.style.top = `${(y / containerHeight) * 100}%`;
        luzExtra.style.zIndex = '1';
        luzExtra.style.transform = 'translate(-50%, -50%)';
        luzExtra.style.width = '18px';
        luzExtra.style.height = '18px';
        luzExtra.style.backgroundColor = cor.hex;
        luzExtra.style.boxShadow = `0 0 22px ${cor.hex}, 0 0 44px ${cor.hex}`;
        luzExtra.style.borderRadius = '50%';
        luzExtra.style.animation = `piscar ${1}s infinite alternate`;
        luzExtra.style.opacity = '1';
        
        container.appendChild(luzExtra);
        luzesCriadas++;
    });
    
    console.log(`✅ ${luzesCriadas} luzes criadas em CÍRCULO COMPLETO!`);
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
        if (window.drawTree) window.drawTree();
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
        
        ctx.save();
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
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius * 1.5);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.7, '#FFA500');
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0.3)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Brilho intenso
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 35;
        ctx.fill();
        
        // Contorno
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        // Armazenar posição da estrela
        starPosition = { 
            cx: cx, 
            cy: cy, 
            radius: outerRadius + 15
        };
        
        window.starPosition = starPosition;
        
        console.log(`⭐ Estrela desenhada em: x=${cx}, y=${cy}`);
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
        const starY = baseY - treeHeight - 25;
        drawStar(ctx, centerX, starY, 28);
        
        // Desenhar enfeites
        drawOrnaments(ctx);
        
        // Desenhar presentes
        drawPresents(ctx, centerX, baseY + 40);
    };
    
    // Desenhar enfeites
    function drawOrnaments(ctx) {
        for (const ornament of ornaments) {
            ctx.save();
            
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
            
            ctx.restore();
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
        if (starPosition) {
            const distance = Math.sqrt(
                Math.pow(x - starPosition.cx, 2) + 
                Math.pow(y - starPosition.cy, 2)
            );
            
            if (distance < starPosition.radius && !starClicked) {
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
            const color = config.lights.colors[Math.floor(Math.random() * config.lights.colors.length)].hex;
            ornaments.push({
                x: x,
                y: y,
                radius: 8 + Math.random() * 6,
                color: color
            });
            
            window.drawTree();
            playOrnamentSound();
            
            mostrarMensagemTemporaria('🎁 Enfeite adicionado!');
        }
    });
    
    // Desenhar árvore inicial
    window.drawTree();
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
            
            // Recriar luzes com novas cores
            initLuzes();
            
            // Efeito visual
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
            
            const color = config.lights.colors[Math.floor(Math.random() * config.lights.colors.length)].hex;
            ornaments.push({
                x: x,
                y: y,
                radius: 10 + Math.random() * 8,
                color: color
            });
            
            if (window.drawTree) window.drawTree();
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
        const currentYear = now.getFullYear();
        let christmas = new Date(currentYear, 11, 25);
        
        if (now > christmas) {
            christmas.setFullYear(currentYear + 1);
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
            const color = config.lights.colors[Math.floor(Math.random() * config.lights.colors.length)].hex;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            setTimeout(() => {
                ctx.clearRect(x - size - 2, y - size - 2, size * 2 + 4, size * 2 + 4);
                if (window.drawTree) window.drawTree();
            }, 800);
        }, i * 30);
    }
}

function createStarParticles() {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas || !starPosition) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = starPosition.cx;
    const centerY = starPosition.cy;
    
    for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const speed = 1.5 + Math.random() * 2;
        const size = 2 + Math.random() * 3;
        const color = config.lights.colors[i % config.lights.colors.length].hex;
        
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
                if (window.drawTree) window.drawTree();
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
    if (window.drawSnow) window.drawSnow();
    if (window.drawTree) window.drawTree();
    
    animationId = requestAnimationFrame(animate);
}

// =============== FUNÇÕES AUXILIARES ===============
function mostrarMensagemTemporaria(texto) {
    // Remover mensagem anterior se existir
    const msgAnterior = document.getElementById('msgTemp');
    if (msgAnterior) {
        msgAnterior.remove();
    }
    
    // Criar nova mensagem
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
    
    // Remover após 2 segundos
    setTimeout(() => {
        if (mensagem.parentNode) {
            mensagem.remove();
        }
    }, 2000);
}

// =============== INICIALIZAÇÃO FINAL ===============
window.addEventListener('load', function() {
    console.log('🚀 Inicialização final...');
    
    // Redimensionar canvases
    const snowCanvas = document.getElementById('snowCanvas');
    const treeCanvas = document.getElementById('treeCanvas');
    
    if (snowCanvas && treeCanvas) {
        const container = snowCanvas.parentElement;
        snowCanvas.width = container.clientWidth;
        snowCanvas.height = container.clientHeight;
        
        treeCanvas.width = container.clientWidth;
        treeCanvas.height = container.clientHeight;
        
        if (window.drawTree) window.drawTree();
    }
    
    // Aguardar um pouco e recriar as luzes para garantir visibilidade
    setTimeout(() => {
        const luzes = document.querySelectorAll('.luz-natal');
        console.log(`💡 Luzes criadas: ${luzes.length}`);
        
        if (luzes.length === 0) {
            console.log('🔄 Recriando luzes...');
            initLuzes();
        }
    }, 1000);
    
    console.log('%c🎄 FELIZ NATAL! ❤️', 'color: #FFD700; font-size: 20px; font-weight: bold;');
    console.log('%cCartão de Natal Interativo', 'color: #00CED1; font-size: 14px;');
    console.log('%c📸 Álbum com 4 fotos carregado!', 'color: #FF69B4; font-size: 14px;');
});

// Parar animação ao sair
window.addEventListener('beforeunload', function() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});