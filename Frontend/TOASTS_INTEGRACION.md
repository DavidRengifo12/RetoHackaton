# 🎨 Integración de Toasts en React

## 📋 Descripción

Esta guía explica cómo integrar notificaciones visuales (toasts) en el frontend React para notificar acciones como inicio de sesión, registro, carga de datos, ventas y recomendaciones.

---

## 📦 Instalación de Dependencias

### Opción 1: react-toastify (Recomendado)

```bash
npm install react-toastify
```

### Opción 2: react-hot-toast

```bash
npm install react-hot-toast
```

### Opción 3: sonner

```bash
npm install sonner
```

**Usaremos react-toastify en esta guía**

---

## ⚙️ Configuración Inicial

### 1. Configurar el ToastContainer en App.jsx

```javascript
// src/App.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      {/* Tu contenido de la aplicación */}
      <Routes>
        {/* ... */}
      </Routes>
      
      {/* Container de toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
```

### 2. Crear servicio de toasts personalizado

```javascript
// src/utils/toastService.js
import { toast } from 'react-toastify';

export const toastService = {
  // Éxito
  success: (mensaje) => {
    toast.success(mensaje, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Error
  error: (mensaje) => {
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Información
  info: (mensaje) => {
    toast.info(mensaje, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Advertencia
  warning: (mensaje) => {
    toast.warning(mensaje, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
};
```

---

## 🔐 Autenticación con Toasts

### Registro de Usuario

```javascript
// src/services/authService.js
import { supabase } from './supabase';
import { toastService } from '../utils/toastService';

export const authService = {
  async signUp(email, password, nombreCompleto) {
    try {
      toastService.info('Registrando usuario...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: nombreCompleto
          }
        }
      });

      if (error) throw error;

      // El trigger automáticamente creará el usuario en la tabla usuarios
      // y le asignará el rol "usuario común"
      
      toastService.success('Usuario registrado exitosamente. Rol asignado: usuario común');
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al registrar usuario: ' + error.message);
      return { data: null, error };
    }
  },

  async signIn(email, password) {
    try {
      toastService.info('Iniciando sesión...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Obtener información del usuario y su rol
      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('*, roles_usuario(*)')
        .eq('id', data.user.id)
        .single();

      const rolNombre = usuarioData?.roles_usuario?.nombre || 'usuario común';
      
      toastService.success(`Sesión iniciada correctamente. Rol: ${rolNombre}`);
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al iniciar sesión: ' + error.message);
      return { data: null, error };
    }
  },

  async signOut() {
    try {
      toastService.info('Cerrando sesión...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      toastService.success('Sesión cerrada correctamente');
      
      return { error: null };
    } catch (error) {
      toastService.error('Error al cerrar sesión: ' + error.message);
      return { error };
    }
  },
};
```

---

## 📦 Productos con Toasts

### Crear Producto

```javascript
// src/services/productService.js
import { supabase } from './supabase';
import { toastService } from '../utils/toastService';

export const productService = {
  async createProduct(producto) {
    try {
      toastService.info('Creando producto...');
      
      const { data, error } = await supabase
        .from('productos')
        .insert([producto])
        .select()
        .single();

      if (error) throw error;

      toastService.success(`Producto "${producto.nombre}" creado exitosamente`);
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al crear producto: ' + error.message);
      return { data: null, error };
    }
  },

  async updateProduct(id, updates) {
    try {
      toastService.info('Actualizando producto...');
      
      const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toastService.success('Producto actualizado exitosamente');
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al actualizar producto: ' + error.message);
      return { data: null, error };
    }
  },

  async deleteProduct(id) {
    try {
      toastService.info('Eliminando producto...');
      
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toastService.success('Producto eliminado exitosamente');
      
      return { error: null };
    } catch (error) {
      toastService.error('Error al eliminar producto: ' + error.message);
      return { error };
    }
  },
};
```

---

## 💰 Ventas con Toasts

### Crear Venta

```javascript
// src/services/salesService.js
import { supabase } from './supabase';
import { toastService } from '../utils/toastService';

export const salesService = {
  async createSale(ventaData) {
    try {
      toastService.info('Procesando venta...');
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Agregar usuario_id a la venta
      const ventaConUsuario = {
        ...ventaData,
        usuario_id: user.id,
      };

      const { data, error } = await supabase
        .from('ventas')
        .insert([ventaConUsuario])
        .select()
        .single();

      if (error) throw error;

      // Los triggers automáticamente:
      // 1. Generarán el número de venta
      // 2. Actualizarán el stock del producto
      // 3. Registrarán el movimiento de inventario

      toastService.success(
        `Venta creada exitosamente: ${data.numero_venta}\n` +
        `Producto: ${data.nombre_producto}\n` +
        `Cantidad: ${data.cantidad}\n` +
        `Total: $${data.precio_total.toFixed(2)}`
      );
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al crear venta: ' + error.message);
      return { data: null, error };
    }
  },

  async createBulkSales(ventas) {
    try {
      toastService.info(`Procesando ${ventas.length} ventas...`);
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Agregar usuario_id a todas las ventas
      const ventasConUsuario = ventas.map(venta => ({
        ...venta,
        usuario_id: user.id,
      }));

      const { data, error } = await supabase
        .from('ventas')
        .insert(ventasConUsuario)
        .select();

      if (error) throw error;

      toastService.success(
        `${data.length} ventas cargadas exitosamente\n` +
        `Total de ingresos: $${data.reduce((sum, v) => sum + v.precio_total, 0).toFixed(2)}`
      );
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al cargar ventas: ' + error.message);
      return { data: null, error };
    }
  },
};
```

---

## 📤 Carga de Datos CSV/Excel con Toasts

```javascript
// src/services/uploadService.js
import { supabase } from './supabase';
import { toastService } from '../utils/toastService';
import { parseCSV, validateSalesData } from '../utils/csvParser';

export const uploadService = {
  async uploadSalesFile(file) {
    try {
      toastService.info('Procesando archivo...');
      
      // Parsear archivo
      const parsedData = await parseCSV(file);
      
      toastService.info(`Archivo parseado: ${parsedData.length} registros encontrados`);
      
      // Validar datos
      const validation = validateSalesData(parsedData);
      
      if (!validation.isValid) {
        toastService.error(
          `Errores de validación:\n${validation.errors.slice(0, 5).join('\n')}\n` +
          `${validation.errors.length > 5 ? `... y ${validation.errors.length - 5} más` : ''}`
        );
        return { data: null, error: validation.errors };
      }

      toastService.info(`Validación exitosa: ${validation.valid.length} registros válidos`);
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Agregar usuario_id a todas las ventas
      const ventasConUsuario = validation.valid.map(venta => ({
        ...venta,
        usuario_id: user.id,
      }));

      // Insertar ventas
      const { data, error } = await supabase
        .from('ventas')
        .insert(ventasConUsuario)
        .select();

      if (error) throw error;

      toastService.success(
        `✅ ${data.length} ventas cargadas exitosamente\n` +
        `📊 Total ingresos: $${data.reduce((sum, v) => sum + (v.precio_total || 0), 0).toFixed(2)}\n` +
        `📦 Stock actualizado automáticamente`
      );
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al cargar archivo: ' + error.message);
      return { data: null, error };
    }
  },
};
```

---

## 💡 Recomendaciones con Toasts

```javascript
// src/services/recommendationsService.js
import { supabase } from './supabase';
import { toastService } from '../utils/toastService';

export const recommendationsService = {
  async getRecommendations() {
    try {
      const { data, error } = await supabase
        .from('recomendaciones')
        .select('*, productos(*)')
        .eq('resuelta', false)
        .order('prioridad', { ascending: false })
        .order('creado_en', { ascending: false });

      if (error) throw error;

      const recomendacionesAltas = data.filter(r => r.prioridad === 'alta');
      
      if (recomendacionesAltas.length > 0) {
        toastService.warning(
          `⚠️ Tienes ${recomendacionesAltas.length} recomendaciones de alta prioridad\n` +
          `Revisa el panel de recomendaciones para más detalles`
        );
      } else if (data.length > 0) {
        toastService.info(`Tienes ${data.length} recomendaciones nuevas`);
      }
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al obtener recomendaciones: ' + error.message);
      return { data: null, error };
    }
  },

  async markAsRead(id) {
    try {
      const { error } = await supabase
        .from('recomendaciones')
        .update({ leida: true })
        .eq('id', id);

      if (error) throw error;

      toastService.success('Recomendación marcada como leída');
      
      return { error: null };
    } catch (error) {
      toastService.error('Error al actualizar recomendación: ' + error.message);
      return { error };
    }
  },

  async markAsResolved(id) {
    try {
      const { error } = await supabase
        .from('recomendaciones')
        .update({ 
          resuelta: true,
          resuelto_en: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toastService.success('Recomendación marcada como resuelta');
      
      return { error: null };
    } catch (error) {
      toastService.error('Error al resolver recomendación: ' + error.message);
      return { error };
    }
  },
};
```

---

## 🎨 Personalización de Estilos

### Agregar estilos personalizados

```css
/* src/styles/toast-custom.css */
.Toastify__toast {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.Toastify__toast--success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.Toastify__toast--error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.Toastify__toast--info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.Toastify__toast--warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}
```

### Importar estilos en App.jsx

```javascript
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast-custom.css';
```

---

## 📝 Ejemplos de Uso en Componentes

### Componente de Login

```javascript
// src/pages/LoginPage.jsx
import { useState } from 'react';
import { authService } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data, error } = await authService.signIn(email, password);
    
    if (!error && data) {
      // El toast ya se muestra desde authService
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
};
```

### Componente de Carga de Datos

```javascript
// src/pages/UploadPage.jsx
import { useState } from 'react';
import { uploadService } from '../services/uploadService';

const UploadPage = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    
    const { data, error } = await uploadService.uploadSalesFile(file);
    
    if (!error && data) {
      // El toast ya se muestra desde uploadService
      setFile(null);
    }
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
};
```

---

## ✅ Mejores Prácticas

1. **Mensajes claros**: Usa mensajes descriptivos y específicos
2. **Feedback inmediato**: Muestra toasts mientras se procesan las acciones
3. **Errores informativos**: Muestra mensajes de error claros y útiles
4. **Éxito confirmado**: Confirma acciones exitosas con toasts
5. **No abusar**: No uses toasts para cada acción menor

---

## 🎯 Checklist de Implementación

- [ ] react-toastify instalado
- [ ] ToastContainer configurado en App.jsx
- [ ] Servicio de toasts creado
- [ ] Toasts integrados en authService
- [ ] Toasts integrados en salesService
- [ ] Toasts integrados en uploadService
- [ ] Toasts integrados en recommendationsService
- [ ] Estilos personalizados aplicados
- [ ] Probado en diferentes navegadores

---

**¡Toasts integrados exitosamente! 🎉**

