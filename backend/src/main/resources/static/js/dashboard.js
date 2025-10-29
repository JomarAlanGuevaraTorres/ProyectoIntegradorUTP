// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades
    initSidebarNavigation();
    initTableFunctionality();
    initSearchFunctionality();
    initButtonAnimations();
    initModalFunctionality();
    initUserDropdown();
    
    // Cargar datos según la página actual
    loadPageData();
});

// Función para cargar datos según la página
function loadPageData() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('dashboard_clientes.html')) {
        cargarClientes();
    } else if (currentPage.includes('dashboard_ordenes.html')) {
        cargarOrdenes();
    } else if (currentPage.includes('dashboard_servicios.html')) {
        cargarServicios();
    } else if (currentPage.includes('dashboard_inventario.html')) {
        cargarInventario();
    }
}
// ==================== FUNCIONES API - CLIENTES ====================

async function cargarClientes() {
    try {
        showNotification('Cargando clientes...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/clientes`);
        
        if (!response.ok) {
            throw new Error('Error al cargar clientes');
        }
        
        const clientes = await response.json();
        mostrarClientesEnTabla(clientes);
        
        showNotification('Clientes cargados exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar clientes: ' + error.message, 'danger');
    }
}

function mostrarClientesEnTabla(clientes) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (!tbody) {
        console.error('No se encontró la tabla');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (clientes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                    No hay clientes registrados
                </td>
            </tr>
        `;
        return;
    }
    
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.dni}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-edit me-1" title="Editar" 
                        onclick="editarCliente(${cliente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" title="Eliminar"
                        onclick="eliminarCliente(${cliente.id}, '${cliente.nombre}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePaginationInfo();
}

async function guardarCliente(clienteData) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteData)
        });
        
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Ya existe un cliente con ese DNI o email');
            }
            throw new Error('Error al guardar cliente');
        }
        
        const cliente = await response.json();
        showNotification('Cliente guardado exitosamente', 'success');
        cargarClientes(); // Recargar la tabla
        return cliente;
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error: ' + error.message, 'danger');
        throw error;
    }
}

async function eliminarCliente(id, nombre) {
    if (!confirm(`¿Estás seguro de que deseas eliminar al cliente "${nombre}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar cliente');
        }
        
        showNotification('Cliente eliminado exitosamente', 'success');
        cargarClientes(); // Recargar la tabla
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar cliente: ' + error.message, 'danger');
    }
}

async function editarCliente(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
        if (!response.ok) throw new Error('Error al cargar cliente');
        
        const cliente = await response.json();
        
        // Llenar el formulario con los datos del cliente
        document.getElementById('nombreCompleto').value = cliente.nombre;
        document.getElementById('username').value = cliente.dni;
        document.getElementById('email').value = cliente.email;
        document.getElementById('telefono').value = cliente.telefono || '';
        document.getElementById('rol').value = cliente.estado;
        
        // Cambiar el comportamiento del formulario para actualizar
        const form = document.getElementById('orderForm');
        form.dataset.editing = id;
        
        // Abrir el modal
        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar datos del cliente', 'danger');
    }
}

// ==================== FUNCIONES API - ÓRDENES ====================

async function cargarOrdenes() {
    try {
        showNotification('Cargando órdenes...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/ordenes`);
        
        if (!response.ok) {
            throw new Error('Error al cargar órdenes');
        }
        
        const ordenes = await response.json();
        mostrarOrdenesEnTabla(ordenes);
        
        showNotification('Órdenes cargadas exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar órdenes: ' + error.message, 'danger');
    }
}

function mostrarOrdenesEnTabla(ordenes) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (ordenes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                    No hay órdenes registradas
                </td>
            </tr>
        `;
        return;
    }
    
    ordenes.forEach(orden => {
        const estadoBadgeClass = {
            'PENDIENTE': 'status-pending',
            'EN_PROGRESO': 'status-in-progress',
            'COMPLETADO': 'status-completed',
            'CANCELADO': 'status-danger'
        }[orden.estado] || 'status-pending';
        
        const estadoTexto = {
            'PENDIENTE': 'Pendiente',
            'EN_PROGRESO': 'En Progreso',
            'COMPLETADO': 'Completado',
            'CANCELADO': 'Cancelado'
        }[orden.estado] || orden.estado;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${orden.numeroOrden}</td>
            <td>${orden.cliente?.nombre || 'N/A'}</td>
            <td>${orden.resumenPedido}</td>
            <td><span class="badge ${estadoBadgeClass}">${estadoTexto}</span></td>
            <td>
                <button class="btn btn-sm btn-edit me-1" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePaginationInfo();
}

// ==================== FUNCIONES API - SERVICIOS ====================

async function cargarServicios() {
    // Implementar similar a clientes
    console.log('Cargar servicios desde API');
}

// ==================== FUNCIONES API - INVENTARIO ====================

async function cargarInventario() {
    // Implementar similar a clientes
    console.log('Cargar inventario desde API');
}

// ==================== NAVEGACIÓN Y UI ====================

function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || !href || href === '') {
                e.preventDefault();
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const section = this.dataset.section;
                console.log(`Navegando a sección: ${section}`);
                updateMainContent(section);
            }
        });
    });
}

function updateMainContent(section) {
    const sectionHeader = document.querySelector('.section-header h1');
    
    const sectionTitles = {
        'ordenes': 'RESUMEN DE ORDENES',
        'inventario': 'GESTIÓN DE INVENTARIO',
        'clientes': 'ADMINISTRAR CLIENTES',
        'servicios': 'SERVICIOS DISPONIBLES',
        'estadistica': 'ESTADÍSTICAS DEL SISTEMA'
    };
    
    if (sectionTitles[section]) {
        sectionHeader.textContent = sectionTitles[section];
    }
}

// ==================== MODAL ====================

function initModalFunctionality() {
    const orderForm = document.getElementById('orderForm');
    const modal = document.getElementById('orderModal');
    
    if (!orderForm) return;
    
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('dashboard_clientes.html')) {
            await submitClienteForm();
        } else if (currentPage.includes('dashboard_inventario.html')) {
            await submitInventarioForm();
        } else if (currentPage.includes('dashboard_servicios.html')) {
            await submitServicioForm();
        } else if (currentPage.includes('dashboard_ordenes.html')) {
            // await submitOrdenForm();
        }
    });
    
    // Limpiar formulario al cerrar modal
    if (modal) {
        modal.addEventListener('hidden.bs.modal', function() {
            orderForm.reset();
            delete orderForm.dataset.editing;
            orderForm.classList.remove('was-validated');
            
            // Restaurar título según la página
            const currentPage = window.location.pathname;
            if (currentPage.includes('dashboard_servicios.html')) {
                document.querySelector('.modal-title').textContent = 'Nuevo Servicio';
            } else if (currentPage.includes('dashboard_inventario.html')) {
                document.querySelector('.modal-title').textContent = 'Nuevo Producto';
            } else {
                document.querySelector('.modal-title').textContent = 'Nuevo Registro';
            }
        });
    }
}

async function actualizarCliente(id, clienteData) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteData)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar cliente');
        }
        
        showNotification('Cliente actualizado exitosamente', 'success');
        cargarClientes();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al actualizar cliente: ' + error.message, 'danger');
        throw error;
    }
}

// ==================== BÚSQUEDA Y FILTROS ====================

function initSearchFunctionality() {
    const tableSearch = document.getElementById('tableSearch');
    
    if (tableSearch) {
        tableSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('#ordersTable tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updatePaginationInfo();
        });
    }
}

function initTableFunctionality() {
    const entriesPerPage = document.getElementById('entriesPerPage');
    
    if (entriesPerPage) {
        entriesPerPage.addEventListener('change', function() {
            console.log(`Mostrando ${this.value} entradas por página`);
            updatePaginationInfo();
        });
    }
}

// ==================== UTILIDADES ====================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updatePaginationInfo() {
    const visibleRows = document.querySelectorAll('#ordersTable tbody tr:not([style*="display: none"])').length;
    const totalRows = document.querySelectorAll('#ordersTable tbody tr').length;
    const entriesPerPage = document.getElementById('entriesPerPage')?.value || 10;
    
    const paginationInfo = document.querySelector('.pagination-info');
    
    if (paginationInfo) {
        if (visibleRows === totalRows) {
            paginationInfo.textContent = `Showing 1 to ${Math.min(visibleRows, entriesPerPage)} of ${totalRows} entries`;
        } else {
            paginationInfo.textContent = `Showing 1 to ${Math.min(visibleRows, entriesPerPage)} of ${visibleRows} entries (filtered from ${totalRows} total entries)`;
        }
    }
}

function initButtonAnimations() {
    const sidebarButton = document.querySelector('.btn-sidebar-action');
    
    if (sidebarButton) {
        sidebarButton.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('show');
            
            const icon = this.querySelector('i');
            icon.style.transform = icon.style.transform === 'rotate(180deg)' ? '' : 'rotate(180deg)';
        });
    }
}

function initUserDropdown() {
    const dropdownItems = document.querySelectorAll('.user-dropdown .dropdown-item');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const text = this.textContent.trim();
            console.log(`Acción seleccionada: ${text}`);
            
            if (text.includes('Cerrar Sesión')) {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    showNotification('Cerrando sesión...', 'info');
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                }
            } else {
                showNotification(`Navegando a: ${text}`, 'info');
            }
        });
    });
}

// ==================== FUNCIONES API - INVENTARIO ====================

async function cargarInventario() {
    try {
        showNotification('Cargando inventario...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/inventario`);
        
        if (!response.ok) {
            throw new Error('Error al cargar inventario');
        }
        
        const inventario = await response.json();
        mostrarInventarioEnTabla(inventario);
        
        showNotification('Inventario cargado exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar inventario: ' + error.message, 'danger');
    }
}

function mostrarInventarioEnTabla(inventario) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (!tbody) {
        console.error('No se encontró la tabla');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (inventario.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                    No hay items en el inventario
                </td>
            </tr>
        `;
        return;
    }
    
    inventario.forEach(item => {
        const estadoBadgeClass = {
            'NUEVO': 'status-completed',
            'BUENO': 'status-in-progress',
            'REGULAR': 'status-pending',
            'MALO': 'bg-danger text-white'
        }[item.estado] || 'status-pending';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id.toString().padStart(3, '0')}</td>
            <td>${item.componente}</td>
            <td>${item.cantidad}</td>
            <td><span class="badge ${estadoBadgeClass}">${item.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-edit me-1" title="Editar" 
                        onclick="editarInventario(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" title="Eliminar"
                        onclick="eliminarInventario(${item.id}, '${item.componente}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePaginationInfo();
}

async function guardarInventario(inventarioData) {
    try {
        const response = await fetch(`${API_BASE_URL}/inventario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventarioData)
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar item');
        }
        
        const item = await response.json();
        showNotification('Item guardado exitosamente', 'success');
        cargarInventario();
        return item;
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error: ' + error.message, 'danger');
        throw error;
    }
}

async function eliminarInventario(id, componente) {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${componente}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/inventario/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar item');
        }
        
        showNotification('Item eliminado exitosamente', 'success');
        cargarInventario();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar item: ' + error.message, 'danger');
    }
}

async function editarInventario(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/inventario/${id}`);
        if (!response.ok) throw new Error('Error al cargar item');
        
        const item = await response.json();
        
        // Llenar el formulario con los datos del item
        document.getElementById('nombreCompleto').value = item.componente;
        document.getElementById('username').value = item.cantidad;
        document.getElementById('rol').value = item.estado;
        
        // Cambiar el título del modal
        document.querySelector('.modal-title').textContent = 'Editar Producto';
        
        // Cambiar el comportamiento del formulario para actualizar
        const form = document.getElementById('orderForm');
        form.dataset.editing = id;
        
        // Abrir el modal
        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar datos del item', 'danger');
    }
}

async function actualizarInventario(id, inventarioData) {
    try {
        const response = await fetch(`${API_BASE_URL}/inventario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventarioData)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar item');
        }
        
        showNotification('Item actualizado exitosamente', 'success');
        cargarInventario();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al actualizar item: ' + error.message, 'danger');
        throw error;
    }
}

async function submitInventarioForm() {
    const form = document.getElementById('orderForm');
    const saveBtn = document.querySelector('.btn-modal-save');
    const originalText = saveBtn.innerHTML;
    
    const inventarioData = {
        componente: document.getElementById('nombreCompleto').value,
        cantidad: parseInt(document.getElementById('username').value),
        estado: document.getElementById('rol').value
    };
    
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando...';
    saveBtn.disabled = true;
    
    try {
        if (form.dataset.editing) {
            // Actualizar item existente
            await actualizarInventario(form.dataset.editing, inventarioData);
        } else {
            // Crear nuevo item
            await guardarInventario(inventarioData);
        }
        
        saveBtn.innerHTML = '<i class="fas fa-check me-2"></i>¡Guardado!';
        
        setTimeout(() => {
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
            modalInstance.hide();
            
            form.reset();
            delete form.dataset.editing;
            document.querySelector('.modal-title').textContent = 'Nuevo Producto';
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 1500);
        
    } catch (error) {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

// ==================== FUNCIONES API - SERVICIOS ====================

async function cargarServicios() {
    try {
        showNotification('Cargando servicios...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/servicios`);
        
        if (!response.ok) {
            throw new Error('Error al cargar servicios');
        }
        
        const servicios = await response.json();
        mostrarServiciosEnTabla(servicios);
        
        showNotification('Servicios cargados exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar servicios: ' + error.message, 'danger');
    }
}

function mostrarServiciosEnTabla(servicios) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (!tbody) {
        console.error('No se encontró la tabla');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (servicios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                    No hay servicios registrados
                </td>
            </tr>
        `;
        return;
    }
    
    servicios.forEach(servicio => {
        const estadoBadgeClass = servicio.estado === 'ACTIVO' ? 'status-completed' : 'bg-secondary';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${servicio.grupo}</td>
            <td>${servicio.nombre}</td>
            <td>${servicio.descripcion || 'N/A'}</td>
            <td>S/. ${parseFloat(servicio.precio).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-edit me-1" title="Editar" 
                        onclick="editarServicio(${servicio.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" title="Eliminar"
                        onclick="eliminarServicio(${servicio.id}, '${servicio.nombre}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updatePaginationInfo();
}

async function guardarServicio(servicioData) {
    try {
        const response = await fetch(`${API_BASE_URL}/servicios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(servicioData)
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar servicio');
        }
        
        const servicio = await response.json();
        showNotification('Servicio guardado exitosamente', 'success');
        cargarServicios();
        return servicio;
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error: ' + error.message, 'danger');
        throw error;
    }
}

async function eliminarServicio(id, nombre) {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/servicios/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar servicio');
        }
        
        showNotification('Servicio eliminado exitosamente', 'success');
        cargarServicios();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar servicio: ' + error.message, 'danger');
    }
}

async function editarServicio(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/servicios/${id}`);
        if (!response.ok) throw new Error('Error al cargar servicio');
        
        const servicio = await response.json();
        
        // Llenar el formulario con los datos del servicio
        document.getElementById('grupoServicio').value = servicio.grupo;
        document.getElementById('nombreServicio').value = servicio.nombre;
        document.getElementById('descripcionServicio').value = servicio.descripcion || '';
        document.getElementById('precioServicio').value = servicio.precio;
        document.getElementById('estadoServicio').value = servicio.estado;
        
        // Cambiar el título del modal
        document.querySelector('.modal-title').textContent = 'Editar Servicio';
        
        // Cambiar el comportamiento del formulario para actualizar
        const form = document.getElementById('orderForm');
        form.dataset.editing = id;
        
        // Abrir el modal
        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar datos del servicio', 'danger');
    }
}

async function actualizarServicio(id, servicioData) {
    try {
        const response = await fetch(`${API_BASE_URL}/servicios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(servicioData)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar servicio');
        }
        
        showNotification('Servicio actualizado exitosamente', 'success');
        cargarServicios();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al actualizar servicio: ' + error.message, 'danger');
        throw error;
    }
}

async function submitServicioForm() {
    const form = document.getElementById('orderForm');
    const saveBtn = document.querySelector('.btn-modal-save');
    const originalText = saveBtn.innerHTML;
    
    const servicioData = {
        grupo: document.getElementById('grupoServicio').value,
        nombre: document.getElementById('nombreServicio').value,
        descripcion: document.getElementById('descripcionServicio').value,
        precio: parseFloat(document.getElementById('precioServicio').value),
        estado: document.getElementById('estadoServicio').value
    };
    
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando...';
    saveBtn.disabled = true;
    
    try {
        if (form.dataset.editing) {
            // Actualizar servicio existente
            await actualizarServicio(form.dataset.editing, servicioData);
        } else {
            // Crear nuevo servicio
            await guardarServicio(servicioData);
        }
        
        saveBtn.innerHTML = '<i class="fas fa-check me-2"></i>¡Guardado!';
        
        setTimeout(() => {
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
            modalInstance.hide();
            
            form.reset();
            delete form.dataset.editing;
            document.querySelector('.modal-title').textContent = 'Nuevo Servicio';
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 1500);
        
    } catch (error) {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

console.log('Dashboard con API inicializado correctamente');