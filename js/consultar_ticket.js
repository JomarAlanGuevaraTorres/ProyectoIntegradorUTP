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

    // Manejo del formulario de consulta de tickets
    document.getElementById('ticketForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const ticketNumber = document.getElementById('ticketInput').value.trim();
        const submitBtn = document.querySelector('.consult-btn');
        
        // Validación de campo vacío
        if (ticketNumber === '') {
            showInputError('Por favor ingresa un número de ticket');
            return;
        }

        // Validación del formato del ticket
        if (!isValidTicketFormat(ticketNumber)) {
            showInputError('Formato de ticket inválido. Usa el formato: TK-123456');
            return;
        }
        
        // Proceso de búsqueda
        searchTicket(ticketNumber, submitBtn);
    });

    // Función para validar el formato del ticket
    function isValidTicketFormat(ticketNumber) {
        // Formato esperado: TK-NNNNNN o similar
        const ticketPattern = /^[A-Z]{2,3}-\d{4,8}$/i;
        return ticketPattern.test(ticketNumber) || /^\d{4,8}$/.test(ticketNumber);
    }

    // Función para mostrar error en input
    function showInputError(message) {
        const input = document.getElementById('ticketInput');
        
        input.classList.add('input-error');
        input.placeholder = message;
        
        setTimeout(() => {
            input.classList.remove('input-error');
            input.placeholder = 'Ingresa el número de tu ticket (ej: TK-001234)';
        }, 3000);
    }

    // Función principal de búsqueda de ticket
    function searchTicket(ticketNumber, submitBtn) {
        const originalText = submitBtn.innerHTML;
        
        // Animación de búsqueda
        submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Buscando ticket...';
        submitBtn.disabled = true;
        
        // Agregar animación de spin
        addSpinAnimation();
        
        setTimeout(() => {
            // Simular búsqueda en base de datos
            const ticketExists = simulateTicketSearch(ticketNumber);
            
            if (ticketExists) {
                showTicketFound(submitBtn, ticketNumber);
            } else {
                showTicketNotFound(submitBtn, originalText, ticketNumber);
            }
        }, 2000);
    }

    // Simulación de búsqueda de ticket en base de datos
    function simulateTicketSearch(ticketNumber) {
        // Tickets de ejemplo que "existen" en el sistema
        const existingTickets = [
            'TK-001234', 'TK-001235', 'TK-001236', 'TK-001237',
            'SUP-001234', 'REP-001234', 'BUG-001234',
            '001234', '001235', '001236', '001237'
        ];
        
        return existingTickets.includes(ticketNumber.toUpperCase()) || 
               existingTickets.includes(ticketNumber);
    }

    // Función para ticket encontrado
    function showTicketFound(submitBtn, ticketNumber) {
        submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>¡Ticket encontrado!';
        submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
            console.log('Redirecting to ticket details for:', ticketNumber);
            // Redirigir a página de detalles del ticket
            window.location.href = `ticket-detalle.html?ticket=${encodeURIComponent(ticketNumber)}`;
        }, 1500);
    }

    // Función para ticket no encontrado
    function showTicketNotFound(submitBtn, originalText, ticketNumber) {
        submitBtn.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Ticket no encontrado';
        submitBtn.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
        
        // Efecto de shake en el formulario
        const formContainer = document.querySelector('.ticket-form-container');
        formContainer.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = 'var(--gradient-cyan)';
            submitBtn.disabled = false;
            formContainer.style.animation = '';
            
            // Mostrar sugerencia
            showTicketSuggestion(ticketNumber);
        }, 2000);
    }

    // Función para mostrar sugerencias
    function showTicketSuggestion(ticketNumber) {
        const suggestion = `
            <div class="alert alert-info mt-3 fade show" role="alert">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Ticket "${ticketNumber}" no encontrado.</strong><br>
                <small>
                    • Verifica que el número sea correcto<br>
                    • Asegúrate de incluir el prefijo (ej: TK-001234)<br>
                    • <a href="crear-ticket.html" class="alert-link">¿Necesitas crear un nuevo ticket?</a>
                </small>
            </div>
        `;
        
        const form = document.getElementById('ticketForm');
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        form.insertAdjacentHTML('beforeend', suggestion);
        
        // Auto-remover la alerta después de 8 segundos
        setTimeout(() => {
            const alert = form.querySelector('.alert');
            if (alert) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 300);
            }
        }, 8000);
    }

    // Función para agregar animación de spin
    function addSpinAnimation() {
        const existingStyle = document.getElementById('spin-style');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'spin-style';
            style.textContent = `
                .spin { 
                    animation: spin 1s linear infinite; 
                } 
                @keyframes spin { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(360deg); } 
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0) translateY(-5px); }
                    25% { transform: translateX(-5px) translateY(-5px); }
                    75% { transform: translateX(5px) translateY(-5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Efectos del input
    const ticketInput = document.getElementById('ticketInput');
    
    ticketInput.addEventListener('focus', function() {
        this.parentElement.parentElement.style.transform = 'scale(1.02)';
    });

    ticketInput.addEventListener('blur', function() {
        this.parentElement.parentElement.style.transform = '';
    });

    // Auto-formateo del número de ticket
    ticketInput.addEventListener('input', function() {
        let value = this.value.toUpperCase();
        
        // Si es solo números y tiene más de 3 dígitos, agregar prefijo TK-
        if (/^\d{4,}$/.test(value)) {
            value = 'TK-' + value;
        }
        
        this.value = value;
    });

    // Efecto de partículas en hover del formulario
    const formContainer = document.querySelector('.ticket-form-container');
    formContainer.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, white, #f8f9ff)';
    });
    
    formContainer.addEventListener('mouseleave', function() {
        this.style.background = 'white';
    });

    // Tecla Enter para enviar formulario
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.activeElement.closest('#ticketForm')) {
            document.getElementById('ticketForm').dispatchEvent(new Event('submit'));
        }
    });

    // Limpiar alertas al escribir
    ticketInput.addEventListener('input', function() {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.classList.remove('show');
            setTimeout(() => existingAlert.remove(), 300);
        }
    });
});