document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas de fondo
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 20 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }

    // Navegación activa - solo para enlaces sin href real
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo prevenir default si el href es "#" (enlaces placeholder)
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
            // Para enlaces reales (index.html, servicios.html, etc.) dejar que naveguen normalmente
        });
    });

    // Manejo del formulario de admin
    document.getElementById('adminForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const adminUser = document.getElementById('adminUser').value;
        const adminPassword = document.getElementById('adminPassword').value;
        const submitBtn = document.querySelector('.consult-btn');
        
        // Validación de campos vacíos
        if (adminUser.trim() === '' || adminPassword.trim() === '') {
            showFieldErrors(adminUser, adminPassword);
            return;
        }
        
        // Validación de credenciales (ejemplo básico)
        if (validateCredentials(adminUser, adminPassword)) {
            // Animación de éxito
            loginSuccess(submitBtn);
        } else {
            // Animación de error
            loginError(submitBtn);
        }
    });

    // Función para mostrar errores en campos
    function showFieldErrors(user, password) {
        const userInput = document.getElementById('adminUser');
        const passwordInput = document.getElementById('adminPassword');
        
        if (user.trim() === '') {
            userInput.classList.add('input-error');
            setTimeout(() => userInput.classList.remove('input-error'), 3000);
        }
        
        if (password.trim() === '') {
            passwordInput.classList.add('input-error');
            setTimeout(() => passwordInput.classList.remove('input-error'), 3000);
        }
    }

    // Función para validar credenciales (básica)
    function validateCredentials(user, password) {
        // Aquí puedes implementar tu lógica de validación real
        // Por ahora, credenciales de ejemplo:
        const validCredentials = {
            'admin': 'admin123',
            'administrador': '123456',
            'usuario': 'password'
        };
        
        return validCredentials[user] === password;
    }

    // Función para animación de login exitoso
    function loginSuccess(submitBtn) {
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Validando...';
        submitBtn.disabled = true;
        
        // Agregar animación de spin
        addSpinAnimation();
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>¡Acceso autorizado!';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                console.log('Redirecting to admin dashboard');
                // Redirigir al panel de administración
                window.location.href = 'dashboard_ordenes.html';
            }, 1500);
        }, 2000);
    }

    // Función para animación de login fallido
    function loginError(submitBtn) {
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Validando...';
        submitBtn.disabled = true;
        
        // Agregar animación de spin
        addSpinAnimation();
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="bi bi-x-circle me-2"></i>Credenciales incorrectas';
            submitBtn.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            
            // Efecto de shake en el formulario
            const formContainer = document.querySelector('.ticket-form-container');
            formContainer.style.animation = 'shake 0.5s ease-in-out';
            
            setTimeout(() => {
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'var(--gradient-cyan)';
                submitBtn.disabled = false;
                formContainer.style.animation = '';
                
                // Limpiar campos
                document.getElementById('adminPassword').value = '';
            }, 2000);
        }, 1500);
    }

    // Función para agregar animación de spin
    function addSpinAnimation() {
        const existingStyle = document.getElementById('spin-style');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'spin-style';
            style.textContent = `
                .spin { 
                    animation: spin 1s linear infinite; 
                } 
                @keyframes spin { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(360deg); } 
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0) translateY(-5px); }
                    25% { transform: translateX(-5px) translateY(-5px); }
                    75% { transform: translateX(5px) translateY(-5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Efectos en los inputs
    const inputs = document.querySelectorAll('.ticket-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.parentElement.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.parentElement.style.transform = '';
        });
    });

    // Efecto de partículas en hover del formulario
    const formContainer = document.querySelector('.ticket-form-container');
    formContainer.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, white, #f8f9ff)';
    });
    
    formContainer.addEventListener('mouseleave', function() {
        this.style.background = 'white';
    });

    // Manejo del checkbox "Recuérdame"
    const rememberCheckbox = document.getElementById('rememberMe');
    rememberCheckbox.addEventListener('change', function() {
        if (this.checked) {
            console.log('Remember me activated');
            // Aquí puedes implementar la lógica para recordar al usuario
        }
    });

    // Manejo de enlaces
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Forgot password clicked');
        // Aquí puedes implementar la lógica para recuperar contraseña
        alert('Funcionalidad de recuperación de contraseña próximamente...');
    });

    // Tecla Enter para enviar formulario
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.activeElement.closest('#adminForm')) {
            document.getElementById('adminForm').dispatchEvent(new Event('submit'));
        }
    });
});