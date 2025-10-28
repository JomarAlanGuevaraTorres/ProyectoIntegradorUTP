/**
 * Dashboard de Clientes - Integrado con Backend
 * Ubicación: js/dashboard-clientes.js
 * 
 * Este archivo maneja la tabla de clientes conectándose al backend
 */

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📊 Inicializando Dashboard de Clientes...');
    
    // Verificar conexión con backend
    const backendDisponible = await apiService.verificarConexion();
    
    if (!backendDisponible) {
        mostrarErrorConexion();
        return;
    }
    
    // Cargar clientes desde la base de datos
    await cargarClientes();
    
    // Inicializar funcionalidades
    initFormularioCliente();
    initBusqueda();
    initOrdenamiento();
});

/**
 * Cargar todos los clientes desde el backend
 */
async function cargarClientes() {
    mostrarLoader(true);
    
    try {
        const response = await apiService.obtenerClientes();
        
        if (response.success) {
            const clientes = response.data;
            console.log(`✅ ${clientes.length} clientes cargados`);
            
            if (clientes.length === 0) {
                mostrarMensajeVacio();
            } else {
                renderizarTablaClientes(clientes);
            }
        } else {
            throw new Error(response.error);
        }
        
    } catch (error) {
        console.error('❌ Error al cargar clientes:', error);
        mostrarError('No se pudieron cargar los clientes');
    } finally {
        mostrarLoader(false);
    }
}

/**
 * Renderizar la tabla de clientes con los datos
 */
function renderizarTablaClientes(clientes) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (!tbody) {
        console.error('❌ No se encontró el tbody de la tabla');
        return;
    }
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Agregar filas
    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.dataset.clienteId = cliente.id;
        
        tr.innerHTML = `
            <td>${escapeHtml(cliente.nombre)}</td>
            <td>${escapeHtml(cliente.dni)}</td>
            <td>${escapeHtml(cliente.email)}</td>
            <td>${escapeHtml(cliente.telefono || 'N/A')}</td>
            <td>
                <button class="btn btn-sm btn-edit me-1" 
                        onclick="editarCliente(${cliente.id})" 
                        title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" 
                        onclick="eliminarCliente(${cliente.id})" 
                        title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    actualizarContadores(clientes.length);
}

/**
 * Inicializar formulario de nuevo cliente
 */
function initFormularioCliente() {
    const form = document.getElementById('orderForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const cliente = {
            nombre: document.getElementById('nombreCompleto').value.trim(),
            dni: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            estado: document.getElementById('rol').value || 'ACTIVO'
        };
        
        // Validar datos
        if (!validarCliente(cliente)) {
            return;
        }
        
        await guardarCliente(cliente);
    });
}

/**
 * Guardar nuevo cliente
 */
async function guardarCliente(cliente) {
    const saveBtn = document.querySelector('.btn-modal-save');
    const originalText = saveBtn.innerHTML;
    
    // Mostrar loading
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando...';
    saveBtn.disabled = true;
    
    try {
        const response = await apiService.crearCliente(cliente);
        
        if (response.success) {
            console.log('✅ Cliente guardado:', response.data);
            
            // Mostrar éxito
            saveBtn.innerHTML = '<i class="fas fa-check me-2"></i>¡Guardado!';
            
            setTimeout(async () => {
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
                modal.hide();
                
                // Limpiar formulario
                document.getElementById('orderForm').reset();
                
                // Recargar clientes
                await cargarClientes();
                
                // Mostrar notificación
                mostrarNotificacion('Cliente creado exitosamente', 'success');
                
                // Restaurar botón
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }, 1500);
            
        } else {
            throw new Error(response.error);
        }
        
    } catch (error) {
        console.error('❌ Error al guardar cliente:', error);
        mostrarNotificacion('Error al guardar cliente: ' + error.message, 'danger');
        
        // Restaurar botón
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

/**
 * Editar cliente existente
 */
async function editarCliente(id) {
    console.log('✏️ Editando cliente ID:', id);
    
    try {
        const response = await apiService.obtenerClientePorId(id);
        
        if (response.success) {
            const cliente = response.data;
            
            // Llenar formulario con datos
            document.getElementById('nombreCompleto').value = cliente.nombre;
            document.getElementById('username').value = cliente.dni;
            document.getElementById('email').value = cliente.email;
            document.getElementById('telefono').value = cliente.telefono || '';
            document.getElementById('rol').value = cliente.estado;
            
            // Cambiar título del modal
            document.querySelector('.modal-header h5').textContent = 'Editar Cliente';
            
            // Guardar ID en el formulario
            document.getElementById('orderForm').dataset.clienteId = id;
            
            // Abrir modal
            const modal = new bootstrap.Modal(document.getElementById('orderModal'));
            modal.show();
            
        } else {
            throw new Error(response.error);
        }
        
    } catch (error) {
        console.error('❌ Error al cargar cliente:', error);
        mostrarNotificacion('Error al cargar datos del cliente', 'danger');
    }
}

/**
 * Eliminar cliente
 */
async function eliminarCliente(id) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este cliente?');
    
    if (!confirmacion) return;
    
    try {
        const response = await apiService.eliminarCliente(id);
        
        if (response.success) {
            console.log('✅ Cliente eliminado:', id);
            
            // Animar eliminación
            const fila = document.querySelector(`tr[data-cliente-id="${id}"]`);
            fila.style.transform = 'translateX(-100%)';
            fila.style.opacity = '0';
            
            setTimeout(async () => {
                await cargarClientes();
                mostrarNotificacion('Cliente eliminado exitosamente', 'success');
            }, 300);
            
        } else {
            throw new Error(response.error);
        }
        
    } catch (error) {
        console.error('❌ Error al eliminar cliente:', error);
        mostrarNotificacion('Error al eliminar cliente', 'danger');
    }
}

/**
 * Validar datos del cliente
 */
function validarCliente(cliente) {
    if (!cliente.nombre || cliente.nombre.length < 3) {
        mostrarNotificacion('El nombre debe tener al menos 3 caracteres', 'warning');
        return false;
    }
    
    if (!cliente.dni || !/^\d{8}$/.test(cliente.dni)) {
        mostrarNotificacion('El DNI debe tener 8 dígitos', 'warning');
        return false;
    }
    
    if (!cliente.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
        mostrarNotificacion('Email inválido', 'warning');
        return false;
    }
    
    return true;
}

/**
 * Funcionalidad de búsqueda
 */
function initBusqueda() {
    const searchInput = document.getElementById('tableSearch');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filas = document.querySelectorAll('#ordersTable tbody tr');
        
        let visibles = 0;
        
        filas.forEach(fila => {
            const texto = fila.textContent.toLowerCase();
            
            if (texto.includes(searchTerm)) {
                fila.style.display = '';
                visibles++;
            } else {
                fila.style.display = 'none';
            }
        });
        
        actualizarContadores(visibles);
    });
}

/**
 * Funcionalidad de ordenamiento
 */
function initOrdenamiento() {
    const headers = document.querySelectorAll('#ordersTable th');
    
    headers.forEach((header, index) => {
        header.addEventListener('click', function() {
            if (index === 4) return; // Columna de acciones no se ordena
            
            const tbody = document.querySelector('#ordersTable tbody');
            const filas = Array.from(tbody.querySelectorAll('tr'));
            
            const ordenActual = this.dataset.orden || 'asc';
            const nuevoOrden = ordenActual === 'asc' ? 'desc' : 'asc';
            
            // Actualizar iconos
            headers.forEach(h => {
                const icon = h.querySelector('i');
                if (icon) icon.className = 'fas fa-sort';
            });
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = nuevoOrden === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
            }
            
            // Ordenar filas
            filas.sort((a, b) => {
                const valorA = a.cells[index].textContent.toLowerCase();
                const valorB = b.cells[index].textContent.toLowerCase();
                
                if (nuevoOrden === 'asc') {
                    return valorA > valorB ? 1 : -1;
                } else {
                    return valorA < valorB ? 1 : -1;
                }
            });
            
            // Actualizar tabla
            filas.forEach(fila => tbody.appendChild(fila));
            
            this.dataset.orden = nuevoOrden;
        });
    });
}

/**
 * Mostrar loader
 */
function mostrarLoader(mostrar) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (mostrar) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-3">Cargando clientes...</p>
                </td>
            </tr>
        `;
    }
}

/**
 * Mostrar mensaje cuando no hay clientes
 */
function mostrarMensajeVacio() {
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <p class="text-muted">No hay clientes registrados</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#orderModal">
                    <i class="fas fa-plus me-2"></i>Agregar primer cliente
                </button>
            </td>
        </tr>
    `;
}

/**
 * Mostrar error de conexión
 */
function mostrarErrorConexion() {
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h5 class="text-danger">Error de conexión</h5>
                <p class="text-muted">No se pudo conectar con el backend</p>
                <p class="text-muted small">Verifica que el servidor esté ejecutándose en http://localhost:8080</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-sync me-2"></i>Reintentar
                </button>
            </td>
        </tr>
    `;
}

/**
 * Mostrar error general
 */
function mostrarError(mensaje) {
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <i class="fas fa-exclamation-circle fa-3x text-warning mb-3"></i>
                <p class="text-muted">${mensaje}</p>
                <button class="btn btn-primary" onclick="cargarClientes()">
                    <i class="fas fa-sync me-2"></i>Reintentar
                </button>
            </td>
        </tr>
    `;
}

/**
 * Actualizar contadores de paginación
 */
function actualizarContadores(total) {
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Mostrando ${total} de ${total} registros`;
    }
}

/**
 * Mostrar notificación
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    notificacion.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

/**
 * Escapar HTML para prevenir XSS
 */
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

console.log('✅ Dashboard de Clientes inicializado');