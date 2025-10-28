package com.techsolutions.backend.repository;

import com.techsolutions.backend.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    Optional<Orden> findByNumeroOrden(String numeroOrden);
    List<Orden> findByEstado(Orden.EstadoOrden estado);
    List<Orden> findByClienteId(Long clienteId);
    boolean existsByNumeroOrden(String numeroOrden);
}