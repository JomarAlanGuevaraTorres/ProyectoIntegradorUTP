package com.techsolutions.backend.service;

import com.techsolutions.backend.model.Servicio;
import com.techsolutions.backend.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {
    
    @Autowired
    private ServicioRepository servicioRepository;
    
    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }
    
    public Optional<Servicio> obtenerPorId(Long id) {
        return servicioRepository.findById(id);
    }
    
    public Servicio guardar(Servicio servicio) {
        return servicioRepository.save(servicio);
    }
    
    public void eliminar(Long id) {
        servicioRepository.deleteById(id);
    }
    
    public List<Servicio> buscarPorGrupo(String grupo) {
        return servicioRepository.findByGrupo(grupo);
    }
    
    public List<Servicio> buscarPorEstado(Servicio.EstadoServicio estado) {
        return servicioRepository.findByEstado(estado);
    }
    
    public List<Servicio> buscarPorNombre(String nombre) {
        return servicioRepository.findByNombreContaining(nombre);
    }
}