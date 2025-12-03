// ============================================================================
// ClienteService.java - CON LOGS
// ============================================================================
package com.techsolutions.backend.service;

import com.techsolutions.backend.model.Cliente;
import com.techsolutions.backend.repository.ClienteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    
    private static final Logger logger = LoggerFactory.getLogger(ClienteService.class);
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Cliente> obtenerTodos() {
        logger.debug("🔄 Obteniendo todos los clientes de la base de datos");
        List<Cliente> clientes = clienteRepository.findAll();
        logger.debug("✅ {} clientes recuperados", clientes.size());
        return clientes;
    }
    
    public Optional<Cliente> obtenerPorId(Long id) {
        logger.debug("🔍 Buscando cliente con ID: {}", id);
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            logger.debug("✅ Cliente encontrado: {}", cliente.get().getNombre());
        } else {
            logger.debug("⚠️  Cliente con ID {} no encontrado", id);
        }
        return cliente;
    }
    
    public Cliente guardar(Cliente cliente) {
        if (cliente.getId() == null) {
            logger.debug("💾 Guardando nuevo cliente: {}", cliente.getNombre());
        } else {
            logger.debug("💾 Actualizando cliente ID: {}", cliente.getId());
        }
        
        Cliente clienteGuardado = clienteRepository.save(cliente);
        logger.debug("✅ Cliente guardado exitosamente con ID: {}", clienteGuardado.getId());
        return clienteGuardado;
    }
    
    public void eliminar(Long id) {
        logger.debug("🗑️  Eliminando cliente con ID: {}", id);
        clienteRepository.deleteById(id);
        logger.debug("✅ Cliente eliminado exitosamente");
    }
    
    public Optional<Cliente> buscarPorDni(String dni) {
        logger.debug("🔍 Buscando cliente por DNI: {}", dni);
        return clienteRepository.findByDni(dni);
    }
    
    public boolean existePorDni(String dni) {
        logger.debug("🔍 Verificando existencia de DNI: {}", dni);
        boolean existe = clienteRepository.existsByDni(dni);
        logger.debug(existe ? "⚠️  DNI {} ya existe" : "✅ DNI {} disponible", dni);
        return existe;
    }
}

