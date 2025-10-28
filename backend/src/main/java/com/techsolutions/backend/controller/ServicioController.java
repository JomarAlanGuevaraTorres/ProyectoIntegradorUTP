package com.techsolutions.backend.controller;

import com.techsolutions.backend.model.Servicio;
import com.techsolutions.backend.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {
    
    @Autowired
    private ServicioService servicioService;
    
    /**
     * Obtener todos los servicios
     * GET /api/servicios
     */
    @GetMapping
    public ResponseEntity<List<Servicio>> obtenerTodos() {
        List<Servicio> servicios = servicioService.obtenerTodos();
        return ResponseEntity.ok(servicios);
    }
    
    /**
     * Obtener servicio por ID
     * GET /api/servicios/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Servicio> obtenerPorId(@PathVariable Long id) {
        return servicioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Crear nuevo servicio
     * POST /api/servicios
     */
    @PostMapping
    public ResponseEntity<Servicio> crear(@RequestBody Servicio servicio) {
        try {
            Servicio nuevoServicio = servicioService.guardar(servicio);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Actualizar servicio existente
     * PUT /api/servicios/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Servicio> actualizar(@PathVariable Long id, @RequestBody Servicio servicio) {
        return servicioService.obtenerPorId(id)
                .map(servicioExistente -> {
                    servicio.setId(id);
                    return ResponseEntity.ok(servicioService.guardar(servicio));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Eliminar servicio
     * DELETE /api/servicios/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (servicioService.obtenerPorId(id).isPresent()) {
            servicioService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Buscar servicios por grupo
     * GET /api/servicios/grupo/{grupo}
     */
    @GetMapping("/grupo/{grupo}")
    public ResponseEntity<List<Servicio>> buscarPorGrupo(@PathVariable String grupo) {
        List<Servicio> servicios = servicioService.buscarPorGrupo(grupo);
        return ResponseEntity.ok(servicios);
    }
    
    /**
     * Buscar servicios activos
     * GET /api/servicios/activos
     */
    @GetMapping("/activos")
    public ResponseEntity<List<Servicio>> obtenerActivos() {
        List<Servicio> servicios = servicioService.buscarPorEstado(Servicio.EstadoServicio.ACTIVO);
        return ResponseEntity.ok(servicios);
    }
}