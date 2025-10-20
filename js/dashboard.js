document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades
    initSidebarNavigation();
    initTableFunctionality();
    initSearchFunctionality();
    initButtonAnimations();
    initModalFunctionality();
    initUserDropdown();
    
// Navegación del sidebar
    function initSidebarNavigation() {
        const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Solo prevenir si es un enlace interno (#) o vacío
                if (href === '#' || !href || href === '') {
                    e.preventDefault();
                    
                    // Remover clase activa de todos los enlaces
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    
                    // Agregar clase activa al enlace clickeado
                    this.classList.add('active');
                    
                    // Obtener la sección
                    const section = this.dataset.section;
                    console.log(`Navegando a sección: ${section}`);
                    
                    // Actualizar contenido principal
                    updateMainContent(section);
                } else {
                    // Si tiene un href válido (como dashboard_inventario.html), permitir navegación normal
                    console.log(`Navegando a: ${href}`);
                }
            });
        });
    }
    
    // Actualizar contenido principal según la sección
    function updateMainContent(section) {
        const sectionHeader = document.querySelector('.section-header h1');
        
        // Ocultar todas las secciones
        const allSections = document.querySelectorAll('[id$="Section"]');
        allSections.forEach(sec => sec.style.display = 'none');
        
        // Mostrar la sección correspondiente
        const targetSection = document.getElementById(section + 'Section');
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
        }
        
        const sectionTitles = {
            'ordenes': 'RESUMEN DE ORDENES',
            'inventario': 'GESTIÓN DE INVENTARIO',
            'clientes': 'ADMINISTRAR CLIENTES',
            'servicios': 'SERVICIOS DISPONIBLES',
            'estadistica': 'ESTADÍSTICAS DEL SISTEMA'
        };
        
        if (sectionTitles[section]) {
            sectionHeader.textContent = sectionTitles[section];
        }
    }
    
    // Funcionalidad del modal
    function initModalFunctionality() {
        const orderForm = document.getElementById('orderForm');
        const modal = document.getElementById('orderModal');
        
        // Manejar envío del formulario
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = {
                nombreCompleto: document.getElementById('nombreCompleto').value,
                username: document.getElementById('username').value,
                contrasena: document.getElementById('contrasena').value,
                rol: document.getElementById('rol').value
            };
            
            console.log('Datos del formulario:', formData);
            
            // Simular guardado
            const saveBtn = document.querySelector('.btn-modal-save');
            const originalText = saveBtn.innerHTML;
            
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando...';
            saveBtn.disabled = true;
            
            setTimeout(() => {
                saveBtn.innerHTML = '<i class="fas fa-check me-2"></i>¡Guardado!';
                
                setTimeout(() => {
                    // Cerrar modal
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                    
                    // Limpiar formulario
                    orderForm.reset();
                    
                    // Restaurar botón
                    saveBtn.innerHTML = originalText;
                    saveBtn.disabled = false;
                    
                    // Mostrar notificación
                    showNotification('¡Orden creada exitosamente!', 'success');
                    
                }, 1500);
            }, 2000);
        });
        
        // Limpiar formulario al cerrar modal
        modal.addEventListener('hidden.bs.modal', function() {
            orderForm.reset();
            orderForm.classList.remove('was-validated');
        });
        
        // Validación en tiempo real
        const inputs = orderForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            });
        });
    }
    
    // Funcionalidad del dropdown de usuario
    function initUserDropdown() {
        const dropdownItems = document.querySelectorAll('.user-dropdown .dropdown-item');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const text = this.textContent.trim();
                console.log(`Acción seleccionada: ${text}`);
                
                if (text.includes('Cerrar Sesión')) {
                    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                        showNotification('Cerrando sesión...', 'info');
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    }
                } else {
                    showNotification(`Navegando a: ${text}`, 'info');
                }
            });
        });
    }
    
    // Funcionalidad de la tabla
    function initTableFunctionality() {
        // Ordenamiento de columnas
        const tableHeaders = document.querySelectorAll('th');
        tableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    // Resetear todos los iconos
                    tableHeaders.forEach(h => {
                        const i = h.querySelector('i');
                        if (i) {
                            i.className = 'fas fa-sort';
                        }
                    });
                    
                    // Cambiar icono del header actual
                    icon.className = 'fas fa-sort-up';
                    console.log(`Ordenando por: ${this.textContent.trim()}`);
                }
            });
        });
        
        // Control de entradas por página
        const entriesPerPage = document.getElementById('entriesPerPage');
        entriesPerPage.addEventListener('change', function() {
            console.log(`Mostrando ${this.value} entradas por página`);
            updatePaginationInfo();
        });
        
        // Botones de acción de la tabla
        initTableActionButtons();
    }
    
    // Botones de editar y eliminar
    function initTableActionButtons() {
        // Botones de editar
        const editButtons = document.querySelectorAll('.btn-edit');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const orderNumber = row.cells[0].textContent;
                console.log(`Editando orden: ${orderNumber}`);
                
                // Efecto visual
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 100);
                }, 100);
            });
        });
        
        // Botones de eliminar
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const orderNumber = row.cells[0].textContent;
                
                if (confirm(`¿Estás seguro de que deseas eliminar la orden ${orderNumber}?`)) {
                    // Animación de eliminación
                    row.style.transform = 'translateX(-100%)';
                    row.style.opacity = '0';
                    
                    setTimeout(() => {
                        row.remove();
                        updatePaginationInfo();
                        console.log(`Orden ${orderNumber} eliminada`);
                    }, 300);
                }
            });
        });
    }
    
    // Funcionalidad de búsqueda
    function initSearchFunctionality() {
        // Búsqueda en el header
        const headerSearch = document.querySelector('.search-input');
        headerSearch.addEventListener('input', function() {
            console.log(`Buscando: ${this.value}`);
            // Aquí implementarías la lógica de búsqueda global
        });
        
        // Búsqueda en la tabla
        const tableSearch = document.getElementById('tableSearch');
        tableSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('#ordersTable tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updatePaginationInfo();
        });
    }
    
    // Animaciones de botones
    function initButtonAnimations() {
        // Botón "Ingresar Orden" - ya no necesita funcionalidad especial porque abre el modal
        
        // Botón del sidebar
        const sidebarButton = document.querySelector('.btn-sidebar-action');
        if (sidebarButton) {
            sidebarButton.addEventListener('click', function() {
                // Alternar sidebar en móvil
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('show');
                
                // Rotar icono
                const icon = this.querySelector('i');
                icon.style.transform = icon.style.transform === 'rotate(180deg)' ? '' : 'rotate(180deg)';
            });
        }
    }
    
    // Actualizar información de paginación
    function updatePaginationInfo() {
        const visibleRows = document.querySelectorAll('#ordersTable tbody tr:not([style*="display: none"])').length;
        const totalRows = document.querySelectorAll('#ordersTable tbody tr').length;
        const entriesPerPage = document.getElementById('entriesPerPage').value;
        
        const paginationInfo = document.querySelector('.pagination-info');
        if (visibleRows === totalRows) {
            paginationInfo.textContent = `Showing 1 to ${Math.min(visibleRows, entriesPerPage)} of ${totalRows} entries`;
        } else {
            paginationInfo.textContent = `Showing 1 to ${Math.min(visibleRows, entriesPerPage)} of ${visibleRows} entries (filtered from ${totalRows} total entries)`;
        }
    }
    
    // Funcionalidad de paginación
    function initPagination() {
        const paginationLinks = document.querySelectorAll('.pagination .page-link');
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (!this.parentElement.classList.contains('disabled')) {
                    // Remover clase activa
                    document.querySelectorAll('.pagination .page-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Agregar clase activa al item clickeado
                    this.parentElement.classList.add('active');
                    
                    const pageNumber = this.textContent;
                    console.log(`Navegando a página: ${pageNumber}`);
                }
            });
        });
    }
    
    // Efectos hover para filas de tabla
    function initTableRowEffects() {
        const tableRows = document.querySelectorAll('#ordersTable tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.01)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                this.style.transition = 'all 0.2s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    // Animación de carga inicial
    function initLoadingAnimation() {
        const mainCard = document.querySelector('.main-card');
        const sidebar = document.querySelector('.sidebar');
        
        // Fade in de la tarjeta principal
        setTimeout(() => {
            mainCard.classList.add('fade-in');
        }, 200);
        
        // Animación escalonada del sidebar
        const sidebarItems = document.querySelectorAll('.sidebar .nav-item');
        sidebarItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 50);
            }, index * 100);
        });
    }
    
    // Funcionalidad de notificaciones
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
    
    // Simulación de datos en tiempo real
    function simulateRealTimeUpdates() {
        setInterval(() => {
            const statusBadges = document.querySelectorAll('.badge');
            const statuses = ['status-pending', 'status-completed', 'status-in-progress'];
            const statusTexts = ['Pendiente', 'Completado', 'En Progreso'];
            
            if (Math.random() > 0.95) { // 5% de probabilidad cada segundo
                const randomBadge = statusBadges[Math.floor(Math.random() * statusBadges.length)];
                const randomIndex = Math.floor(Math.random() * statuses.length);
                
                // Remover clases anteriores
                statuses.forEach(status => randomBadge.classList.remove(status));
                
                // Agregar nueva clase y texto
                randomBadge.classList.add(statuses[randomIndex]);
                randomBadge.textContent = statusTexts[randomIndex];
                
                // Efecto de brillo
                randomBadge.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    randomBadge.style.animation = '';
                }, 500);
                
                showNotification(`Estado actualizado para una orden`, 'info');
            }
        }, 1000);
    }
    
    // Validación de formularios (para cuando se agreguen)
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    showNotification('Por favor, complete todos los campos requeridos', 'warning');
                }
                form.classList.add('was-validated');
            });
        });
    }
    
    // Inicializar funcionalidades adicionales
    initPagination();
    initTableRowEffects();
    initLoadingAnimation();
    initFormValidation();
    
    // Iniciar simulación de actualizaciones en tiempo real
    setTimeout(() => {
        simulateRealTimeUpdates();
    }, 5000);
    
    // Mensaje de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido al Dashboard de Support Tech!', 'success');
    }, 1000);
    
    console.log('Dashboard inicializado correctamente');
});