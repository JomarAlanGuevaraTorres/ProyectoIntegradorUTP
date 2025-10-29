package com.techsolutions.backend.controller;

import com.techsolutions.backend.service.*;
import com.techsolutions.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller para obtener estadísticas del sistema
 * UBICACIÓN: backend/src/main/java/com/techsolutions/backend/controller/EstadisticasController.java
 */
@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticasController {
    
    @Autowired
    private OrdenService ordenService;
    
    @Autowired
    private ClienteService clienteService;
    
    @Autowired
    private ServicioService servicioService;
    
    @Autowired
    private InventarioService inventarioService;
    
    /**
     * Obtener resumen general de estadísticas
     * GET /api/estadisticas/resumen
     */
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> obtenerResumen() {
        Map<String, Object> resumen = new HashMap<>();
        
        // Contar totales
        List<Orden> ordenes = ordenService.obtenerTodas();
        List<Cliente> clientes = clienteService.obtenerTodos();
        List<Servicio> servicios = servicioService.obtenerTodos();
        List<Inventario> inventario = inventarioService.obtenerTodos();
        
        resumen.put("totalOrdenes", ordenes.size());
        resumen.put("totalClientes", clientes.size());
        resumen.put("totalServicios", servicios.size());
        resumen.put("totalInventario", inventario.stream()
            .mapToInt(Inventario::getCantidad)
            .sum());
        
        return ResponseEntity.ok(resumen);
    }
    
    /**
     * Obtener estadísticas de órdenes por estado
     * GET /api/estadisticas/ordenes-por-estado
     */
    @GetMapping("/ordenes-por-estado")
    public ResponseEntity<Map<String, Integer>> obtenerOrdenesPorEstado() {
        List<Orden> ordenes = ordenService.obtenerTodas();
        
        Map<String, Integer> estadisticas = new HashMap<>();
        estadisticas.put("PENDIENTE", 0);
        estadisticas.put("EN_PROGRESO", 0);
        estadisticas.put("COMPLETADO", 0);
        estadisticas.put("CANCELADO", 0);
        
        for (Orden orden : ordenes) {
            String estado = orden.getEstado().toString();
            estadisticas.put(estado, estadisticas.get(estado) + 1);
        }
        
        return ResponseEntity.ok(estadisticas);
    }
    
    /**
     * Obtener ventas mensuales (simuladas por ahora)
     * GET /api/estadisticas/ventas-mensuales
     */
    @GetMapping("/ventas-mensuales")
    public ResponseEntity<Map<String, Object>> obtenerVentasMensuales() {
        List<Orden> ordenes = ordenService.obtenerTodas();
        
        // Contar órdenes por mes
        Map<Month, Long> ordenesPorMes = ordenes.stream()
            .collect(Collectors.groupingBy(
                orden -> orden.getFechaCreacion().getMonth(),
                Collectors.counting()
            ));
        
        // Crear array con los últimos 9 meses
        List<String> meses = Arrays.asList("Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep");
        List<Double> ventas = new ArrayList<>();
        
        // Simular ventas basadas en cantidad de órdenes (precio promedio S/. 500)
        for (int i = 1; i <= 9; i++) {
            Month mes = Month.of(i);
            long cantidadOrdenes = ordenesPorMes.getOrDefault(mes, 0L);
            double ventaMes = cantidadOrdenes * 500.0 + (Math.random() * 10000);
            ventas.add(ventaMes);
        }
        
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("meses", meses);
        resultado.put("ventas", ventas);
        
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * Obtener tendencia de servicios
     * GET /api/estadisticas/tendencia-servicios
     */
    @GetMapping("/tendencia-servicios")
    public ResponseEntity<Map<String, Object>> obtenerTendenciaServicios() {
        List<Orden> ordenes = ordenService.obtenerTodas();
        
        List<String> meses = Arrays.asList("Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep");
        
        // Contar órdenes por mes como proxy de servicios
        Map<Month, Long> ordenesPorMes = ordenes.stream()
            .filter(o -> o.getEstado() == Orden.EstadoOrden.COMPLETADO)
            .collect(Collectors.groupingBy(
                orden -> orden.getFechaCreacion().getMonth(),
                Collectors.counting()
            ));
        
        List<Integer> reparaciones = new ArrayList<>();
        List<Integer> mantenimientos = new ArrayList<>();
        
        for (int i = 1; i <= 9; i++) {
            Month mes = Month.of(i);
            long total = ordenesPorMes.getOrDefault(mes, 0L);
            
            // Dividir entre reparaciones (60%) y mantenimientos (40%)
            reparaciones.add((int)(total * 0.6));
            mantenimientos.add((int)(total * 0.4));
        }
        
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("meses", meses);
        resultado.put("reparaciones", reparaciones);
        resultado.put("mantenimientos", mantenimientos);
        
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * Obtener distribución de clientes por tipo
     * GET /api/estadisticas/distribucion-clientes
     */
    @GetMapping("/distribucion-clientes")
    public ResponseEntity<Map<String, Integer>> obtenerDistribucionClientes() {
        List<Cliente> clientes = clienteService.obtenerTodos();
        
        int total = clientes.size();
        
        Map<String, Integer> distribucion = new HashMap<>();
        distribucion.put("Corporativos", (int)(total * 0.40));
        distribucion.put("PYMES", (int)(total * 0.30));
        distribucion.put("Particulares", (int)(total * 0.20));
        distribucion.put("Gobierno", (int)(total * 0.10));
        
        return ResponseEntity.ok(distribucion);
    }
    
    /**
     * Obtener inventario por categoría
     * GET /api/estadisticas/inventario-categoria
     */
    @GetMapping("/inventario-categoria")
    public ResponseEntity<Map<String, Integer>> obtenerInventarioPorCategoria() {
        List<Inventario> inventario = inventarioService.obtenerTodos();
        
        Map<String, Integer> categorias = new HashMap<>();
        categorias.put("Laptops", 0);
        categorias.put("PCs", 0);
        categorias.put("Periféricos", 0);
        categorias.put("Componentes", 0);
        categorias.put("Accesorios", 0);
        
        // Clasificar items por categoría basándose en el nombre
        for (Inventario item : inventario) {
            String componente = item.getComponente().toLowerCase();
            
            if (componente.contains("laptop") || componente.contains("portátil")) {
                categorias.put("Laptops", categorias.get("Laptops") + item.getCantidad());
            } else if (componente.contains("pc") || componente.contains("computadora") || componente.contains("desktop")) {
                categorias.put("PCs", categorias.get("PCs") + item.getCantidad());
            } else if (componente.contains("teclado") || componente.contains("mouse") || componente.contains("monitor")) {
                categorias.put("Periféricos", categorias.get("Periféricos") + item.getCantidad());
            } else if (componente.contains("ram") || componente.contains("disco") || componente.contains("procesador")) {
                categorias.put("Componentes", categorias.get("Componentes") + item.getCantidad());
            } else {
                categorias.put("Accesorios", categorias.get("Accesorios") + item.getCantidad());
            }
        }
        
        return ResponseEntity.ok(categorias);
    }
    
    /**
     * Obtener rendimiento de técnicos (simulado)
     * GET /api/estadisticas/rendimiento-tecnicos
     */
    @GetMapping("/rendimiento-tecnicos")
    public ResponseEntity<Map<String, Object>> obtenerRendimientoTecnicos() {
        List<Orden> ordenes = ordenService.obtenerTodas();
        
        long completadas = ordenes.stream()
            .filter(o -> o.getEstado() == Orden.EstadoOrden.COMPLETADO)
            .count();
        
        // Simular rendimiento de 2 técnicos
        Map<String, Object> resultado = new HashMap<>();
        
        List<String> categorias = Arrays.asList("Velocidad", "Calidad", "Satisfacción", "Eficiencia", "Puntualidad");
        
        List<Integer> tecnicoA = Arrays.asList(
            85 + (int)(Math.random() * 10),
            90 + (int)(Math.random() * 5),
            88 + (int)(Math.random() * 7),
            92 + (int)(Math.random() * 4),
            87 + (int)(Math.random() * 8)
        );
        
        List<Integer> tecnicoB = Arrays.asList(
            78 + (int)(Math.random() * 12),
            85 + (int)(Math.random() * 8),
            90 + (int)(Math.random() * 5),
            88 + (int)(Math.random() * 6),
            92 + (int)(Math.random() * 4)
        );
        
        resultado.put("categorias", categorias);
        resultado.put("tecnicoA", tecnicoA);
        resultado.put("tecnicoB", tecnicoB);
        
        return ResponseEntity.ok(resultado);
    }
}