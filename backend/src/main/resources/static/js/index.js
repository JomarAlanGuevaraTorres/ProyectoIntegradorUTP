document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas de fondo
    createBackgroundParticles();
    
    // Inicializar navegación
    initNavigation();
    
    // Inicializar botón CTA
    initCTAButton();
    
    // Inicializar efectos de scroll
    initScrollEffects();
    
    // Inicializar animaciones de entrada
    initAnimations();
    
    // Inicializar efectos hover
    initHoverEffects();
});

/**
 * Crea las partículas de fondo animadas
 */
function createBackgroundParticles() {
    const particlesContainer = document.getElementById('particles');
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 15 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

/**
 * Inicializa la navegación suave y estados activos
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remover clase active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');
        });
    });
}

/**
 * Inicializa la funcionalidad del botón CTA
 */
function initCTAButton() {
    const ctaBtn = document.querySelector('.cta-btn');
    
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            
            // Cambiar texto y estilo temporalmente
            this.innerHTML = '<i class="bi bi-check-circle me-2"></i>¡Perfecto!';
            this.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            // Restaurar después de 2 segundos
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = 'var(--gradient-cyan)';
            }, 2000);
        });
    }
}

/**
 * Inicializa los efectos de parallax en scroll
 */
function initScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            // Efecto parallax suave
            heroSection.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });
}

/**
 * Inicializa las animaciones de entrada con Intersection Observer
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos con animación fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        // Configurar estado inicial
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        
        // Observar elemento
        observer.observe(el);
    });
}

/**
 * Inicializa los efectos hover personalizados
 */
function initHoverEffects() {
    const featureIcons = document.querySelectorAll('.feature-icon');
    
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 25px rgba(72, 201, 176, 0.4)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

/**
 * Utilidades adicionales
 */

// Función para smooth scroll (si se necesita en el futuro)
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para mostrar notificaciones (si se necesita en el futuro)
function showNotification(message, type = 'info') {
    // Implementar sistema de notificaciones si se requiere
    console.log(`${type}: ${message}`);
}

// Función para validar formularios (si se necesita en el futuro)
function validateForm(formElement) {
    // Implementar validación de formularios si se requiere
    return true;
}