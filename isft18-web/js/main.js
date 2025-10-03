/* =============================================
   MAIN.JS - JavaScript para ISFT N°18
   ============================================= */

// ============================================
// VARIABLES GLOBALES
// ============================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const header = document.getElementById('header');
const preinscripcionForm = document.getElementById('preinscripcionForm');
const whatsappFloat = document.getElementById('whatsappFloat');
const whatsappLink = document.getElementById('whatsappLink');

// Número de WhatsApp del instituto (placeholder - actualizar cuando tengas el número real)
const WHATSAPP_NUMBER = '5491234567890'; // Formato: código país + código área + número

// ============================================
// MENÚ HAMBURGUESA (MOBILE)
// ============================================
if (navToggle && navMenu) {
    // Toggle del menú
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navMenu.classList.contains('nav__menu--active');
        
        navMenu.classList.toggle('nav__menu--active');
        navToggle.classList.toggle('nav__toggle--active');
        
        // Prevenir scroll cuando el menú está abierto
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // Toggle aria-expanded para accesibilidad
        navToggle.setAttribute('aria-expanded', !isActive);
    });

    // Cerrar menú al hacer click en un link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav__menu--active');
            navToggle.classList.remove('nav__toggle--active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('nav__menu--active')) {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });

    // Cerrar menú al presionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--active')) {
            navMenu.classList.remove('nav__menu--active');
            navToggle.classList.remove('nav__toggle--active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Cerrar menú automáticamente en resize a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            navMenu.classList.remove('nav__menu--active');
            navToggle.classList.remove('nav__toggle--active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// HEADER STICKY CON SCROLL
// ============================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Agregar sombra al header cuando se hace scroll
    if (currentScroll > 50) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Ignorar links que solo son "#"
        if (targetId === '#') {
            e.preventDefault();
            return;
        }

        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            // Calcular offset para el header sticky
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// FORMULARIO DE PRE-INSCRIPCIÓN
// ============================================
if (preinscripcionForm) {
    preinscripcionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener datos del formulario
        const formData = new FormData(preinscripcionForm);
        const data = Object.fromEntries(formData.entries());

        // Validación básica
        if (!data.nombre || !data.email || !data.telefono || !data.carrera) {
            showFormMessage('Por favor completá todos los campos obligatorios.', 'error');
            return;
        }

        if (!data.privacidad) {
            showFormMessage('Debes aceptar la política de privacidad.', 'error');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Por favor ingresá un email válido.', 'error');
            return;
        }

        try {
            // PLACEHOLDER: Aquí irá la integración con Formspree o EmailJS
            // Por ahora simulamos el envío
            await simulateFormSubmission(data);

            // Éxito
            showFormMessage('¡Pre-inscripción enviada con éxito! Te contactaremos pronto.', 'success');
            preinscripcionForm.reset();

            // Opcional: enviar a WhatsApp
            setTimeout(() => {
                if (confirm('¿Querés recibir más información por WhatsApp?')) {
                    sendToWhatsApp(data);
                }
            }, 2000);

        } catch (error) {
            showFormMessage('Hubo un error al enviar el formulario. Intentá nuevamente.', 'error');
            console.error('Error:', error);
        }
    });
}

// Función para mostrar mensajes del formulario
function showFormMessage(message, type) {
    const messageElement = document.getElementById('formMessage');
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `form__message form__message--${type}`;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        messageElement.className = 'form__message';
    }, 5000);
}

// Simulación de envío (reemplazar con Formspree)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('Datos del formulario:', data);
        setTimeout(resolve, 1000);
    });
}

// ============================================
// INTEGRACIÓN WHATSAPP
// ============================================
function sendToWhatsApp(formData = null) {
    let message = '¡Hola! Me interesa obtener más información sobre las tecnicaturas del ISFT N°18.';

    if (formData) {
        message = `¡Hola! Me llamo ${formData.nombre} y me interesa la carrera de ${formData.carrera}. `;
        message += `Mi email es ${formData.email} y mi teléfono ${formData.telefono}.`;
        
        if (formData.mensaje) {
            message += ` Mensaje: ${formData.mensaje}`;
        }
    }

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Botón flotante de WhatsApp
if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
        e.preventDefault();
        sendToWhatsApp();
    });
}

// Link de WhatsApp en contacto
if (whatsappLink) {
    whatsappLink.addEventListener('click', (e) => {
        e.preventDefault();
        sendToWhatsApp();
    });
}

// ============================================
// LAZY LOADING DE IMÁGENES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// ANIMACIONES AL SCROLL (OPCIONAL)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Elementos a animar (agregar clase .animate-fade en HTML si querés usar esto)
const elementsToAnimate = document.querySelectorAll('.animate-fade');
elementsToAnimate.forEach(el => animateOnScroll.observe(el));

// ============================================
// VALIDACIÓN EN TIEMPO REAL DEL FORMULARIO
// ============================================
const formInputs = document.querySelectorAll('.form__input, .form__select, .form__textarea');

formInputs.forEach(input => {
    // Validar al perder el foco
    input.addEventListener('blur', () => {
        validateInput(input);
    });

    // Limpiar error al empezar a escribir
    input.addEventListener('input', () => {
        if (input.classList.contains('form__input--error')) {
            input.classList.remove('form__input--error');
        }
    });
});

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;

    // Validación según tipo
    if (input.hasAttribute('required') && !value) {
        isValid = false;
    }

    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }

    if (type === 'tel' && value) {
        // Validar que tenga al menos 8 dígitos
        const phoneRegex = /\d{8,}/;
        isValid = phoneRegex.test(value.replace(/\D/g, ''));
    }

    // Agregar/quitar clase de error
    if (!isValid) {
        input.classList.add('form__input--error');
    } else {
        input.classList.remove('form__input--error');
    }

    return isValid;
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ ISFT N°18 - Sitio web cargado correctamente');
    
    // Añadir año actual al footer
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer__bottom p');
    if (footerYear) {
        footerYear.textContent = `© ${currentYear} ISFT N°18 San Pedro. Todos los derechos reservados.`;
    }

    // Precarga del número de WhatsApp (si existe)
    if (WHATSAPP_NUMBER && WHATSAPP_NUMBER !== '5491234567890') {
        console.log('📱 WhatsApp configurado');
    } else {
        console.warn('⚠️ Recordar configurar el número de WhatsApp real');
    }
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================
window.addEventListener('error', (e) => {
    console.error('Error detectado:', e.message);
});

// ============================================
// PERFORMANCE: Registrar métricas (opcional)
// ============================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Tiempo de carga: ${pageLoadTime}ms`);
        }, 0);
    });
}
