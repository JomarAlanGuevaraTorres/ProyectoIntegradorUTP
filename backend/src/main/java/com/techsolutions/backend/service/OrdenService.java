package com.techsolutions.backend.service;

import com.techsolutions.backend.model.Orden;
import com.techsolutions.backend.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenService {
    
    @Autowired
    private OrdenRepository ordenRepository;
    
    public List<Orden> obtenerTodas() {
        return ordenRepository.findAll();
    }
    
    public Optional<Orden> obtenerPorId(Long id) {
        return ordenRepository.findById(id);
    }
    
    public Orden guardar(Orden orden) {
        return ordenRepository.save(orden);
    }
    
    public void eliminar(Long id) {
        ordenRepository.deleteById(id);
    }
    
    public Optional<Orden> buscarPorNumeroOrden(String numeroOrden) {
        return ordenRepository.findByNumeroOrden(numeroOrden);
    }
    
    public List<Orden> buscarPorEstado(Orden.EstadoOrden estado) {
        return ordenRepository.findByEstado(estado);
    }
    
    public List<Orden> buscarPorCliente(Long clienteId) {
        return ordenRepository.findByClienteId(clienteId);
    }
    
    public boolean existePorNumeroOrden(String numeroOrden) {
        return ordenRepository.existsByNumeroOrden(numeroOrden);
    }
}