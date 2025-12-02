package com.techsolutions.backend.controller;

import com.techsolutions.backend.model.Cliente;
import com.techsolutions.backend.service.ClienteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para Clientes - CON SISTEMA DE LOGS
 * UBICACIÓN: backend/src/main/java/com/techsolutions/backend/controller/ClienteController.java
 */
@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {
    
    private static final Logger logger = LoggerFactory.getLogger(ClienteController.class);
    
    @Autowired
    private ClienteService clienteService;
    
    /**
     * Obtener todos los clientes
     * GET /api/clientes
     */
    @GetMapping
    public ResponseEntity<List<Cliente>> obtenerTodos() {
        logger.info("📋 GET /api/clientes - Solicitando lista de todos los clientes");
        
        try {
            List<Cliente> clientes = clienteService.obtenerTodos();
            
            logger.info("✅ Se obtuvieron {} clientes exitosamente", clientes.size());
            
            return ResponseEntity.ok(clientes);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener clientes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtener cliente por ID
     * GET /api/clientes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerPorId(@PathVariable Long id) {
        logger.info("🔍 GET /api/clientes/{} - Buscando cliente por ID", id);
        
        try {
            return clienteService.obtenerPorId(id)
                    .map(cliente -> {
                        logger.info("✅ Cliente encontrado: ID={}, Nombre={}, DNI={}", 
                                   cliente.getId(), cliente.getNombre(), cliente.getDni());
                        return ResponseEntity.ok(cliente);
                    })
                    .orElseGet(() -> {
                        logger.warn("⚠️  Cliente con ID {} no encontrado", id);
                        return ResponseEntity.notFound().build();
                    });
                    
        } catch (Exception e) {
            logger.error("❌ Error al buscar cliente con ID {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Crear nuevo cliente
     * POST /api/clientes
     */
    @PostMapping
    public ResponseEntity<Cliente> crear(@RequestBody Cliente cliente) {
        logger.info("➕ POST /api/clientes - Intentando crear nuevo cliente: Nombre={}, DNI={}", 
                   cliente.getNombre(), cliente.getDni());
        
        try {
            // Validar DNI duplicado
            if (clienteService.existePorDni(cliente.getDni())) {
                logger.warn("⚠️  Intento de crear cliente con DNI duplicado: {}", cliente.getDni());
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            
            Cliente nuevoCliente = clienteService.guardar(cliente);
            
            logger.info("✅ Cliente creado exitosamente - ID: {}, Nombre: {}, DNI: {}, Email: {}", 
                       nuevoCliente.getId(), 
                       nuevoCliente.getNombre(), 
                       nuevoCliente.getDni(), 
                       nuevoCliente.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
            
        } catch (Exception e) {
            logger.error("❌ Error al crear cliente: Nombre={}, DNI={}", 
                        cliente.getNombre(), cliente.getDni(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Actualizar cliente existente
     * PUT /api/clientes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        logger.info("✏️  PUT /api/clientes/{} - Actualizando cliente", id);
        
        try {
            return clienteService.obtenerPorId(id)
                    .map(clienteExistente -> {
                        logger.info("📝 Datos anteriores: Nombre={}, DNI={}, Email={}", 
                                   clienteExistente.getNombre(), 
                                   clienteExistente.getDni(), 
                                   clienteExistente.getEmail());
                        
                        cliente.setId(id);
                        Cliente clienteActualizado = clienteService.guardar(cliente);
                        
                        logger.info("✅ Cliente actualizado - ID: {}, Nombre: {} → {}, DNI: {}, Email: {}", 
                                   id,
                                   clienteExistente.getNombre(), 
                                   clienteActualizado.getNombre(),
                                   clienteActualizado.getDni(),
                                   clienteActualizado.getEmail());
                        
                        return ResponseEntity.ok(clienteActualizado);
                    })
                    .orElseGet(() -> {
                        logger.warn("⚠️  Cliente con ID {} no encontrado para actualizar", id);
                        return ResponseEntity.notFound().build();
                    });
                    
        } catch (Exception e) {
            logger.error("❌ Error al actualizar cliente con ID {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Eliminar cliente
     * DELETE /api/clientes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        logger.info("🗑️  DELETE /api/clientes/{} - Intentando eliminar cliente", id);
        
        try {
            if (clienteService.obtenerPorId(id).isPresent()) {
                Cliente cliente = clienteService.obtenerPorId(id).get();
                
                logger.info("📋 Cliente a eliminar: ID={}, Nombre={}, DNI={}", 
                           cliente.getId(), cliente.getNombre(), cliente.getDni());
                
                clienteService.eliminar(id);
                
                logger.info("✅ Cliente eliminado exitosamente - ID: {}, Nombre: {}", 
                           id, cliente.getNombre());
                
                return ResponseEntity.noContent().build();
            }
            
            logger.warn("⚠️  Cliente con ID {} no encontrado para eliminar", id);
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar cliente con ID {}", id, e);
            
            // Detectar error de clave foránea
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("foreign key")) {
                logger.warn("⚠️  No se puede eliminar cliente ID {} - Tiene órdenes asociadas", id);
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}