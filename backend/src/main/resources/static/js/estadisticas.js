// estadisticas.js - Script para gráficos estadísticos con datos reales

const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gráficos con datos reales
    initCharts();
    initAnimations();
});

// Variables globales para los gráficos
let orderStatusChart, monthlySalesChart, serviceTrendChart;
let customerDistChart, inventoryChart, techPerfChart;

// Configuración de colores
const chartColors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#48bb78',
    warning: '#ed8936',
    danger: '#f56565',
    info: '#4299e1',
    purple: '#9f7aea',
    teal: '#38b2ac',
    orange: '#f6ad55'
};

// Inicializar todos los gráficos
async function initCharts() {
    try {
        console.log('🔄 Cargando estadísticas desde la base de datos...');
        
        await Promise.all([
            createOrderStatusChart(),
            createMonthlySalesChart(),
            createServiceTrendChart(),
            createCustomerDistChart(),
            createInventoryChart(),
            createTechnicianPerformanceChart()
        ]);
        
        console.log('✅ Todos los gráficos cargados exitosamente');
    } catch (error) {
        console.error('❌ Error al cargar gráficos:', error);
        showNotification('Error al cargar estadísticas: ' + error.message, 'danger');
    }
}

// 1. Gráfico Circular - Órdenes por Estado (DATOS REALES)
async function createOrderStatusChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/estadisticas/ordenes-por-estado`);
        if (!response.ok) throw new Error('Error al cargar órdenes por estado');
        
        const data = await response.json();
        console.log('📊 Órdenes por estado:', data);
        
        const ctx = document.getElementById('orderStatusChart').getContext('2d');
        orderStatusChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Pendiente', 'En Progreso', 'Completado', 'Cancelado'],
                datasets: [{
                    data: [
                        data.PENDIENTE || 0,
                        data.EN_PROGRESO || 0,
                        data.COMPLETADO || 0,
                        data.CANCELADO || 0
                    ],
                    backgroundColor: [
                        chartColors.warning,
                        chartColors.info,
                        chartColors.success,
                        chartColors.danger
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error en gráfico de órdenes:', error);
        throw error;
    }
}

// 2. Gráfico de Barras - Ventas Mensuales (DATOS REALES)
async function createMonthlySalesChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/estadisticas/ventas-mensuales`);
        if (!response.ok) throw new Error('Error al cargar ventas mensuales');
        
        const data = await response.json();
        console.log('💰 Ventas mensuales:', data);
        
        const ctx = document.getElementById('monthlySalesChart').getContext('2d');
        monthlySalesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.meses,
                datasets: [{
                    label: 'Ventas (S/.)',
                    data: data.ventas,
                    backgroundColor: chartColors.success,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'S/. ' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error en gráfico de ventas:', error);
        throw error;
    }
}

// 3. Gráfico de Línea - Tendencia de Servicios (DATOS REALES)
async function createServiceTrendChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/estadisticas/tendencia-servicios`);
        if (!response.ok) throw new Error('Error al cargar tendencia de servicios');
        
        const data = await response.json();
        console.log('📈 Tendencia de servicios:', data);
        
        const ctx = document.getElementById('serviceTrendChart').getContext('2d');
        serviceTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.meses,
                datasets: [
                    {
                        label: 'Reparaciones',
                        data: data.reparaciones,
                        borderColor: chartColors.primary,
                        backgroundColor: chartColors.primary + '20',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Mantenimientos',
                        data: data.mantenimientos,
                        borderColor: chartColors.warning,
                        backgroundColor: chartColors.warning + '20',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 15 }
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error en gráfico de tendencia:', error);
        throw error;
    }
}

// 4. Gráfico Donut - Distribución de Clientes (DATOS REALES)
async function createCustomerDistChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/estadisticas/distribucion-clientes`);
        if (!response.ok) throw new Error('Error al cargar distribución de clientes');
        
        const data = await response.json();
        console.log('👥 Distribución de clientes:', data);
        
        const ctx = document.getElementById('customerDistChart').getContext('2d');
        customerDistChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        chartColors.primary,
                        chartColors.info,
                        chartColors.success,
                        chartColors.warning
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 15 }
                    }
                },
                cutout: '60%'
            }
        });
    } catch (error) {
        console.error('Error en gráfico de clientes:', error);
        throw error;
    }
}

// 5. Gráfico de Barras Horizontales - Inventario (DATOS REALES)
async function createInventoryChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/estadisticas/inventario-categoria`);
        if (!response.ok) throw new Error('Error al cargar inventario');
        
        const data = await response.json();
        console.log('📦 Inventario por categoría:', data);
        
        const ctx = document.getElementById('inventoryChart').getContext('2d');
        inventoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Unidades en Stock',
                    data: Object.values(data),
                    backgroundColor: chartColors.info,
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error en gráfico de inventario:', error);
        throw error;
    }
}

// 6. Gráfico Radar - Rendimiento de Técnicos (DATOS REALES)
async function createTechnicianPerformanceChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/estadisticas/rendimiento-tecnicos`);
        if (!response.ok) throw new Error('Error al cargar rendimiento de técnicos');
        
        const data = await response.json();
        console.log('⭐ Rendimiento de técnicos:', data);
        
        const ctx = document.getElementById('technicianPerformanceChart').getContext('2d');
        techPerfChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.categorias,
                datasets: [
                    {
                        label: 'Técnico A',
                        data: data.tecnicoA,
                        borderColor: chartColors.primary,
                        backgroundColor: chartColors.primary + '30',
                        pointBackgroundColor: chartColors.primary
                    },
                    {
                        label: 'Técnico B',
                        data: data.tecnicoB,
                        borderColor: chartColors.success,
                        backgroundColor: chartColors.success + '30',
                        pointBackgroundColor: chartColors.success
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 15 }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error en gráfico de técnicos:', error);
        throw error;
    }
}

// Función para actualizar todos los gráficos
async function refreshCharts() {
    const btn = document.querySelector('.btn-add');
    const icon = btn.querySelector('i');
    
    // Añadir animación de rotación
    icon.classList.add('fa-spin');
    btn.disabled = true;
    
    try {
        console.log('🔄 Actualizando gráficos...');
        
        // Destruir gráficos existentes
        if (orderStatusChart) orderStatusChart.destroy();
        if (monthlySalesChart) monthlySalesChart.destroy();
        if (serviceTrendChart) serviceTrendChart.destroy();
        if (customerDistChart) customerDistChart.destroy();
        if (inventoryChart) inventoryChart.destroy();
        if (techPerfChart) techPerfChart.destroy();
        
        // Recargar todos los gráficos
        await initCharts();
        
        showNotification('¡Gráficos actualizados exitosamente!', 'success');
        
    } catch (error) {
        console.error('Error al actualizar:', error);
        showNotification('Error al actualizar gráficos: ' + error.message, 'danger');
    } finally {
        // Quitar animación y habilitar botón
        icon.classList.remove('fa-spin');
        btn.disabled = false;
    }
}

// Animaciones de entrada
function initAnimations() {
    const cards = document.querySelectorAll('.chart-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Función de notificación
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

console.log('✅ Sistema de estadísticas con datos reales inicializado');