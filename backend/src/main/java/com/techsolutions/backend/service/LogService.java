package com.techsolutions.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Servicio centralizado para manejo de logs
 * UBICACIÓN: backend/src/main/java/com/techsolutions/backend/service/LogService.java
 */
@Service
public class LogService {
    
    private static final Logger logger = LoggerFactory.getLogger(LogService.class);
    
    /**
     * Log de información general
     */
    public void info(String mensaje) {
        logger.info(mensaje);
    }
    
    /**
     * Log de operación CRUD
     */
    public void logOperacion(String entidad, String accion, String detalles) {
        String mensaje = String.format("OPERACIÓN: %s | ACCIÓN: %s | DETALLES: %s", 
                                       entidad, accion, detalles);
        logger.info(mensaje);
    }
    
    /**
     * Log de error
     */
    public void error(String mensaje, Exception e) {
        logger.error(mensaje, e);
    }
    
    /**
     * Log de advertencia
     */
    public void warn(String mensaje) {
        logger.warn(mensaje);
    }
    
    /**
     * Log de debug (solo en desarrollo)
     */
    public void debug(String mensaje) {
        logger.debug(mensaje);
    }
    
    /**
     * Log de acceso al sistema
     */
    public void logAcceso(String usuario, String accion, String ip) {
        String mensaje = String.format("ACCESO: Usuario=%s | Acción=%s | IP=%s", 
                                       usuario, accion, ip);
        logger.info(mensaje);
    }
    
    /**
     * Log de inicio de aplicación
     */
    public void logInicio() {
        logger.info("╔═══════════════════════════════════════════════════════════════╗");
        logger.info("║         ✅ APLICACIÓN TECHSOLUTIONS INICIADA                 ║");
        logger.info("║         📅 Fecha: " + java.time.LocalDateTime.now() + "              ║");
        logger.info("╚═══════════════════════════════════════════════════════════════╝");
    }
}