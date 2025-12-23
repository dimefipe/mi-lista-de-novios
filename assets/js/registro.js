/**
 * REGISTRO.JS - Sistema de formulario multi-paso con validaciones
 * Funcionalidades:
 * - Navegación entre pasos (1, 2, 3)
 * - Progreso visual del progress bar
 * - Mostrar/ocultar contraseña
 * - Validaciones en tiempo real
 * - Manejo de estados (error, success)
 * - Submit del formulario
 */

class RegistroForm {
    constructor() {
        this.form = document.querySelector('.registro__form');
        this.currentStep = 1;
        this.totalSteps = 3;
        
        // Elementos DOM
        this.progressBar = document.querySelector('.registro__bar');
        this.progressText = document.querySelector('.registro__bar span');
        this.stepsContainer = document.querySelector('.registro__form--container');
        
        // Obtener botones de manera más confiable
        const buttonContainer = document.querySelector('.registro__buttons');
        const allButtons = buttonContainer ? Array.from(buttonContainer.querySelectorAll('button')) : [];
        
        this.buttons = {
            back: allButtons.find(btn => btn.classList.contains('btn-secondary')),
            next: allButtons.find(btn => !btn.classList.contains('btn-secondary') && btn.getAttribute('type') !== 'submit'),
            submit: allButtons.find(btn => btn.getAttribute('type') === 'submit')
        };
        
        // Configuración de validaciones
        this.validations = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Por favor ingresa un email válido'
            },
            password: {
                minLength: 8,
                pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
            },
            phone: {
                pattern: /^(\+?56)?[\s]?9[\s]?[0-9]{4}[\s]?[0-9]{4}$/,
                message: 'Por favor ingresa un teléfono válido'
            },
            name: {
                minLength: 2,
                pattern: /^[a-záéíóúñ\s]+$/i,
                message: 'El nombre debe contener solo letras'
            },
            rut: {
                pattern: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
                message: 'Por favor ingresa un RUT válido (ej: 12.345.678-9)'
            },
            accountNumber: {
                minLength: 8,
                pattern: /^\d+$/,
                message: 'Por favor ingresa un número de cuenta válido'
            },
            date: {
                message: 'Por favor selecciona una fecha válida'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateProgressBar();
        this.displayStep(this.currentStep);
    }
    
    setupEventListeners() {
        // Botones de navegación
        if (this.buttons.back) {
            this.buttons.back.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStep();
            });
        }
        
        if (this.buttons.next) {
            this.buttons.next.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateCurrentStep()) {
                    this.nextStep();
                }
            });
        }
        
        if (this.buttons.submit) {
            this.buttons.submit.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateCurrentStep()) {
                    this.submitForm();
                }
            });
        }
        
        // Password visibility toggle
        this.setupPasswordToggle();
        
        // Validaciones en tiempo real
        this.setupRealTimeValidation();
    }
    
    setupPasswordToggle() {
        const passwordInputs = this.form.querySelectorAll('input[type="password"]');
        
        passwordInputs.forEach(input => {
            const container = input.closest('.registro__in');
            if (!container) return;
            
            const toggleBtn = container.querySelector('.show-hidden');
            if (!toggleBtn) return;
            
            // Crear SVG para mostrar contraseña (oculto)
            const hideIcon = toggleBtn.innerHTML;
            const showIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925Z"></path></svg>`;
            
            let isPasswordVisible = false;
            
            toggleBtn.addEventListener('click', () => {
                isPasswordVisible = !isPasswordVisible;
                
                if (isPasswordVisible) {
                    input.type = 'text';
                    toggleBtn.classList.add('visible');
                    toggleBtn.innerHTML = showIcon;
                } else {
                    input.type = 'password';
                    toggleBtn.classList.remove('visible');
                    toggleBtn.innerHTML = hideIcon;
                }
            });
        });
    }
    
    setupRealTimeValidation() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                if (field.closest('.registro__field').classList.contains('error')) {
                    this.validateField(field);
                }
            });
        });
        
        // Setup RUT mask and validation
        this.setupRutMask();
    }
    
    setupRutMask() {
        const rutInput = this.form.querySelector('input[name="rut_titular"]');
        if (!rutInput) return;
        
        rutInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase().replace(/[^0-9K]/g, '');
            
            // Limitar a máximo 9 caracteres (8 dígitos + 1 verificador)
            if (value.length > 9) {
                value = value.slice(0, 9);
            }
            
            // Formatear según la longitud
            let formatted = value;
            if (value.length > 0) {
                if (value.length <= 2) {
                    formatted = value;
                } else if (value.length <= 5) {
                    formatted = value.slice(0, 2) + '.' + value.slice(2);
                } else if (value.length <= 8) {
                    formatted = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5);
                } else {
                    formatted = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5, 8) + '-' + value.slice(8);
                }
            }
            
            e.target.value = formatted;
        });
        
        rutInput.addEventListener('blur', (e) => {
            // Validar RUT cuando se sale del campo
            const rut = e.target.value.replace(/[^0-9K]/g, '');
            if (rut.length === 9) {
                const digitos = rut.slice(0, 8);
                const verificador = rut.slice(8).toUpperCase();
                const calculado = this.calcularDigitoVerificador(digitos);
                
                if (verificador !== calculado) {
                    const fieldContainer = rutInput.closest('.registro__field');
                    this.setFieldError(fieldContainer, 'El RUT ingresado es inválido. Verifica el dígito verificador');
                }
            }
        });
    }
    
    calcularDigitoVerificador(rut) {
        const multiplicadores = [2, 3, 4, 5, 6, 7];
        let suma = 0;
        
        // Invertir RUT y multiplicar por secuencia
        for (let i = 0; i < rut.length; i++) {
            const digito = parseInt(rut[rut.length - 1 - i]);
            const multiplicador = multiplicadores[i % 6];
            suma += digito * multiplicador;
        }
        
        const resto = suma % 11;
        const verificador = 11 - resto;
        
        if (verificador === 11) return '0';
        if (verificador === 10) return 'K';
        return verificador.toString();
    }
    
    
    validateField(field) {
        const fieldContainer = field.closest('.registro__field');
        if (!fieldContainer) return true;
        
        const fieldType = field.getAttribute('type') || field.tagName.toLowerCase();
        const fieldName = field.getAttribute('name') || field.id;
        const value = field.value.trim();
        
        // No validar campos vacíos que no sean requeridos
        if (!value && !field.hasAttribute('required')) {
            this.clearFieldError(fieldContainer);
            return true;
        }
        
        // Validar si el campo es requerido y está vacío
        if (!value && field.hasAttribute('required')) {
            this.setFieldError(fieldContainer, 'Este campo es requerido');
            return false;
        }
        
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones según tipo de campo
        if (fieldType === 'email') {
            const emailValidation = this.validations.email;
            if (!emailValidation.pattern.test(value)) {
                isValid = false;
                errorMessage = emailValidation.message;
            }
        } else if (field.name === 'password' || fieldType === 'password') {
            const passwordValidation = this.validations.password;
            if (value.length < passwordValidation.minLength) {
                isValid = false;
                errorMessage = `La contraseña debe tener al menos ${passwordValidation.minLength} caracteres`;
            } else if (!passwordValidation.pattern.test(value)) {
                isValid = false;
                errorMessage = passwordValidation.message;
            }
        } else if ((field.name === 'banco' || field.name === 'tipo_cuenta') && fieldType === 'select') {
            if (!value) {
                isValid = false;
                errorMessage = `Por favor selecciona una opción`;
            }
        } else if (fieldName.toLowerCase().includes('phone') || fieldName.toLowerCase().includes('telefono')) {
            const phoneValidation = this.validations.phone;
            if (!phoneValidation.pattern.test(value)) {
                isValid = false;
                errorMessage = phoneValidation.message;
            }
        } else if (fieldName.toLowerCase().includes('name') || fieldName.toLowerCase().includes('nombre')) {
            const nameValidation = this.validations.name;
            if (value.length < nameValidation.minLength) {
                isValid = false;
                errorMessage = `El nombre debe tener al menos ${nameValidation.minLength} caracteres`;
            } else if (!nameValidation.pattern.test(value)) {
                isValid = false;
                errorMessage = nameValidation.message;
            }
        } else if (fieldName.toLowerCase().includes('rut')) {
            // Validar RUT con formato XX.XXX.XXX-K
            const rutClean = value.replace(/[^0-9K]/g, '').toUpperCase();
            if (rutClean.length === 9) {
                const digitos = rutClean.slice(0, 8);
                const verificador = rutClean.slice(8);
                const calculado = this.calcularDigitoVerificador(digitos);
                
                if (verificador !== calculado) {
                    isValid = false;
                    errorMessage = 'El RUT ingresado es inválido. Verifica el dígito verificador';
                }
            } else if (rutClean.length > 0 && rutClean.length < 9) {
                isValid = false;
                errorMessage = 'El RUT debe tener 9 caracteres (incluyendo el dígito verificador)';
            }
        } else if (fieldName.toLowerCase().includes('account') || fieldName.toLowerCase().includes('cuenta') || fieldName.toLowerCase().includes('numero_cuenta')) {
            const accountValidation = this.validations.accountNumber;
            if (value.length < accountValidation.minLength) {
                isValid = false;
                errorMessage = accountValidation.message;
            } else if (!accountValidation.pattern.test(value)) {
                isValid = false;
                errorMessage = accountValidation.message;
            }
        } else if (fieldType === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'La fecha del evento debe ser en el futuro';
            }
        }
        
        // Validación de checkbox de términos
        if (field.type === 'checkbox' && fieldContainer.classList.contains('terminos')) {
            if (!field.checked) {
                isValid = false;
                errorMessage = 'Debes aceptar los términos y condiciones';
            }
        }
        
        if (!isValid) {
            this.setFieldError(fieldContainer, errorMessage);
        } else {
            this.clearFieldError(fieldContainer);
        }
        
        return isValid;
    }
    
    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.registro__step--${this.currentStep}`);
        if (!currentStepElement) return true;
        
        const fieldsInStep = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let allValid = true;
        
        fieldsInStep.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }
    
    setFieldError(fieldContainer, message) {
        fieldContainer.classList.remove('success');
        fieldContainer.classList.add('error');
        
        const errorElement = fieldContainer.querySelector('.registro__field--error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    clearFieldError(fieldContainer) {
        fieldContainer.classList.remove('error');
        
        const errorElement = fieldContainer.querySelector('.registro__field--error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.displayStep(this.currentStep);
            this.updateProgressBar();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.displayStep(this.currentStep);
            this.updateProgressBar();
        }
    }
    
    displayStep(step) {
        // Ocultar todos los pasos
        const allSteps = this.form.querySelectorAll('.registro__step');
        allSteps.forEach(stepEl => {
            stepEl.classList.remove('active');
            stepEl.style.display = 'none';
        });
        
        // Mostrar paso actual
        const activeStep = document.querySelector(`.registro__step--${step}`);
        if (activeStep) {
            activeStep.classList.add('active');
            activeStep.style.display = 'flex';
        }
        
        // Actualizar información del paso
        this.updateStepInfo(step);
        
        // Actualizar visibilidad de botones
        this.updateButtonVisibility();
    }
    
    updateStepInfo(step) {
        const stepInfos = [
            {
                title: 'Crear una cuenta',
                description: 'Regístrate y comienza a crear tu lista de novios'
            },
            {
                title: 'Información bancaria',
                description: 'Ingresa tus datos bancarios en los que quieres recibir el dinero de tus regalos'
            },
            {
                title: 'Información personal',
                description: 'Completa tu información y la de tu pareja'
            }
        ];
        
        const info = stepInfos[step - 1];
        if (info) {
            const titleElement = this.form.querySelector('.registro__steps--info h2 span');
            const descElement = this.form.querySelector('.registro__steps--info p');
            
            if (titleElement) titleElement.textContent = info.title;
            if (descElement) descElement.textContent = info.description;
        }
    }
    
    updateButtonVisibility() {
        if (this.buttons.back) {
            this.buttons.back.style.display = this.currentStep === 1 ? 'none' : 'block';
        }
        
        if (this.buttons.next) {
            this.buttons.next.style.display = this.currentStep === this.totalSteps ? 'none' : 'block';
        }
        
        if (this.buttons.submit) {
            this.buttons.submit.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
        }
    }
    
    updateProgressBar() {
        if (!this.progressBar || !this.progressText) return;
        
        const targetPercentage = (this.currentStep / this.totalSteps) * 100;
        const currentValue = parseFloat(this.progressBar.style.getPropertyValue('--value') || 0);
        
        // Animar el valor del --value suavemente durante 0.5 segundos
        const duration = 500; // 0.5 segundos en milisegundos
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1); // 0 a 1
            
            // Interpolación lineal entre currentValue y targetPercentage
            const newValue = currentValue + (targetPercentage - currentValue) * progress;
            this.progressBar.style.setProperty('--value', newValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
        
        // Actualizar el texto inmediatamente
        this.progressText.innerHTML = `<b>${this.currentStep}</b> de ${this.totalSteps}`;
    }
    
    submitForm() {
        // Validar el último paso
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Recolectar datos del formulario
        const formData = new FormData(this.form);
        
        // Aquí puedes enviar los datos al servidor
        console.log('Formulario listo para enviar:', Object.fromEntries(formData));
        
        // Mostrar mensaje de éxito (simulado)
        alert('¡Registro completado exitosamente! Pronto recibirás un email de confirmación.');
        
        // Opcional: Enviar formulario normalmente
        // this.form.submit();
    }
}

/**
 * TESTIMONIOS CAROUSEL - Sistema automático de carrusel de testimonios
 * Funcionalidades:
 * - Rotación automática cada 6 segundos
 * - Navegación manual con botones
 * - Simulación de consumo de endpoint
 * - Animaciones fade in simplificadas
 */

// Base de datos simulada de testimonios
const testimoniosData = [
    {
        name: 'Camilo Torres',
        image: 'assets/img/profile-1.webp',
        text: 'Me ayudó mucho a organizar mejor mi boda, en una semana llené mi lista y logré enviar todas las invitaciones de forma eficiente.'
    },
    {
        name: 'Sofia Rodríguez',
        image: 'assets/img/profile-2.webp',
        text: 'Una plataforma increíble que simplificó todo el proceso. Nuestros invitados quedaron encantados con la facilidad de comprar regalos.'
    },
    {
        name: 'Javiera Morales',
        image: 'assets/img/profile-3.webp',
        text: 'Gracias a la lista de novios logramos tener exactamente lo que queríamos. El sistema es intuitivo y muy seguro.'
    },
    {
        name: 'Valentina Silva',
        image: 'assets/img/profile-1.webp',
        text: 'Excelente servicio, muy recomendado. El equipo fue muy atento y resolvió todas nuestras dudas rápidamente.'
    },
    {
        name: 'Constanza Vega',
        image: 'assets/img/profile-2.webp',
        text: 'La mejor inversión para nuestra boda. Recibimos exactamente lo que necesitábamos gracias a esta plataforma.'
    }
];

/**
 * Simula consumir un endpoint que devuelve testimonios
 * @param {number} page - Página de testimonios
 * @returns {Promise} Promesa que resuelve con datos de testimonios
 */
function fetchTestimonios(page = 1) {
    return new Promise((resolve) => {
        // Simular latencia de red (500-1000ms)
        const delay = Math.random() * 500 + 500;
        
        setTimeout(() => {
            // Simular rotación de testimonios
            const startIndex = (page - 1) % testimoniosData.length;
            const testimonios = testimoniosData[startIndex];
            
            resolve({
                success: true,
                data: testimonios,
                page: page,
                timestamp: new Date().toISOString()
            });
        }, delay);
    });
}

class TestimoniosCarousel {
    constructor() {
        this.carouselElement = document.querySelector('.registro__testimonio');
        this.cardElement = document.querySelector('.registro__testimonio--card');
        this.profileElement = document.querySelector('.registro__testimonio--profile');
        this.nameElement = this.profileElement.querySelector('p');
        // Selecciona el párrafo que es hermano del profileElement (el texto del testimonio)
        this.textElement = this.cardElement.querySelectorAll('p')[1];
        this.backButton = document.querySelector('.registro__testimonio--back');
        this.nextButton = document.querySelector('.registro__testimonio--next');
        
        this.currentPage = 1;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000; // 6 segundos
        
        this.init();
    }
    
    init() {
        if (!this.carouselElement) return;
        
        this.setupEventListeners();
        this.startAutoPlay();
    }
    
    setupEventListeners() {
        if (this.backButton) {
            this.backButton.addEventListener('click', () => this.previousTestimonio());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextTestimonio());
        }
        
        // Pausar autoplay cuando el usuario interactúa manualmente
        if (this.carouselElement) {
            this.carouselElement.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.carouselElement.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    async loadTestimonio(page) {
        try {
            const response = await fetchTestimonios(page);
            
            if (response.success) {
                this.updateTestimonioContent(response.data);
                this.currentPage = page;
            }
        } catch (error) {
            console.error('Error cargando testimonio:', error);
        }
    }
    
    updateTestimonioContent(data) {
        // Fade OUT del contenido actual (500ms)
        this.profileElement.style.opacity = '0';
        this.textElement.style.opacity = '0';
        this.profileElement.style.transition = 'opacity 0.5s ease-in-out';
        this.textElement.style.transition = 'opacity 0.5s ease-in-out';
        
        // Esperar a que termine el fade out
        setTimeout(() => {
            // Actualizar contenido
            const imgElement = this.profileElement.querySelector('img');
            
            if (imgElement) imgElement.src = data.image;
            if (this.nameElement) this.nameElement.textContent = data.name;
            if (this.textElement) this.textElement.textContent = data.text;
            
            // Fade IN del nuevo contenido (500ms)
            this.profileElement.style.opacity = '1';
            this.textElement.style.opacity = '1';
        }, 500);
    }
    
    nextTestimonio() {
        const nextPage = this.currentPage + 1;
        this.loadTestimonio(nextPage);
    }
    
    previousTestimonio() {
        const previousPage = this.currentPage > 1 ? this.currentPage - 1 : testimoniosData.length;
        this.loadTestimonio(previousPage);
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextTestimonio();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegistroForm();
    new TestimoniosCarousel();
});
