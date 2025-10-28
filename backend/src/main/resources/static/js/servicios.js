document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas de fondo
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

    // Navegación activa - solo para enlaces sin href real
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo prevenir default si el href es "#" (enlaces placeholder)
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
            // Para enlaces reales (index.html, servicios.html, etc.) dejar que naveguen normalmente
        });
    });

    // Efectos de hover en las tarjetas de servicio
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Efecto de click
            this.style.transform = 'translateY(-10px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
            
            // Simular navegación a página de servicio
            setTimeout(() => {
                const serviceTitle = this.querySelector('.service-title').textContent;
                console.log(`Navegando a: ${serviceTitle}`);
                // Aquí podrías redirigir a una página específica del servicio
            }, 300);
        });
    });

    // Formulario de chat
    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.querySelector('.chat-send-btn');
        const originalText = submitBtn.innerHTML;
        
        // Animación de envío
        submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Enviando...';
        submitBtn.disabled = true;
        
        // Agregar animación de spin
        const style = document.createElement('style');
        style.textContent = '.spin { animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>¡Enviado!';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                // Limpiar formulario
                document.getElementById('userName').value = '';
                document.getElementById('userEmail').value = '';
                document.getElementById('userMessage').value = '';
                
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'var(--gradient-cyan)';
                submitBtn.disabled = false;
                
                // Cerrar modal
                closeChat();
                
                // Mostrar mensaje de confirmación (opcional)
                alert('¡Mensaje enviado! Un asesor se pondrá en contacto contigo pronto.');
            }, 2000);
        }, 1500);
    });

    // Animación de entrada con observer
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

    // Observar elementos con animación
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

function openChat() {
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('chatModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus en el primer input
    setTimeout(() => {
        document.getElementById('userName').focus();
    }, 300);
}

function closeChat() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('chatModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer click en el overlay
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('modalOverlay').addEventListener('click', closeChat);

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeChat();
        }
    });
});