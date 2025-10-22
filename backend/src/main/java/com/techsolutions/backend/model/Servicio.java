package com.techsolutions.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "servicios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Servicio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 50)
    private String grupo;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal precio;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoServicio estado = EstadoServicio.ACTIVO;
    
    public enum EstadoServicio {
        ACTIVO, INACTIVO
    }
}
