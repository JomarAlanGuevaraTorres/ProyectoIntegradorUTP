package com.techsolutions.backend.controller;

import com.techsolutions.backend.model.Cliente;
import com.techsolutions.backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {
    
    @Autowired
    private ClienteService clienteService;
    
    @GetMapping
    public ResponseEntity<List<Cliente>> obtenerTodos() {
        return ResponseEntity.ok(clienteService.obtenerTodos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerPorId(@PathVariable Long id) {
        return clienteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Cliente> crear(@RequestBody Cliente cliente) {
        if (clienteService.existePorDni(cliente.getDni())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Cliente nuevoCliente = clienteService.guardar(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        return clienteService.obtenerPorId(id)
                .map(clienteExistente -> {
                    cliente.setId(id);
                    return ResponseEntity.ok(clienteService.guardar(cliente));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (clienteService.obtenerPorId(id).isPresent()) {
            clienteService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}