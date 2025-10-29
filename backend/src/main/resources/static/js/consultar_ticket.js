// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api';

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

    // Navegación activa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
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
            showInputError('Formato de ticket inválido. Usa el formato: ORD-001');
            return;
        }
        
        // Proceso de búsqueda
        searchTicketInDatabase(ticketNumber, submitBtn);
    });

    // Función para validar el formato del ticket
    function isValidTicketFormat(ticketNumber) {
        // Formato esperado: ORD-NNNNNN o TK-NNNNNN
        const ticketPattern = /^[A-Z]{2,3}-\d{3,8}$/i;
        return ticketPattern.test(ticketNumber) || /^\d{3,8}$/.test(ticketNumber);
    }

    // Función para mostrar error en input
    function showInputError(message) {
        const input = document.getElementById('ticketInput');
        
        input.classList.add('input-error');
        input.placeholder = message;
        
        setTimeout(() => {
            input.classList.remove('input-error');
            input.placeholder = 'Ingresa el número de tu ticket (ej: ORD-001)';
        }, 3000);
    }

    // ==================== BÚSQUEDA EN LA BASE DE DATOS ====================
    async function searchTicketInDatabase(ticketNumber, submitBtn) {
        const originalText = submitBtn.innerHTML;
        
        // Animación de búsqueda
        submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Buscando en base de datos...';
        submitBtn.disabled = true;
        
        // Agregar animación de spin
        addSpinAnimation();
        
        try {
            // Buscar el ticket/orden en la base de datos
            const response = await fetch(`${API_BASE_URL}/ordenes`);
            
            if (!response.ok) {
                throw new Error('Error al conectar con el servidor');
            }
            
            const ordenes = await response.json();
            
            // Buscar la orden por número
            const ordenEncontrada = ordenes.find(orden => 
                orden.numeroOrden.toUpperCase() === ticketNumber.toUpperCase()
            );
            
            if (ordenEncontrada) {
                showTicketFound(submitBtn, ordenEncontrada);
            } else {
                showTicketNotFound(submitBtn, originalText, ticketNumber);
            }
            
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Error de conexión';
            submitBtn.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'var(--gradient-cyan)';
                submitBtn.disabled = false;
                
                showErrorAlert('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
            }, 2000);
        }
    }

    // Función para ticket encontrado
    function showTicketFound(submitBtn, orden) {
        submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>¡Ticket encontrado!';
        submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
            console.log('Redirigiendo a detalles del ticket:', orden);
            // Redirigir a página de detalles pasando el ID de la orden
            // La ruta depende de dónde esté consultar_ticket.html
            const currentPath = window.location.pathname;
            let targetPath = '';
            
            if (currentPath.includes('/pages/')) {
                // Si estamos en pages/consultar_ticket.html
                targetPath = '../ticket/detalles_ticket.html?id=' + orden.id;
            } else {
                // Si estamos en otro lugar
                targetPath = '/ticket/detalles_ticket.html?id=' + orden.id;
            }
            
            window.location.href = targetPath;
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
                <strong>Ticket "${ticketNumber}" no encontrado en la base de datos.</strong><br>
                <small>
                    • Verifica que el número sea correcto<br>
                    • Asegúrate de incluir el prefijo (ej: ORD-001)<br>
                    • El ticket debe estar registrado en el sistema<br>
                    • <a href="../dashboard/dashboard_ordenes.html" class="alert-link">Ver todas las órdenes</a>
                </small>
            </div>
        `;
        
        const form = document.getElementById('ticketForm');
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        form.insertAdjacentHTML('beforeend', suggestion);
        
        // Auto-remover la alerta después de 10 segundos
        setTimeout(() => {
            const alert = form.querySelector('.alert');
            if (alert) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 300);
            }
        }, 10000);
    }

    // Función para mostrar error de conexión
    function showErrorAlert(message) {
        const alert = `
            <div class="alert alert-danger mt-3 fade show" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Error de conexión</strong><br>
                <small>${message}</small>
            </div>
        `;
        
        const form = document.getElementById('ticketForm');
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        form.insertAdjacentHTML('beforeend', alert);
        
        setTimeout(() => {
            const alertElement = form.querySelector('.alert');
            if (alertElement) {
                alertElement.classList.remove('show');
                setTimeout(() => alertElement.remove(), 300);
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
        
        // Si es solo números y tiene más de 3 dígitos, agregar prefijo ORD-
        if (/^\d{3,}$/.test(value)) {
            value = 'ORD-' + value;
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

    // Limpiar alertas al escribir
    ticketInput.addEventListener('input', function() {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.classList.remove('show');
            setTimeout(() => existingAlert.remove(), 300);
        }
    });
});

console.log('✅ Sistema de consulta de tickets con BD inicializado');