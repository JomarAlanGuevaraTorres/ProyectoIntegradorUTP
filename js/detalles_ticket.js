document.addEventListener('DOMContentLoaded', function() {
    // Animación del botón de soporte
    const supportBtn = document.querySelector('.support-btn');
    supportBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Efecto de click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Simulación de acción
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Conectando...';
        this.disabled = true;
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-check me-2"></i>Conectado!';
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 2000);
        }, 1500);
    });

    // Animación de hover para los detalles del ticket
    const ticketDetails = document.querySelector('.ticket-details');
    ticketDetails.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
    });
    
    ticketDetails.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });

    // Navegación activa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Efecto de escritura para el número de ticket
    const ticketNumber = document.querySelector('.ticket-number');
    const originalText = ticketNumber.textContent;
    ticketNumber.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            ticketNumber.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Agregar número de ticket después de la animación
            setTimeout(() => {
                ticketNumber.innerHTML = '# DE TICKET: <span class="text-primary fw-bold">#TK-2024-001234</span>';
            }, 500);
        }
    };
    
    setTimeout(typeWriter, 1000);
});