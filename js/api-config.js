// Configuración de la API
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    ENDPOINTS: {
        CLIENTES: '/clientes',
        ORDENES: '/ordenes',
        SERVICIOS: '/servicios',
        INVENTARIO: '/inventario',
        TICKETS: '/tickets',
        USUARIOS: '/usuarios'
    }
};
// Cargar clientes desde la API
async function cargarClientes() {
    try {
        const clientes = await apiClient.get(API_CONFIG.ENDPOINTS.CLIENTES);
        mostrarClientesEnTabla(clientes);
    } catch (error) {
        showNotification('Error al cargar clientes', 'danger');
    }
}

// Mostrar clientes en la tabla
function mostrarClientesEnTabla(clientes) {
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.dni}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-edit me-1" onclick="editarCliente(${cliente.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete" onclick="eliminarCliente(${cliente.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Guardar nuevo cliente
async function guardarCliente(formData) {
    try {
        const nuevoCliente = await apiClient.post(API_CONFIG.ENDPOINTS.CLIENTES, formData);
        showNotification('Cliente guardado exitosamente', 'success');
        cargarClientes(); // Recargar la lista
        return nuevoCliente;
    } catch (error) {
        showNotification('Error al guardar cliente', 'danger');
        throw error;
    }
}

// Eliminar cliente
async function eliminarCliente(id) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        try {
            await apiClient.delete(`${API_CONFIG.ENDPOINTS.CLIENTES}/${id}`);
            showNotification('Cliente eliminado exitosamente', 'success');
            cargarClientes(); // Recargar la lista
        } catch (error) {
            showNotification('Error al eliminar cliente', 'danger');
        }
    }
}
// Funciones helper para hacer peticiones
const apiClient = {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error('Error en la petición');
            return await response.json();
        } catch (error) {
            console.error('Error GET:', error);
            throw error;
        }
    },
    
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error en la petición');
            return await response.json();
        } catch (error) {
            console.error('Error POST:', error);
            throw error;
        }
    },
    
    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error en la petición');
            return await response.json();
        } catch (error) {
            console.error('Error PUT:', error);
            throw error;
        }
    },
    
    
    async delete(endpoint) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error en la petición');
            return true;
        } catch (error) {
            console.error('Error DELETE:', error);
            throw error;
        }
    }
};