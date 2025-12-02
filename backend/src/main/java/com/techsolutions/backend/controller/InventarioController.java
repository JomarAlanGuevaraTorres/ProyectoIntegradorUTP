package com.techsolutions.backend.controller;

import com.techsolutions.backend.model.Inventario;
import com.techsolutions.backend.service.InventarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para Inventario - CON SISTEMA DE LOGS
 * UBICACIÓN: backend/src/main/java/com/techsolutions/backend/controller/InventarioController.java
 */
@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {
    
    private static final Logger logger = LoggerFactory.getLogger(InventarioController.class);
    
    @Autowired
    private InventarioService inventarioService;
    
    /**
     * Obtener todos los items del inventario
     * GET /api/inventario
     */
    @GetMapping
    public ResponseEntity<List<Inventario>> obtenerTodos() {
        logger.info("📦 GET /api/inventario - Solicitando lista completa de inventario");
        
        try {
            List<Inventario> inventario = inventarioService.obtenerTodos();
            
            int totalUnidades = inventario.stream()
                .mapToInt(Inventario::getCantidad)
                .sum();
            
            logger.info("✅ Se obtuvieron {} items de inventario - Total unidades: {}", 
                       inventario.size(), totalUnidades);
            
            return ResponseEntity.ok(inventario);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener inventario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtener item por ID
     * GET /api/inventario/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Inventario> obtenerPorId(@PathVariable Long id) {
        logger.info("🔍 GET /api/inventario/{} - Buscando item por ID", id);
        
        try {
            return inventarioService.obtenerPorId(id)
                    .map(item -> {
                        logger.info("✅ Item encontrado: ID={}, Componente={}, Cantidad={}, Estado={}", 
                                   item.getId(), 
                                   item.getComponente(), 
                                   item.getCantidad(),
                                   item.getEstado());
                        return ResponseEntity.ok(item);
                    })
                    .orElseGet(() -> {
                        logger.warn("⚠️  Item con ID {} no encontrado", id);
                        return ResponseEntity.notFound().build();
                    });
                    
        } catch (Exception e) {
            logger.error("❌ Error al buscar item con ID {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Crear nuevo item
     * POST /api/inventario
     */
    @PostMapping
    public ResponseEntity<Inventario> crear(@RequestBody Inventario inventario) {
        logger.info("➕ POST /api/inventario - Creando nuevo item: Componente={}, Cantidad={}, Estado={}", 
                   inventario.getComponente(), inventario.getCantidad(), inventario.getEstado());
        
        try {
            Inventario nuevoItem = inventarioService.guardar(inventario);
            
            logger.info("✅ Item creado exitosamente - ID: {}, Componente: {}, Cantidad: {}, Estado: {}", 
                       nuevoItem.getId(),
                       nuevoItem.getComponente(),
                       nuevoItem.getCantidad(),
                       nuevoItem.getEstado());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoItem);
            
        } catch (Exception e) {
            logger.error("❌ Error al crear item: Componente={}", inventario.getComponente(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Actualizar item existente
     * PUT /api/inventario/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Inventario> actualizar(@PathVariable Long id, @RequestBody Inventario inventario) {
        logger.info("✏️  PUT /api/inventario/{} - Actualizando item", id);
        
        try {
            return inventarioService.obtenerPorId(id)
                    .map(itemExistente -> {
                        logger.info("📝 Datos anteriores: Componente={}, Cantidad={}, Estado={}", 
                                   itemExistente.getComponente(),
                                   itemExistente.getCantidad(),
                                   itemExistente.getEstado());
                        
                        inventario.setId(id);
                        Inventario itemActualizado = inventarioService.guardar(inventario);
                        
                        // Log detallado de cambios
                        boolean cambioComponente = !itemExistente.getComponente().equals(itemActualizado.getComponente());
                        boolean cambioCantidad = !itemExistente.getCantidad().equals(itemActualizado.getCantidad());
                        boolean cambioEstado = itemExistente.getEstado() != itemActualizado.getEstado();
                        
                        StringBuilder cambios = new StringBuilder();
                        if (cambioComponente) {
                            cambios.append(String.format("Componente: %s → %s, ", 
                                itemExistente.getComponente(), itemActualizado.getComponente()));
                        }
                        if (cambioCantidad) {
                            cambios.append(String.format("Cantidad: %d → %d, ", 
                                itemExistente.getCantidad(), itemActualizado.getCantidad()));
                        }
                        if (cambioEstado) {
                            cambios.append(String.format("Estado: %s → %s", 
                                itemExistente.getEstado(), itemActualizado.getEstado()));
                        }
                        
                        logger.info("✅ Item actualizado - ID: {}, Cambios: {}", id, cambios.toString());
                        
                        return ResponseEntity.ok(itemActualizado);
                    })
                    .orElseGet(() -> {
                        logger.warn("⚠️  Item con ID {} no encontrado para actualizar", id);
                        return ResponseEntity.notFound().build();
                    });
                    
        } catch (Exception e) {
            logger.error("❌ Error al actualizar item con ID {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Eliminar item
     * DELETE /api/inventario/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        logger.info("🗑️  DELETE /api/inventario/{} - Intentando eliminar item", id);
        
        try {
            if (inventarioService.obtenerPorId(id).isPresent()) {
                Inventario item = inventarioService.obtenerPorId(id).get();
                
                logger.info("📋 Item a eliminar: ID={}, Componente={}, Cantidad={}", 
                           item.getId(), item.getComponente(), item.getCantidad());
                
                inventarioService.eliminar(id);
                
                logger.info("✅ Item eliminado exitosamente - ID: {}, Componente: {}", 
                           id, item.getComponente());
                
                return ResponseEntity.noContent().build();
            }
            
            logger.warn("⚠️  Item con ID {} no encontrado para eliminar", id);
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar item con ID {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}