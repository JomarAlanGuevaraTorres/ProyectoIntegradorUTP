package com.techsolutions.backend.repository;

import com.techsolutions.backend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findByGrupo(String grupo);
    List<Servicio> findByEstado(Servicio.EstadoServicio estado);
    List<Servicio> findByNombreContaining(String nombre);
}