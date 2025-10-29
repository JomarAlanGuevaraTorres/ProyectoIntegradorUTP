package com.techsolutions.backend.controller;

import com.techsolutions.backend.model.Orden;
import com.techsolutions.backend.service.OrdenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "*")
public class OrdenController {
    
    @Autowired
    private OrdenService ordenService;
    
    /**
     * Obtener todas las órdenes
     * GET /api/ordenes
     */
    @GetMapping
    public ResponseEntity<List<Orden>> obtenerTodas() {
        List<Orden> ordenes = ordenService.obtenerTodas();
        return ResponseEntity.ok(ordenes);
    }
    
    /**
     * Obtener orden por ID
     * GET /api/ordenes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Orden> obtenerPorId(@PathVariable Long id) {
        return ordenService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crear nueva orden
     * POST /api/ordenes
     */
    @PostMapping
    public ResponseEntity<Orden> crear(@RequestBody Orden orden) {
        try {
            Orden nuevaOrden = ordenService.guardar(orden);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOrden);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Actualizar orden existente
     * PUT /api/ordenes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Orden> actualizar(@PathVariable Long id, @RequestBody Orden orden) {
        return ordenService.obtenerPorId(id)
                .map(ordenExistente -> {
                    orden.setId(id);
                    return ResponseEntity.ok(ordenService.guardar(orden));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Eliminar orden
     * DELETE /api/ordenes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (ordenService.obtenerPorId(id).isPresent()) {
            ordenService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Buscar órdenes por estado
     * GET /api/ordenes/estado/{estado}
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Orden>> buscarPorEstado(@PathVariable String estado) {
        try {
            Orden.EstadoOrden estadoEnum = Orden.EstadoOrden.valueOf(estado.toUpperCase());
            List<Orden> ordenes = ordenService.buscarPorEstado(estadoEnum);
            return ResponseEntity.ok(ordenes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
}
