# Documentación - Formulario de Registro Multi-Paso

## 📋 Resumen de Implementación

Se ha implementado un sistema completo de formulario de registro de 3 pasos con validaciones, navegación y funcionalidades interactivas.

---

## ✨ Funcionalidades Implementadas

### 1. **Navegación de Pasos**
- ✅ Sistema de 3 pasos (Crear cuenta, Información bancaria, Información personal)
- ✅ Botones "Atrás" y "Siguiente" funcionales
- ✅ El botón "Atrás" se oculta en el primer paso
- ✅ El botón "Siguiente" se oculta en el último paso
- ✅ El botón "Finalizar" aparece solo en el paso 3

### 2. **Progress Bar (Barra de Progreso)**
- ✅ Actualización visual en tiempo real
- ✅ Muestra "1 de 3", "2 de 3", "3 de 3"
- ✅ Avanza hacia la izquierda (antihorario)
- ✅ Color verde (#7CDAA9) para el progreso
- ✅ Color oscuro (#1f2937) para el resto

### 3. **Mostrar/Ocultar Contraseña (Password Toggle)**
- ✅ Ícono de ojo para alternar visibilidad
- ✅ Cambia el tipo de input entre "password" y "text"
- ✅ Ícono visual cambia cuando se muestra la contraseña
- ✅ Funciona en todos los campos de contraseña

### 4. **Validaciones Completas**

#### Email
- Valida formato correcto (usuario@dominio.com)
- Requerido en paso 1

#### Teléfono
- Soporta formato chileno: +56 9 XXXX XXXX
- Valida que sea un número de teléfono válido

#### Contraseña
- Mínimo 8 caracteres
- Debe contener al menos:
  - Una mayúscula
  - Un número
  - Un carácter especial (!@#$%^&*)

#### Banco y Tipo de Cuenta
- Validación de que esté seleccionado
- No puede estar vacío

#### Número de Cuenta
- Mínimo 8 dígitos
- Solo números

#### RUT del Titular
- Formato: XX.XXX.XXX-K (ej: 12.345.678-9)
- Validación de formato específico

#### Nombres y Apellidos
- Mínimo 2 caracteres
- Solo letras y espacios
- Se valida en pasos 3

#### Fecha del Evento
- Debe ser una fecha en el futuro
- No puede ser fecha pasada

#### Términos y Condiciones
- Checkbox obligatorio en paso 3
- Debe estar marcado para continuar

### 5. **Validación en Tiempo Real**
- ✅ Valida al perder el foco (blur)
- ✅ Si el campo tiene error, valida mientras se escribe
- ✅ Muestra mensaje de error específico
- ✅ Elimina mensaje de error cuando se corrige

### 6. **Estados de Campos**

```css
.registro__field.error { /* Campo con error */ }
.registro__field.success { /* Campo válido */ }
```

- Error: Borde rojo, ícono de error, mensaje en rojo
- Success: Borde verde, sin error, campo válido
- Normal: Borde gris neutro

---

## 🏗️ Estructura HTML

### Pasos
```html
<div class="registro__step registro__step--1">
  <!-- Campos paso 1 -->
</div>
<div class="registro__step registro__step--2">
  <!-- Campos paso 2 -->
</div>
<div class="registro__step registro__step--3">
  <!-- Campos paso 3 -->
</div>
```

### Campos
```html
<div class="registro__field">
  <label for="campo">Etiqueta</label>
  <div class="registro__in">
    <svg><!-- Ícono --></svg>
    <input type="text" id="campo" name="campo" required>
  </div>
  <p class="registro__field--error">Mensaje de error</p>
</div>
```

### Password Toggle
```html
<div class="registro__in">
  <svg><!-- Ícono cerrado --></svg>
  <input type="password" id="password" name="password">
  <div class="show-hidden">
    <svg><!-- Ícono ojo --></svg>
  </div>
</div>
```

---

## 📱 Estructura del JavaScript

### Clase Principal: `RegistroForm`

#### Constructor
```javascript
constructor() {
  this.currentStep = 1;
  this.totalSteps = 3;
  this.validations = { /* ... */ };
}
```

#### Métodos Principales

**`init()`**
- Inicializa el formulario
- Configura listeners de eventos
- Actualiza la barra de progreso

**`setupEventListeners()`**
- Configura botones de navegación
- Configura validación en tiempo real
- Configura password toggle

**`setupPasswordToggle()`**
- Permite mostrar/ocultar contraseñas
- Cambia el ícono del ojo

**`validateField(field)`**
- Valida un campo específico
- Retorna true/false
- Muestra mensaje de error

**`validateCurrentStep()`**
- Valida todos los campos del paso actual
- Retorna true si todos son válidos

**`nextStep()` / `prevStep()`**
- Navega entre pasos
- Actualiza el progress bar

**`displayStep(step)`**
- Muestra el paso especificado
- Actualiza información del paso
- Actualiza visibilidad de botones

**`updateProgressBar()`**
- Actualiza la variable CSS `--value`
- Cambia el porcentaje del progress bar

**`submitForm()`**
- Valida el último paso
- Recolecta datos del formulario
- Envía al servidor (opcional)

---

## 🎨 CSS - Clases Relevantes

```css
.registro__form { /* Contenedor del formulario */ }
.registro__steps { /* Contenedor de progreso */ }
.registro__bar { /* Progress bar circular */ }
.registro__step { /* Cada paso */ }
.registro__step.active { /* Paso activo */ }
.registro__field { /* Cada campo */ }
.registro__field.error { /* Campo con error */ }
.registro__field.success { /* Campo válido */ }
.registro__in { /* Contenedor de input */ }
.show-hidden { /* Botón mostrar/ocultar */ }
.registro__buttons { /* Botones de navegación */ }
```

---

## 📊 Flujo de Validación

```
Usuario ingresa dato
    ↓
Al perder foco: Validar campo
    ↓
¿Válido?
  ├─ SÍ → Mostrar success, eliminar error
  └─ NO → Mostrar error, bloquear progreso
    ↓
Usuario intenta siguiente
    ↓
¿Todos los campos del paso válidos?
  ├─ SÍ → Permitir ir al siguiente paso
  └─ NO → Mostrar errores, no avanzar
```

---

## 🔧 Cómo Usar

### 1. Inicializar
El formulario se inicializa automáticamente al cargar la página:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  new RegistroForm();
});
```

### 2. Agregar Validación Personalizada
En el objeto `validations` de la clase:
```javascript
this.validations = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Por favor ingresa un email válido'
  }
};
```

### 3. Agregar Nuevo Campo
1. Agregar HTML en el paso correspondiente
2. El JavaScript detecta automáticamente el tipo (email, tel, etc.)
3. Aplicar validación según el nombre del campo

### 4. Personalizar Mensajes
Los mensajes de error se encuentran en el objeto `validations`.

---

## 🚀 Características Avanzadas

### Validación de RUT Chileno
```javascript
fieldName.toLowerCase().includes('rut')
// Válido: XX.XXX.XXX-K
```

### Validación de Fecha
- Debe ser mayor a la fecha actual
- Formato HTML5 date input

### Validación de Checkbox
- Soporta checkboxes con validación de requerimiento

### Campos Condicionales
- Se pueden mostrar/ocultar pasos según necesidad

---

## 🐛 Debugging

### Consola del Navegador
```javascript
// Ver datos antes de enviar
console.log('Datos del formulario:', Object.fromEntries(formData));
```

### Ver Validaciones
El formulario mostrará mensajes de error específicos para cada campo.

---

## 📝 Campos por Paso

### Paso 1: Crear una Cuenta
- Email (email)
- Teléfono (tel)
- Contraseña (password)

### Paso 2: Información Bancaria
- Selecciona tu banco (select)
- Tipo de cuenta (select)
- Número de cuenta (text)
- Nombre del titular (text)
- RUT del titular (text)
- Email del titular (email)

### Paso 3: Información Personal
- Tu nombre (text)
- Tu apellido (text)
- Nombre del novio/a (text)
- Apellido del novio/a (text)
- Fecha del evento (date)
- Acepto los términos (checkbox)

---

## ✅ Checklist de Implementación

- [x] Navegación entre pasos
- [x] Progress bar funcionando
- [x] Password toggle visible
- [x] Validaciones en tiempo real
- [x] Validación antes de siguiente paso
- [x] Mensajes de error específicos
- [x] Campos requeridos
- [x] Validación de email
- [x] Validación de teléfono
- [x] Validación de contraseña fuerte
- [x] Validación de RUT
- [x] Validación de fecha
- [x] Validación de checkbox
- [x] Pasos se actualizan correctamente
- [x] Botones se muestran/ocultan según paso
- [x] Submit del formulario

---

## 🔐 Seguridad

- Las validaciones se hacen en frontend (para UX)
- **IMPORTANTE**: Agregar validaciones en backend
- Nunca confiar solo en validación frontend
- Encriptar datos sensibles en tránsito

---

## 📦 Archivos Modificados

- `assets/js/registro.js` - Sistema completo de validación y navegación
- `registro.html` - Estructura del formulario (sin cambios mayores)
- `assets/css/main.css` - Estilos del progress bar y campos (ya incluidos)

---

## 🎯 Próximas Mejoras Sugeridas

1. Agregar autocomplete en banco
2. Formateo automático de RUT
3. Guardar progreso en localStorage
4. Envío de datos a servidor
5. Confirmación por email
6. Pruebas unitarias
7. Animaciones en transiciones de pasos
8. Responsivo en móviles

---

## 📞 Contacto y Soporte

Para problemas o mejoras, revisar la consola del navegador para mensajes de error específicos.
