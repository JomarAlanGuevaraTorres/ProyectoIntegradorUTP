package com.techsolutions.backend.controller;

import com.techsolutions.backend.model.Inventario;
import com.techsolutions.backend.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para Inventario
 * UBICACIÓN: backend/src/main/java/com/techsolutions/backend/controller/InventarioController.java
 */
@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {
    
    
    @Autowired
    private InventarioService inventarioService;
    
    /**
     * Obtener todos los items del inventario
     * GET /api/inventario
     */
    @GetMapping
    public ResponseEntity<List<Inventario>> obtenerTodos() {
        System.out.println("✅ GET /api/inventario - Obteniendo todos los items");
        List<Inventario> inventario = inventarioService.obtenerTodos();
        System.out.println("✅ Encontrados " + inventario.size() + " items");
        return ResponseEntity.ok(inventario);
    }
    
    /**
     * Obtener item por ID
     * GET /api/inventario/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Inventario> obtenerPorId(@PathVariable Long id) {
        System.out.println("✅ GET /api/inventario/" + id);
        return inventarioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crear nuevo item
     * POST /api/inventario
     */
    @PostMapping
    public ResponseEntity<Inventario> crear(@RequestBody Inventario inventario) {
        try {
            System.out.println("✅ POST /api/inventario - Creando: " + inventario.getComponente());
            Inventario nuevoItem = inventarioService.guardar(inventario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoItem);
        } catch (Exception e) {
            System.err.println("❌ Error al crear: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Actualizar item existente
     * PUT /api/inventario/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Inventario> actualizar(@PathVariable Long id, @RequestBody Inventario inventario) {
        System.out.println("✅ PUT /api/inventario/" + id);
        return inventarioService.obtenerPorId(id)
                .map(itemExistente -> {
                    inventario.setId(id);
                    return ResponseEntity.ok(inventarioService.guardar(inventario));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Eliminar item
     * DELETE /api/inventario/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        System.out.println("✅ DELETE /api/inventario/" + id);
        if (inventarioService.obtenerPorId(id).isPresent()) {
            inventarioService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}