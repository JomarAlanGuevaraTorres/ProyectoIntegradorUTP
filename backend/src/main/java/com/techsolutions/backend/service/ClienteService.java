package com.techsolutions.backend.service;

import com.techsolutions.backend.model.Cliente;
import com.techsolutions.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }
    
    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }
    
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
    
    public Optional<Cliente> buscarPorDni(String dni) {
        return clienteRepository.findByDni(dni);
    }
    
    public boolean existePorDni(String dni) {
        return clienteRepository.existsByDni(dni);
    }
}