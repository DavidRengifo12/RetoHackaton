# 🎨 Instrucciones de Configuración de Toasts

## 📦 Instalación

```bash
cd Frontend
npm install
```

Esto instalará `react-toastify` que ya está en `package.json`.

---

## ✅ Configuración Completada

### 1. ToastContainer configurado en App.jsx
- ✅ Importado `react-toastify` y estilos CSS
- ✅ ToastContainer agregado con configuración óptima

### 2. Servicio de Toasts creado
- ✅ `src/utils/toastService.js` - Servicio centralizado de toasts

### 3. Servicios actualizados con Toasts

#### ✅ `authService.js`
- **Registro**: Toast de éxito al registrar usuario
- **Login**: Toast de éxito al iniciar sesión
- **Logout**: Toast de éxito al cerrar sesión
- **Errores**: Toasts de error para todas las acciones

#### ✅ `salesService.js`
- **Crear venta**: Toast de éxito con detalles de la venta
- **Cargar ventas masivas**: Toast de éxito con resumen
- **Errores**: Toasts de error para todas las acciones

#### ✅ `recommendationsService.js`
- **Obtener recomendaciones**: Toast de advertencia si hay recomendaciones de alta prioridad
- **Marcar como leída**: Toast de éxito
- **Resolver**: Toast de éxito
- **Errores**: Toasts de error para todas las acciones

#### ✅ `uploadService.js` (integrado en UploadPage)
- **Cargar archivo**: Toasts informativos durante el proceso
- **Éxito**: Toast de éxito con resumen
- **Errores**: Toasts de error con detalles

---

## 🎯 Uso de Toasts

Los toasts se muestran automáticamente en las siguientes acciones:

### Registro de Usuario
```javascript
// En RegisterPage.jsx
const result = await authService.signUp(email, password, nombreCompleto);
// Toast automático: "Usuario registrado exitosamente. Rol asignado: usuario"
```

### Inicio de Sesión
```javascript
// En LoginPage.jsx
const result = await authService.signIn(email, password);
// Toast automático: "Sesión iniciada correctamente. Rol: usuario"
```

### Crear Venta
```javascript
// En cualquier componente
const result = await salesService.createSale(ventaData);
// Toast automático con detalles de la venta
```

### Cargar Datos CSV/Excel
```javascript
// En UploadPage.jsx
const result = await salesService.createBulkSales(ventas);
// Toast automático con resumen de carga
```

### Obtener Recomendaciones
```javascript
// En Recommendations.jsx
const result = await recommendationsService.getRecommendations();
// Toast automático si hay recomendaciones de alta prioridad
```

---

## 🎨 Personalización de Toasts

Puedes personalizar los toasts editando `src/utils/toastService.js`:

```javascript
// Cambiar posición
position: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center"

// Cambiar duración
autoClose: 3000 // milisegundos

// Cambiar tema
theme: "light" | "dark" | "colored"
```

---

## ✅ Checklist de Verificación

- [x] react-toastify instalado
- [x] ToastContainer configurado en App.jsx
- [x] Servicio de toasts creado
- [x] Toasts integrados en authService
- [x] Toasts integrados en salesService
- [x] Toasts integrados en recommendationsService
- [x] Toasts integrados en UploadPage
- [x] Estilos CSS importados

---

**¡Toasts configurados y funcionando! 🎉**

