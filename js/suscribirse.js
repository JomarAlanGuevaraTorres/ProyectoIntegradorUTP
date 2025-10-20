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

    // Referencias a elementos del formulario
    const form = document.getElementById('registrationForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('clientEmail');
    const passwordInput = document.getElementById('clientPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const termsCheckbox = document.getElementById('acceptTerms');
    const newsletterCheckbox = document.getElementById('acceptNewsletter');

    // Toggle de contraseña
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const icon = this.querySelector('i');
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });

    // Validación de fuerza de contraseña
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        updatePasswordStrength(password);
        
        // Validar confirmación de contraseña si ya tiene valor
        if (confirmPasswordInput.value) {
            validatePasswordMatch();
        }
    });

    // Validación de confirmación de contraseña
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // Validación de email en tiempo real
    emailInput.addEventListener('blur', function() {
        validateEmail(this.value);
    });

    // Validación de nombre completo
    fullNameInput.addEventListener('blur', function() {
        validateFullName(this.value);
    });

    // Función para actualizar la fuerza de la contraseña
    function updatePasswordStrength(password) {
        const strengthFill = document.getElementById('passwordStrengthFill');
        const strengthText = document.getElementById('passwordStrengthText');
        
        const strength = calculatePasswordStrength(password);
        
        // Limpiar clases anteriores
        strengthFill.className = 'password-strength-fill';
        strengthText.className = 'password-strength-text';
        
        if (password.length === 0) {
            strengthText.textContent = 'Ingresa una contraseña';
            return;
        }
        
        switch (strength.level) {
            case 'weak':
                strengthFill.classList.add('password-strength-weak');
                strengthText.classList.add('weak');
                strengthText.textContent = 'Muy débil - ' + strength.feedback;
                break;
            case 'fair':
                strengthFill.classList.add('password-strength-fair');
                strengthText.classList.add('fair');
                strengthText.textContent = 'Débil - ' + strength.feedback;
                break;
            case 'good':
                strengthFill.classList.add('password-strength-good');
                strengthText.classList.add('good');
                strengthText.textContent = 'Buena - ' + strength.feedback;
                break;
            case 'strong':
                strengthFill.classList.add('password-strength-strong');
                strengthText.classList.add('strong');
                strengthText.textContent = '¡Excelente! Contraseña segura';
                break;
        }
    }

    // Función para calcular la fuerza de la contraseña
    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        // Longitud
        if (password.length >= 8) score += 1;
        else feedback.push('mínimo 8 caracteres');
        
        // Mayúsculas
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('una mayúscula');
        
        // Minúsculas
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('una minúscula');
        
        // Números
        if (/\d/.test(password)) score += 1;
        else feedback.push('un número');
        
        // Caracteres especiales
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
        else feedback.push('un símbolo');
        
        let level;
        if (score <= 1) level = 'weak';
        else if (score <= 2) level = 'fair';
        else if (score <= 3) level = 'good';
        else level = 'strong';
        
        const feedbackText = feedback.length > 0 ? 
            'Necesita: ' + feedback.slice(0, 2).join(', ') : 
            'Muy segura';
        
        return { level, feedback: feedbackText };
    }

    // Función para validar coincidencia de contraseñas
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            confirmPasswordInput.classList.remove('is-valid', 'is-invalid');
            return;
        }
        
        if (password === confirmPassword) {
            confirmPasswordInput.classList.remove('is-invalid');
            confirmPasswordInput.classList.add('is-valid');
        } else {
            confirmPasswordInput.classList.remove('is-valid');
            confirmPasswordInput.classList.add('is-invalid');
        }
    }

    // Función para validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            emailInput.classList.remove('is-valid', 'is-invalid');
            return;
        }
        
        if (emailRegex.test(email)) {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        } else {
            emailInput.classList.remove('is-valid');
            emailInput.classList.add('is-invalid');
        }
    }

    // Función para validar nombre completo
    function validateFullName(name) {
        if (name === '') {
            fullNameInput.classList.remove('is-valid', 'is-invalid');
            return;
        }
        
        // Al menos 2 palabras y mínimo 3 caracteres
        if (name.trim().split(' ').length >= 2 && name.length >= 3) {
            fullNameInput.classList.remove('is-invalid');
            fullNameInput.classList.add('is-valid');
        } else {
            fullNameInput.classList.remove('is-valid');
            fullNameInput.classList.add('is-invalid');
        }
    }

    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar todos los campos
        const isValid = validateAllFields();
        
        if (isValid) {
            processRegistration();
        } else {
            // Scroll al primer campo con error
            const firstInvalid = document.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });

    // Función para validar todos los campos
    function validateAllFields() {
        let isValid = true;
        
        // Validar nombre
        validateFullName(fullNameInput.value);
        if (fullNameInput.classList.contains('is-invalid') || 
            !fullNameInput.classList.contains('is-valid')) {
            fullNameInput.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validar email
        validateEmail(emailInput.value);
        if (emailInput.classList.contains('is-invalid') || 
            !emailInput.classList.contains('is-valid')) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validar contraseña
        const passwordStrength = calculatePasswordStrength(passwordInput.value);
        if (passwordStrength.level === 'weak' || passwordInput.value.length < 8) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        } else {
            passwordInput.classList.remove('is-invalid');
            passwordInput.classList.add('is-valid');
        }
        
        // Validar confirmación de contraseña
        validatePasswordMatch();
        if (confirmPasswordInput.classList.contains('is-invalid')) {
            isValid = false;
        }
        
        // Validar términos
        if (!termsCheckbox.checked) {
            termsCheckbox.classList.add('is-invalid');
            isValid = false;
        } else {
            termsCheckbox.classList.remove('is-invalid');
        }
        
        return isValid;
    }

    // Función para procesar el registro
    function processRegistration() {
        const submitBtn = document.querySelector('.consult-btn');
        const originalText = submitBtn.innerHTML;
        
        // Animación de procesamiento
        submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>Creando cuenta...';
        submitBtn.disabled = true;
        
        // Agregar animación de spin
        addSpinAnimation();
        
        // Datos del formulario
        const formData = {
            fullName: fullNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            newsletter: newsletterCheckbox.checked
        };
        
        // Simular proceso de registro
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>¡Registrado con éxito!';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            console.log('User registered:', formData);
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                removeSpinAnimation();
            }, 2000);
        }, 2000);
    }
});