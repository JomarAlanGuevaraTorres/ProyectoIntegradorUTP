package com.techsolutions.backend.service;

import com.techsolutions.backend.model.Inventario;
import com.techsolutions.backend.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InventarioService {
    
    @Autowired
    private InventarioRepository inventarioRepository;
    
    public List<Inventario> obtenerTodos() {
        return inventarioRepository.findAll();
    }
    
    public Optional<Inventario> obtenerPorId(Long id) {
        return inventarioRepository.findById(id);
    }
    
    public Inventario guardar(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }
    
    public void eliminar(Long id) {
        inventarioRepository.deleteById(id);
    }
    
    public List<Inventario> buscarPorEstado(Inventario.EstadoInventario estado) {
        return inventarioRepository.findByEstado(estado);
    }
}