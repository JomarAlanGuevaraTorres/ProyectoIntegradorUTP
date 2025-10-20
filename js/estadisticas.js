// estadisticas.js - Script para gráficos estadísticos

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los gráficos
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
function initCharts() {
    createOrderStatusChart();
    createMonthlySalesChart();
    createServiceTrendChart();
    createCustomerDistChart();
    createInventoryChart();
    createTechnicianPerformanceChart();
}

// 1. Gráfico Circular - Órdenes por Estado
function createOrderStatusChart() {
    const ctx = document.getElementById('orderStatusChart').getContext('2d');
    orderStatusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pendiente', 'En Progreso', 'Completado', 'Cancelado'],
            datasets: [{
                data: [25, 35, 30, 10],
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
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// 2. Gráfico de Barras - Ventas Mensuales
function createMonthlySalesChart() {
    const ctx = document.getElementById('monthlySalesChart').getContext('2d');
    monthlySalesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
            datasets: [{
                label: 'Ventas (S/.)',
                data: [12000, 19000, 15000, 22000, 18000, 25000, 28000, 24000, 30000],
                backgroundColor: chartColors.success,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
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
}

// 3. Gráfico de Línea - Tendencia de Servicios
function createServiceTrendChart() {
    const ctx = document.getElementById('serviceTrendChart').getContext('2d');
    serviceTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
            datasets: [
                {
                    label: 'Reparaciones',
                    data: [45, 52, 48, 65, 59, 70, 75, 72, 80],
                    borderColor: chartColors.primary,
                    backgroundColor: chartColors.primary + '20',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Mantenimientos',
                    data: [30, 38, 42, 45, 48, 52, 55, 58, 62],
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
}

// 4. Gráfico Donut - Distribución de Clientes
function createCustomerDistChart() {
    const ctx = document.getElementById('customerDistChart').getContext('2d');
    customerDistChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Corporativos', 'PYMES', 'Particulares', 'Gobierno'],
            datasets: [{
                data: [40, 30, 20, 10],
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
}

// 5. Gráfico de Barras Horizontales - Inventario
function createInventoryChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    inventoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Laptops', 'PCs', 'Periféricos', 'Componentes', 'Accesorios'],
            datasets: [{
                label: 'Unidades en Stock',
                data: [85, 65, 150, 120, 200],
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
}

// 6. Gráfico Radar - Rendimiento de Técnicos
function createTechnicianPerformanceChart() {
    const ctx = document.getElementById('technicianPerformanceChart').getContext('2d');
    techPerfChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Velocidad', 'Calidad', 'Satisfacción', 'Eficiencia', 'Puntualidad'],
            datasets: [
                {
                    label: 'Técnico A',
                    data: [85, 90, 88, 92, 87],
                    borderColor: chartColors.primary,
                    backgroundColor: chartColors.primary + '30',
                    pointBackgroundColor: chartColors.primary
                },
                {
                    label: 'Técnico B',
                    data: [78, 85, 90, 88, 92],
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
}

// Función para actualizar todos los gráficos
function refreshCharts() {
    const btn = document.querySelector('.btn-add');
    const icon = btn.querySelector('i');
    
    // Añadir animación de rotación
    icon.classList.add('fa-spin');
    btn.disabled = true;
    
    setTimeout(() => {
        // Actualizar datos del gráfico de órdenes
        orderStatusChart.data.datasets[0].data = [
            Math.floor(Math.random() * 40) + 10,
            Math.floor(Math.random() * 40) + 10,
            Math.floor(Math.random() * 40) + 10,
            Math.floor(Math.random() * 20) + 5
        ];
        orderStatusChart.update();
        
        // Actualizar datos del gráfico de ventas
        monthlySalesChart.data.datasets[0].data = monthlySalesChart.data.datasets[0].data.map(() => 
            Math.floor(Math.random() * 20000) + 10000
        );
        monthlySalesChart.update();
        
        // Actualizar tendencia de servicios
        serviceTrendChart.data.datasets[0].data = serviceTrendChart.data.datasets[0].data.map(() => 
            Math.floor(Math.random() * 40) + 40
        );
        serviceTrendChart.data.datasets[1].data = serviceTrendChart.data.datasets[1].data.map(() => 
            Math.floor(Math.random() * 35) + 30
        );
        serviceTrendChart.update();
        
        // Actualizar distribución de clientes
        customerDistChart.data.datasets[0].data = [
            Math.floor(Math.random() * 30) + 30,
            Math.floor(Math.random() * 25) + 20,
            Math.floor(Math.random() * 20) + 15,
            Math.floor(Math.random() * 15) + 10
        ];
        customerDistChart.update();
        
        // Actualizar inventario
        inventoryChart.data.datasets[0].data = inventoryChart.data.datasets[0].data.map(() => 
            Math.floor(Math.random() * 150) + 50
        );
        inventoryChart.update();
        
        // Actualizar rendimiento de técnicos
        techPerfChart.data.datasets[0].data = techPerfChart.data.datasets[0].data.map(() => 
            Math.floor(Math.random() * 20) + 75
        );
        techPerfChart.data.datasets[1].data = techPerfChart.data.datasets[1].data.map(() => 
            Math.floor(Math.random() * 20) + 75
        );
        techPerfChart.update();
        
        // Quitar animación y habilitar botón
        icon.classList.remove('fa-spin');
        btn.disabled = false;
        
        // Mostrar notificación de éxito
        showNotification('¡Gráficos actualizados exitosamente!', 'success');
        
    }, 1500);
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

// Función de notificación (reutilizando del dashboard.js)
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
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

console.log('Estadísticas inicializadas correctamente');