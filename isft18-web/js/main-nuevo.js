// ========================================
// NAVEGACIÓN MÓVIL
// ========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');

// Abrir/cerrar menú móvil
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Cerrar menú al hacer click en un link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ========================================
// CARRUSEL DE CARRERAS
// ========================================
const track = document.querySelector('.carreras-track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cards = document.querySelectorAll('.carrera-card');

let currentIndex = 0;
let cardsPerView = 1;

// Detectar cuántas tarjetas mostrar según el ancho de pantalla
function updateCardsPerView() {
    const width = window.innerWidth;
    if (width >= 1024) {
        cardsPerView = 3;
    } else if (width >= 640) {
        cardsPerView = 2;
    } else {
        cardsPerView = 1;
    }
}

// Mover el carrusel
function moveCarousel(direction) {
    const totalCards = cards.length;
    const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
    
    if (direction === 'next') {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    } else {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    }
    
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // 2rem en px
    const offset = -(currentIndex * (cardWidth + gap) * cardsPerView);
    
    track.style.transform = `translateX(${offset}px)`;
}

// Event listeners de los botones
if (prevBtn) {
    prevBtn.addEventListener('click', () => moveCarousel('prev'));
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => moveCarousel('next'));
}

// Actualizar en resize
window.addEventListener('resize', () => {
    updateCardsPerView();
    currentIndex = 0;
    track.style.transform = 'translateX(0)';
});

// Inicializar
updateCardsPerView();

// ========================================
// SCROLL SUAVE
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }
});
