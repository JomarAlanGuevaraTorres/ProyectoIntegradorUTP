package com.techsolutions.backend.repository;

import com.techsolutions.backend.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository para Inventario
 * UBICACIÓN: backend/src/main/java/com/techsolutions/backend/repository/InventarioRepository.java
 */
@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {
    List<Inventario> findByEstado(Inventario.EstadoInventario estado);
    List<Inventario> findByComponenteContaining(String componente);
}