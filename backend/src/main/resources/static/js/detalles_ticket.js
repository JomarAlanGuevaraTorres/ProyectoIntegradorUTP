// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el ID de la orden desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ordenId = urlParams.get('id');
    
    console.log('ID de orden recibido:', ordenId);
    
    if (!ordenId) {
        mostrarError('No se especificó un número de orden');
        return;
    }
    
    // Cargar datos de la orden
    await cargarDetallesOrden(ordenId);
    
    // Inicializar eventos
    initEventListeners();
});

// ==================== CARGAR DETALLES DE LA ORDEN ====================
async function cargarDetallesOrden(ordenId) {
    try {
        // Mostrar loading
        mostrarLoading();
        
        // Consultar la orden por ID
        const response = await fetch(`${API_BASE_URL}/ordenes/${ordenId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Orden no encontrada');
            }
            throw new Error('Error al cargar la orden');
        }
        
        const orden = await response.json();
        console.log('Orden cargada:', orden);
        
        // Mostrar los datos en la interfaz
        mostrarDetallesOrden(orden);
        
    } catch (error) {
        console.error('Error al cargar orden:', error);
        mostrarError(error.message);
    }
}

// ==================== MOSTRAR DATOS EN LA INTERFAZ ====================
function mostrarDetallesOrden(orden) {
    // Obtener el contenedor principal
    const ticketContent = document.querySelector('.ticket-content');
    
    if (!ticketContent) {
        console.error('No se encontró el contenedor .ticket-content');
        return;
    }
    
    // Obtener configuración del estado
    const estadoConfig = obtenerConfigEstado(orden.estado);
    
    // Datos del cliente
    const clienteNombre = orden.cliente ? orden.cliente.nombre : 'Cliente no especificado';
    const clienteDNI = orden.cliente ? orden.cliente.dni : 'N/A';
    const clienteEmail = orden.cliente ? orden.cliente.email : 'N/A';
    const clienteTelefono = orden.cliente ? orden.cliente.telefono : 'N/A';
    
    // Calcular fecha estimada
    const fechaEstimada = calcularFechaEstimada(orden.fechaCreacion, orden.estado);
    
    // Construir el HTML completo
    ticketContent.innerHTML = `
        <div class="ticket-number"># DE TICKET: <span class="text-primary fw-bold">${orden.numeroOrden}</span></div>
        
        <div class="ticket-status" style="color: ${estadoConfig.color}">
            ${estadoConfig.texto}
        </div>
        
        <div class="status-progress" style="width: ${estadoConfig.porcentaje}%; background: ${estadoConfig.gradiente}; height: 8px; border-radius: 4px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
        
        <div class="ticket-details" style="background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 12px; padding: 20px; margin-bottom: 25px; transition: all 0.3s ease;">
            <div class="details-label mb-3" style="color: #6c757d; font-weight: 500;">Detalles del Pedido</div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <strong><i class="fas fa-user me-2 text-primary"></i>Cliente:</strong><br>
                    <span class="ms-4">${clienteNombre}</span>
                </div>
                <div class="col-md-6 mb-3">
                    <strong><i class="fas fa-id-card me-2 text-primary"></i>DNI:</strong><br>
                    <span class="ms-4">${clienteDNI}</span>
                </div>
                <div class="col-md-6 mb-3">
                    <strong><i class="fas fa-envelope me-2 text-primary"></i>Email:</strong><br>
                    <span class="ms-4">${clienteEmail}</span>
                </div>
                <div class="col-md-6 mb-3">
                    <strong><i class="fas fa-phone me-2 text-primary"></i>Teléfono:</strong><br>
                    <span class="ms-4">${clienteTelefono}</span>
                </div>
                <div class="col-12 mb-2">
                    <strong><i class="fas fa-clipboard-list me-2 text-primary"></i>Descripción:</strong><br>
                    <span class="ms-4">${orden.resumenPedido || 'Sin descripción'}</span>
                </div>
            </div>
        </div>
        
        <div class="delivery-date" style="color: #6c757d; font-size: 1em; margin-bottom: 20px; font-weight: 500;">
            <i class="fas fa-calendar-alt me-2"></i>
            Fecha de entrega estimada: <strong>${fechaEstimada}</strong>
        </div>
        
        <div class="text-center">
            <button class="btn support-btn floating-animation" style="background: linear-gradient(135deg, #48C9B0, #5DADE2); border: none; color: white; padding: 14px 35px; border-radius: 30px; font-weight: 600; font-size: 1.05em; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(72, 201, 176, 0.3);">
                <i class="fas fa-comments me-2"></i>
                Hablar con soporte
            </button>
        </div>
    `;
    
    // Mostrar información adicional según el estado
    mostrarInfoAdicional(orden);
    
    // Reinicializar eventos después de crear el contenido
    initEventListeners();
}

// ==================== CONFIGURACIÓN DE ESTADOS ====================
function obtenerConfigEstado(estado) {
    const configs = {
        'PENDIENTE': {
            texto: 'Orden Pendiente',
            color: '#ffc107',
            porcentaje: 25,
            gradiente: 'linear-gradient(135deg, #ffc107, #fd7e14)'
        },
        'EN_PROGRESO': {
            texto: 'Orden en Progreso',
            color: '#17a2b8',
            porcentaje: 60,
            gradiente: 'linear-gradient(135deg, #17a2b8, #138496)'
        },
        'COMPLETADO': {
            texto: 'Orden Completada',
            color: '#28a745',
            porcentaje: 100,
            gradiente: 'linear-gradient(135deg, #28a745, #20c997)'
        },
        'CANCELADO': {
            texto: 'Orden Cancelada',
            color: '#dc3545',
            porcentaje: 0,
            gradiente: 'linear-gradient(135deg, #dc3545, #c82333)'
        }
    };
    
    return configs[estado] || configs['PENDIENTE'];
}

// ==================== CALCULAR FECHA ESTIMADA ====================
function calcularFechaEstimada(fechaCreacion, estado) {
    if (estado === 'COMPLETADO') {
        return 'Orden ya completada';
    }
    
    if (estado === 'CANCELADO') {
        return 'Orden cancelada';
    }
    
    // Calcular fecha estimada (3-5 días hábiles desde la creación)
    const fecha = new Date(fechaCreacion);
    fecha.setDate(fecha.getDate() + 5);
    
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
}

// ==================== MOSTRAR INFO ADICIONAL ====================
function mostrarInfoAdicional(orden) {
    const infoContainer = document.querySelector('.row.fade-in');
    
    if (orden.estado === 'COMPLETADO') {
        infoContainer.innerHTML += `
            <div class="col-12 mt-3">
                <div class="alert alert-success" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>¡Orden completada exitosamente!</strong>
                    <p class="mb-0 mt-2">Tu orden ha sido procesada y completada.</p>
                </div>
            </div>
        `;
    }
    
    if (orden.estado === 'CANCELADO') {
        infoContainer.innerHTML += `
            <div class="col-12 mt-3">
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-times-circle me-2"></i>
                    <strong>Orden cancelada</strong>
                    <p class="mb-0 mt-2">Esta orden ha sido cancelada. Contacta con soporte para más información.</p>
                </div>
            </div>
        `;
    }
}

// ==================== MOSTRAR LOADING ====================
function mostrarLoading() {
    const ticketContent = document.querySelector('.ticket-content');
    ticketContent.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-muted">Cargando detalles de la orden...</p>
        </div>
    `;
}

// ==================== MOSTRAR ERROR ====================
function mostrarError(mensaje) {
    const ticketContent = document.querySelector('.ticket-content');
    ticketContent.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <h4 class="text-danger">Error</h4>
            <p class="text-muted">${mensaje}</p>
            <a href="consultar_ticket.html" class="btn btn-primary mt-3">
                <i class="fas fa-arrow-left me-2"></i>Volver a buscar
            </a>
        </div>
    `;
}

// ==================== INICIALIZAR EVENTOS ====================
function initEventListeners() {
    // Botón de soporte
    const supportBtn = document.querySelector('.support-btn');
    if (supportBtn) {
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
                    alert('Función de chat con soporte próximamente...');
                }, 2000);
            }, 1500);
        });
    }

    // Efectos hover
    const ticketDetails = document.querySelector('.ticket-details');
    if (ticketDetails) {
        ticketDetails.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        });
        
        ticketDetails.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }

    // Navegación
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
}

console.log('✅ Sistema de detalles de ticket con BD inicializado');