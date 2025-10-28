document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas de fondo
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 20 + 5 + 'px';
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

    // Manejo de botones de acceso
    const adminBtn = document.getElementById('adminBtn');
    const ticketBtn = document.getElementById('ticketBtn');

    // Botón de administrador
    adminBtn.addEventListener('click', function() {
        const originalText = this.innerHTML;
        
        // Animación de carga
        this.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Accediendo...';
        this.disabled = true;
        
        // Agregar animación de spin
        addSpinAnimation();
        
        setTimeout(() => {
            this.innerHTML = '<i class="bi bi-check-circle me-2"></i>Redirigiendo...';
            this.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                // Redirigir a página de administrador
                console.log('Redirecting to admin panel');
                window.location.href = 'admin.html';
            }, 1500);
        }, 2000);
    });

    // Botón de consultar ticket
    ticketBtn.addEventListener('click', function() {
        const originalText = this.innerHTML;
        
        // Animación de carga
        this.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Preparando...';
        this.disabled = true;
        
        // Agregar animación de spin
        addSpinAnimation();
        
        setTimeout(() => {
            this.innerHTML = '<i class="bi bi-check-circle me-2"></i>Redirigiendo...';
            this.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                // Redirigir a página de consulta de tickets
                console.log('Redirecting to ticket consultation');
                try {
                    window.location.href = 'consultar-ticket.html';
                } catch (error) {
                    console.error('Error en redirección:', error);
                    // Fallback: redirección directa
                    location.assign('consultar-ticket.html');
                }
            }, 1500);
        }, 1000); // Reducido el tiempo para hacer la redirección más rápida
    });

    // Función para agregar animación de spin
    function addSpinAnimation() {
        const existingStyle = document.getElementById('spin-style');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'spin-style';
            style.textContent = `.spin { 
                animation: spin 1s linear infinite; 
            } 
            @keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
            }`;
            document.head.appendChild(style);
        }
    }

    // Efecto de partículas en hover del formulario
    const formContainer = document.querySelector('.ticket-form-container');
    
    formContainer.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, white, #f8f9ff)';
    });
    
    formContainer.addEventListener('mouseleave', function() {
        this.style.background = 'white';
    });

    // Efectos adicionales en botones
    const buttons = document.querySelectorAll('.consult-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
});