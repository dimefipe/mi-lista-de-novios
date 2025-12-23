/**
 * EJEMPLOS DE USO - FORMULARIO DE REGISTRO
 * 
 * Este archivo contiene ejemplos prácticos de cómo interactuar
 * con el sistema de registro implementado.
 */

// ===================================================================
// 1. INICIALIZACIÓN AUTOMÁTICA
// ===================================================================

// El formulario se inicializa automáticamente al cargar la página:
// Se ejecuta dentro de assets/js/registro.js
document.addEventListener('DOMContentLoaded', () => {
  new RegistroForm();
});

// ===================================================================
// 2. ACCEDER A LA INSTANCIA DEL FORMULARIO (desde consola)
// ===================================================================

// Puedes acceder al formulario desde la consola del navegador:
// console.log(window.registroFormInstance); // Si se expone globalmente

// O de esta forma (agregar al final de registro.js):
// window.registroForm = new RegistroForm();

// ===================================================================
// 3. VALIDACIONES MANUALES (desde consola)
// ===================================================================

// Validar un email:
const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailValidation.test('usuario@dominio.com')); // true
console.log(emailValidation.test('email-invalido')); // false

// Validar teléfono chileno:
const phoneValidation = /^(\+?56)?[\s]?9[\s]?[0-9]{4}[\s]?[0-9]{4}$/;
console.log(phoneValidation.test('9 3456 7890')); // true
console.log(phoneValidation.test('+56 9 3456 7890')); // true

// Validar contraseña fuerte:
const passwordValidation = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
console.log(passwordValidation.test('Pass123!')); // true
console.log(passwordValidation.test('weak')); // false

// Validar RUT:
const rutValidation = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
console.log(rutValidation.test('12.345.678-9')); // true
console.log(rutValidation.test('12345678-9')); // false (sin puntos)

// ===================================================================
// 4. SIMULAR ENTRADA DE USUARIO (desde consola)
// ===================================================================

// Llenar email:
document.getElementById('email').value = 'usuario@example.com';
document.getElementById('email').dispatchEvent(new Event('input'));

// Llenar teléfono:
document.getElementById('phone').value = '9 3456 7890';
document.getElementById('phone').dispatchEvent(new Event('input'));

// Llenar contraseña:
document.getElementById('password').value = 'SecurePass123!';
document.getElementById('password').dispatchEvent(new Event('input'));

// ===================================================================
// 5. ACCEDER A ELEMENTOS DEL FORMULARIO
// ===================================================================

// Progress bar:
const progressBar = document.querySelector('.registro__bar');
console.log(progressBar.style.getPropertyValue('--value')); // Obtener valor actual

// Paso actual:
const activeStep = document.querySelector('.registro__step.active');
console.log(activeStep); // Ver qué paso está activo

// Campos con error:
const errorFields = document.querySelectorAll('.registro__field.error');
console.log(errorFields.length); // Cantidad de campos con error

// Botones:
const backBtn = document.querySelector('.registro__buttons .btn-secondary');
const nextBtn = document.querySelector('.registro__buttons .btn:not([type="submit"])');
const submitBtn = document.querySelector('.registro__buttons [type="submit"]');

// ===================================================================
// 6. SIMULAR NAVEGACIÓN (desde consola)
// ===================================================================

// Ir al siguiente paso (si valida):
const nextButton = document.querySelector('.registro__buttons .btn:not([type="submit"])');
nextButton.click();

// Volver al paso anterior:
const backButton = document.querySelector('.registro__buttons .btn-secondary');
backButton.click();

// Ir a paso específico (si se modifica el código):
document.querySelector('.registro__step--2').style.display = 'block';
document.querySelector('.registro__step--1').style.display = 'none';

// ===================================================================
// 7. LLENAR FORMULARIO COMPLETO DESDE CONSOLA
// ===================================================================

// PASO 1:
function llenarPaso1() {
  document.getElementById('email').value = 'novio@example.com';
  document.getElementById('phone').value = '9 8765 4321';
  document.getElementById('password').value = 'SuperPassword123!';
  
  // Disparar validación
  ['email', 'phone', 'password'].forEach(id => {
    document.getElementById(id).dispatchEvent(new Event('blur'));
  });
  
  console.log('Paso 1 completado');
}

// PASO 2:
function llenarPaso2() {
  document.querySelector('select[name="banco"]').value = '#';
  document.querySelector('select[name="banco"]').dispatchEvent(new Event('blur'));
  
  // ... llenar otros campos
  console.log('Paso 2 completado');
}

// PASO 3:
function llenarPaso3() {
  document.getElementById('user_name').value = 'Juan';
  document.getElementById('user_lastname').value = 'García';
  document.getElementById('partner_name').value = 'María';
  document.getElementById('partner_lastname').value = 'López';
  document.getElementById('event_date').value = '2025-12-31';
  document.getElementById('terms_conditions').checked = true;
  
  console.log('Paso 3 completado');
}

// Ejecutar todo:
llenarPaso1();
// ... esperar validación
// llenarPaso2();
// ... esperar validación
// llenarPaso3();

// ===================================================================
// 8. MONITOREAR CAMBIOS DE CAMPOS
// ===================================================================

// Ver cuando un campo cambia:
const emailInput = document.getElementById('email');
emailInput.addEventListener('input', (e) => {
  console.log('Email cambió a:', e.target.value);
});

// Ver cuando un campo pierde el foco:
emailInput.addEventListener('blur', (e) => {
  console.log('Email perdió el foco:', e.target.value);
});

// Ver todos los cambios del formulario:
const form = document.querySelector('.registro__form');
form.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
    console.log(`${e.target.name}: ${e.target.value}`);
  }
});

// ===================================================================
// 9. OBTENER DATOS DEL FORMULARIO
// ===================================================================

// Crear FormData desde el formulario:
const form = document.querySelector('.registro__form');
const formData = new FormData(form);

// Convertir a objeto:
const datos = Object.fromEntries(formData);
console.log(dados);

// Obtener valores específicos:
const emailValue = formData.get('email');
const phoneValue = formData.get('phone');
const passwordValue = formData.get('password');

console.log({
  email: emailValue,
  phone: phoneValue,
  password: passwordValue
});

// ===================================================================
// 10. ENVIAR DATOS AL SERVIDOR
// ===================================================================

// Reemplazar la función submitForm en registro.js:
async function enviarAlServidor(datos) {
  try {
    const response = await fetch('/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Registro exitoso:', result);
      alert('¡Registro completado! Revisa tu email.');
    } else {
      console.error('Error del servidor:', result);
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error al enviar:', error);
    alert('Error de conexión');
  }
}

// ===================================================================
// 11. CREAR VALIDACIÓN PERSONALIZADA
// ===================================================================

// Agregar validación para RUT automatizada:
function validarRut(rut) {
  // Remover puntos y guión
  const rutLimpio = rut.replace(/[.-]/g, '');
  
  if (rutLimpio.length !== 9) return false;
  
  const numeros = rutLimpio.slice(0, -1);
  const verificador = rutLimpio.slice(-1).toUpperCase();
  
  // Calcular dígito verificador (Algoritmo chileno)
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numeros.length - 1; i >= 0; i--) {
    suma += parseInt(numeros[i]) * multiplicador;
    multiplicador++;
    if (multiplicador > 7) multiplicador = 2;
  }
  
  const resto = 11 - (suma % 11);
  let digito = String(resto);
  
  if (resto === 11) digito = '0';
  if (resto === 10) digito = 'K';
  
  return digito === verificador;
}

// Pruebas:
console.log(validarRut('12.345.678-9')); // Resultado dependiendo del RUT
console.log(validarRut('19.765.432-K')); // Resultado dependiendo del RUT

// ===================================================================
// 12. EXPORTAR DATOS A JSON
// ===================================================================

// Descargar datos como JSON:
function descargarDatos() {
  const form = document.querySelector('.registro__form');
  const formData = new FormData(form);
  const datos = Object.fromEntries(formData);
  
  const dataStr = JSON.stringify(datos, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'registro_' + new Date().getTime() + '.json';
  link.click();
}

// Usar: descargarDatos();

// ===================================================================
// 13. RESETEAR FORMULARIO
// ===================================================================

// Limpiar todo:
function limpiarFormulario() {
  const form = document.querySelector('.registro__form');
  form.reset();
  
  // Limpiar estados de validación:
  document.querySelectorAll('.registro__field').forEach(field => {
    field.classList.remove('error', 'success');
    const error = field.querySelector('.registro__field--error');
    if (error) error.textContent = '';
  });
  
  console.log('Formulario limpiado');
}

// ===================================================================
// 14. GUARDAR PROGRESO EN LOCAL STORAGE
// ===================================================================

// Guardar automáticamente:
function guardarProgreso() {
  const form = document.querySelector('.registro__form');
  const formData = new FormData(form);
  const datos = Object.fromEntries(formData);
  
  localStorage.setItem('registro_progreso', JSON.stringify(datos));
  console.log('Progreso guardado');
}

// Recuperar:
function recuperarProgreso() {
  const datos = localStorage.getItem('registro_progreso');
  if (!datos) return;
  
  const parsed = JSON.parse(datos);
  Object.keys(parsed).forEach(key => {
    const element = document.querySelector(`[name="${key}"]`);
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = parsed[key] === 'on';
      } else {
        element.value = parsed[key];
      }
    }
  });
  
  console.log('Progreso recuperado');
}

// Ejecutar al cargar:
document.addEventListener('DOMContentLoaded', recuperarProgreso);

// Guardar cada vez que cambie:
document.querySelector('.registro__form').addEventListener('change', guardarProgreso);

// ===================================================================
// 15. DEBUG - VER TODO EN CONSOLA
// ===================================================================

// Función debug completa:
function debugFormulario() {
  console.group('=== DEBUG FORMULARIO ===');
  
  // Paso actual
  const activeStep = document.querySelector('.registro__step.active');
  console.log('Paso actual:', activeStep?.className);
  
  // Campos con error
  const errorFields = document.querySelectorAll('.registro__field.error');
  console.log('Campos con error:', errorFields.length);
  errorFields.forEach(f => console.log('  -', f.querySelector('label')?.textContent));
  
  // Datos del formulario
  const form = document.querySelector('.registro__form');
  const formData = new FormData(form);
  console.log('Datos:', Object.fromEntries(formData));
  
  // Progress bar
  const progressBar = document.querySelector('.registro__bar');
  const value = progressBar.style.getPropertyValue('--value');
  console.log('Progreso:', value);
  
  // Botones visibles
  console.log('Botones:');
  console.log('  - Atrás:', document.querySelector('.btn-secondary').style.display);
  console.log('  - Siguiente:', document.querySelector('.btn:not([type="submit"])').style.display);
  console.log('  - Finalizar:', document.querySelector('[type="submit"]').style.display);
  
  console.groupEnd();
}

// Usar: debugFormulario(); en consola

// ===================================================================
// NOTAS FINALES
// ===================================================================

/*
Todos estos ejemplos pueden ejecutarse desde la consola del navegador
(F12 > Console tab).

Para una mejor experiencia de desarrollo:

1. Instala Chrome DevTools extensions
2. Usa el debugger nativo del navegador
3. Agrega console.log() en el código
4. Usa Breakpoints para pausar ejecución
5. Monitorea cambios con "Watch expressions"

¡Diviértete debuggeando! 🐛
*/
