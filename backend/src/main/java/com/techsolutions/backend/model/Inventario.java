package com.techsolutions.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Inventario
 * UBICACIÓN: backend/src/main/java/com/techsolutions/backend/model/Inventario.java
 */
@Entity
@Table(name = "inventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String componente;
    
    @Column(nullable = false)
    private Integer cantidad = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoInventario estado = EstadoInventario.NUEVO;
    
    public enum EstadoInventario {
        NUEVO, BUENO, REGULAR, MALO
    }
}