/**
 * Servicio centralizado para comunicación con el Backend
 * Ubicación: js/api-service.js
 * 
 * Este archivo maneja todas las peticiones HTTP al backend Spring Boot
 */

// Configuración base de la API
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Clase principal para manejar las peticiones API
 */
class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    /**
     * Método genérico para hacer peticiones HTTP
     */
    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const options = {
            method: method,
            headers: API_CONFIG.HEADERS,
            mode: 'cors'
        };

        // Agregar body solo para POST, PUT, PATCH
        if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`🔄 ${method} ${url}`, data || '');
            
            const response = await fetch(url, options);
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Parsear respuesta JSON
            const responseData = await response.json();
            console.log(`✅ Respuesta exitosa:`, responseData);
            
            return {
                success: true,
                data: responseData,
                status: response.status
            };

        } catch (error) {
            console.error(`❌ Error en petición ${method} ${url}:`, error);
            
            return {
                success: false,
                error: error.message,
                status: error.status || 500
            };
        }
    }

    // ============================================
    // MÉTODOS PARA CLIENTES
    // ============================================

    /**
     * Obtener todos los clientes
     */
    async obtenerClientes() {
        return await this.request('/clientes', 'GET');
    }

    /**
     * Obtener un cliente por ID
     */
    async obtenerClientePorId(id) {
        return await this.request(`/clientes/${id}`, 'GET');
    }

    /**
     * Crear un nuevo cliente
     */
    async crearCliente(cliente) {
        return await this.request('/clientes', 'POST', cliente);
    }

    /**
     * Actualizar un cliente existente
     */
    async actualizarCliente(id, cliente) {
        return await this.request(`/clientes/${id}`, 'PUT', cliente);
    }

    /**
     * Eliminar un cliente
     */
    async eliminarCliente(id) {
        return await this.request(`/clientes/${id}`, 'DELETE');
    }

    // ============================================
    // MÉTODOS PARA ÓRDENES
    // ============================================

    /**
     * Obtener todas las órdenes
     */
    async obtenerOrdenes() {
        return await this.request('/ordenes', 'GET');
    }

    /**
     * Obtener una orden por ID
     */
    async obtenerOrdenPorId(id) {
        return await this.request(`/ordenes/${id}`, 'GET');
    }

    /**
     * Crear una nueva orden
     */
    async crearOrden(orden) {
        return await this.request('/ordenes', 'POST', orden);
    }

    /**
     * Actualizar una orden
     */
    async actualizarOrden(id, orden) {
        return await this.request(`/ordenes/${id}`, 'PUT', orden);
    }

    /**
     * Eliminar una orden
     */
    async eliminarOrden(id) {
        return await this.request(`/ordenes/${id}`, 'DELETE');
    }

    // ============================================
    // MÉTODOS PARA SERVICIOS
    // ============================================

    /**
     * Obtener todos los servicios
     */
    async obtenerServicios() {
        return await this.request('/servicios', 'GET');
    }

    /**
     * Obtener un servicio por ID
     */
    async obtenerServicioPorId(id) {
        return await this.request(`/servicios/${id}`, 'GET');
    }

    /**
     * Crear un nuevo servicio
     */
    async crearServicio(servicio) {
        return await this.request('/servicios', 'POST', servicio);
    }

    /**
     * Actualizar un servicio
     */
    async actualizarServicio(id, servicio) {
        return await this.request(`/servicios/${id}`, 'PUT', servicio);
    }

    /**
     * Eliminar un servicio
     */
    async eliminarServicio(id) {
        return await this.request(`/servicios/${id}`, 'DELETE');
    }

    // ============================================
    // MÉTODO DE PRUEBA DE CONEXIÓN
    // ============================================

    /**
     * Verificar si el backend está disponible
     */
    async verificarConexion() {
        try {
            const response = await fetch(`${this.baseUrl}/clientes`, {
                method: 'GET',
                headers: API_CONFIG.HEADERS,
                mode: 'cors'
            });

            if (response.ok) {
                console.log('✅ Backend conectado correctamente');
                return true;
            } else {
                console.warn('⚠️ Backend responde pero con error:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Backend no disponible:', error.message);
            return false;
        }
    }
}

// Crear instancia global del servicio API
const apiService = new ApiService();

// Verificar conexión al cargar el script
console.log('🚀 API Service inicializado');
console.log('📡 URL Base:', API_CONFIG.BASE_URL);

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiService, ApiService };
}