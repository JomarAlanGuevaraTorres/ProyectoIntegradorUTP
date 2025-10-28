/**
 * Configuración de la API - Solo constantes
 * UBICACIÓN: backend/src/main/resources/static/js/api-config.js
 * 
 * ESTE ARCHIVO SOLO DEFINE CONFIGURACIÓN
 * Las funciones API están en api-service.js
 */

const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    ENDPOINTS: {
        CLIENTES: '/clientes',
        ORDENES: '/ordenes',
        SERVICIOS: '/servicios',
        INVENTARIO: '/inventario',
        TICKETS: '/tickets',
        USUARIOS: '/usuarios'
    }
};

console.log('📋 Configuración API cargada');
console.log('🔗 URL Base:', API_CONFIG.BASE_URL);