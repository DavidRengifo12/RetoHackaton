# 📘 Guía de Implementación - Sistema de Análisis de Ventas e Inventario

## 🎯 Descripción General

Este documento explica cómo implementar y usar la base de datos completa del sistema de análisis de ventas e inventario en Supabase.

---

## 📋 Requisitos Previos

1. **Cuenta de Supabase**: Crear una cuenta en [supabase.com](https://supabase.com)
2. **Proyecto creado**: Tener un proyecto de Supabase activo
3. **Acceso a SQL Editor**: Permisos para ejecutar scripts SQL

---

## 🚀 Pasos de Implementación

### Paso 1: Ejecutar Script de Estructura

1. Abre el **SQL Editor** en tu proyecto de Supabase
2. Copia y pega el contenido completo de `01_estructura_completa.sql`
3. Haz clic en **Run** o presiona `Ctrl + Enter`
4. Verifica que no haya errores en la ejecución

**Tiempo estimado**: 2-3 minutos

### Paso 2: Verificar Implementación

Ejecuta estas consultas para verificar que todo se creó correctamente:

```sql
-- Verificar roles creados
SELECT * FROM roles_usuario;

-- Verificar categorías creadas
SELECT * FROM categorias;

-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Paso 3: Probar Registro de Usuario

1. Ve a **Authentication** en Supabase
2. Crea un usuario de prueba desde el dashboard o desde tu frontend
3. Verifica que se creó automáticamente en la tabla `usuarios`:

```sql
SELECT u.*, r.nombre as rol
FROM usuarios u
LEFT JOIN roles_usuario r ON u.rol_id = r.id
WHERE u.email = 'tu-email@ejemplo.com';
```

**Debería mostrar el rol "usuario común" asignado automáticamente**

### Paso 4: Probar Creación de Venta

Crea una venta de prueba para verificar los triggers automáticos:

```sql
-- Primero, insertar un producto de prueba
INSERT INTO productos (nombre, sku, categoria, stock, precio, precio_costo)
VALUES ('Producto Prueba', 'PRUEBA-001', 'Ropa', 100, 50.00, 30.00)
RETURNING id;

-- Luego, crear una venta (esto activará automáticamente los triggers)
INSERT INTO ventas (producto_id, nombre_producto, cantidad, precio_unitario, usuario_id)
VALUES (
  (SELECT id FROM productos WHERE sku = 'PRUEBA-001'),
  'Producto Prueba',
  5,
  50.00,
  (SELECT id FROM auth.users LIMIT 1)
)
RETURNING *;

-- Verificar que se actualizó el stock
SELECT stock FROM productos WHERE sku = 'PRUEBA-001';

-- Verificar que se registró el movimiento de inventario
SELECT * FROM movimientos_inventario 
WHERE producto_id = (SELECT id FROM productos WHERE sku = 'PRUEBA-001')
ORDER BY creado_en DESC;
```

---

## 🔐 Sistema de Autenticación y Roles

### Roles Disponibles

El sistema incluye tres roles por defecto:

1. **usuario común**: Permisos básicos de lectura y escritura
2. **administrador**: Permisos completos del sistema
3. **gerente**: Permisos de gestión y análisis

### Asignación Automática de Rol

Cuando un usuario se registra en `auth.users`, automáticamente:

1. Se crea un registro en la tabla `usuarios`
2. Se asigna el rol "usuario común" por defecto
3. El usuario queda activo automáticamente

**Trigger responsable**: `trigger_crear_usuario_comun`

### Cambiar Rol de Usuario

Para cambiar el rol de un usuario, ejecuta:

```sql
UPDATE usuarios
SET rol_id = (SELECT id FROM roles_usuario WHERE nombre = 'administrador')
WHERE email = 'usuario@ejemplo.com';
```

---

## 📊 Funcionalidades Automáticas

### 1. Actualización de Stock Automática

**Cuándo se activa**: Al crear una nueva venta

**Qué hace**:
- Reduce automáticamente el stock del producto
- Registra el movimiento en `movimientos_inventario`
- Verifica que haya stock suficiente

**Trigger responsable**: `trigger_procesar_venta_inventario`

**Ejemplo**:
```sql
-- Crear venta
INSERT INTO ventas (producto_id, nombre_producto, cantidad, precio_unitario, usuario_id)
VALUES (...);

-- El stock se actualiza automáticamente
-- El movimiento se registra automáticamente
```

### 2. Generación de Número de Venta

**Cuándo se activa**: Al crear una nueva venta sin número de venta

**Formato**: `VENTA-YYYYMMDD-XXXXXX`

**Ejemplo**: `VENTA-20250115-000001`

**Trigger responsable**: `trigger_generar_numero_venta`

### 3. Actualización Automática de Timestamps

**Cuándo se activa**: Al actualizar cualquier registro

**Campos afectados**: `actualizado_en` en todas las tablas

**Trigger responsable**: `trigger_actualizar_*` en cada tabla

---

## 🔒 Row Level Security (RLS)

### Políticas Implementadas

Todas las tablas tienen RLS habilitado con las siguientes políticas:

#### Políticas Generales
- ✅ **SELECT**: Usuarios autenticados pueden ver todos los registros
- ✅ **INSERT**: Usuarios autenticados pueden insertar registros
- ✅ **UPDATE**: Usuarios autenticados pueden actualizar registros
- ✅ **DELETE**: Usuarios autenticados pueden eliminar registros

#### Políticas Especiales
- **usuarios**: Los usuarios solo pueden actualizar su propio perfil
- **movimientos_inventario**: Solo lectura (los movimientos se crean automáticamente)

### Verificar Políticas RLS

```sql
-- Ver todas las políticas activas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 📈 Vistas Disponibles

### 1. `productos_con_estadisticas`

Vista completa de productos con estadísticas agregadas:

```sql
SELECT * FROM productos_con_estadisticas
WHERE categoria = 'Ropa'
ORDER BY total_ventas DESC;
```

**Campos incluidos**:
- Información del producto
- `total_ventas`: Total de unidades vendidas
- `ingresos_totales`: Ingresos generados
- `ganancia_total`: Ganancia calculada
- `porcentaje_rotacion`: Porcentaje de rotación
- `alerta_stock_bajo`: Si el stock está por debajo del mínimo

### 2. `ventas_con_detalles`

Vista completa de ventas con información de productos y clientes:

```sql
SELECT * FROM ventas_con_detalles
WHERE fecha_venta >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY fecha_venta DESC;
```

### 3. `resumen_ventas_diarias`

Resumen de ventas agrupadas por día:

```sql
SELECT * FROM resumen_ventas_diarias
WHERE fecha >= CURRENT_DATE - INTERVAL '7 days';
```

---

## 🔧 Funciones Disponibles

### 1. `registrar_movimiento_inventario`

Función para registrar movimientos de inventario manualmente:

```sql
SELECT registrar_movimiento_inventario(
  p_producto_id := 'uuid-del-producto',
  p_tipo_movimiento := 'entrada',
  p_cantidad := 50,
  p_motivo := 'Reabastecimiento de stock',
  p_usuario_id := 'uuid-del-usuario'
);
```

**Tipos de movimiento**:
- `entrada`: Entrada de stock
- `salida`: Salida de stock
- `ajuste`: Ajuste manual de inventario
- `devolucion`: Devolución de producto

---

## 🎨 Integración con Frontend React

### Variables de Entorno

Asegúrate de tener estas variables en tu `.env`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### Configuración de Supabase Client

```javascript
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Registro de Usuario con Toast

```javascript
// src/services/authService.js
import { supabase } from './supabase';
import { toast } from 'react-toastify'; // o tu librería de toasts

export const signUp = async (email, password, nombreCompleto) => {
  try {
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
    
    toast.success('Usuario registrado exitosamente. Rol asignado: usuario común');
    return { data, error: null };
  } catch (error) {
    toast.error('Error al registrar usuario: ' + error.message);
    return { data: null, error };
  }
};
```

### Inicio de Sesión con Toast

```javascript
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast.success('Sesión iniciada correctamente');
    return { data, error: null };
  } catch (error) {
    toast.error('Error al iniciar sesión: ' + error.message);
    return { data: null, error };
  }
};
```

### Crear Venta con Toast

```javascript
// src/services/salesService.js
import { supabase } from './supabase';
import { toast } from 'react-toastify';

export const createSale = async (ventaData) => {
  try {
    const { data, error } = await supabase
      .from('ventas')
      .insert([ventaData])
      .select()
      .single();

    if (error) throw error;

    // Los triggers automáticamente:
    // 1. Generarán el número de venta
    // 2. Actualizarán el stock del producto
    // 3. Registrarán el movimiento de inventario

    toast.success(`Venta creada exitosamente: ${data.numero_venta}`);
    return { data, error: null };
  } catch (error) {
    toast.error('Error al crear venta: ' + error.message);
    return { data: null, error };
  }
};
```

### Cargar Datos CSV con Toast

```javascript
// src/services/uploadService.js
import { supabase } from './supabase';
import { toast } from 'react-toastify';

export const uploadBulkSales = async (ventas) => {
  try {
    const { data, error } = await supabase
      .from('ventas')
      .insert(ventas)
      .select();

    if (error) throw error;

    toast.success(`${data.length} ventas cargadas exitosamente`);
    return { data, error: null };
  } catch (error) {
    toast.error('Error al cargar ventas: ' + error.message);
    return { data: null, error };
  }
};
```

### Obtener Recomendaciones con Toast

```javascript
// src/services/recommendationsService.js
import { supabase } from './supabase';
import { toast } from 'react-toastify';

export const getRecommendations = async () => {
  try {
    const { data, error } = await supabase
      .from('recomendaciones')
      .select('*')
      .eq('resuelta', false)
      .order('prioridad', { ascending: false });

    if (error) throw error;

    if (data.length > 0) {
      toast.info(`Tienes ${data.length} recomendaciones nuevas`);
    }

    return { data, error: null };
  } catch (error) {
    toast.error('Error al obtener recomendaciones: ' + error.message);
    return { data: null, error };
  }
};
```

---

## 🐛 Solución de Problemas

### Problema: El rol no se asigna automáticamente

**Solución**:
1. Verificar que el trigger `trigger_crear_usuario_comun` esté activo
2. Verificar que exista el rol "usuario común" en `roles_usuario`
3. Verificar los logs de Supabase

```sql
-- Verificar trigger
SELECT * FROM pg_trigger WHERE tgname = 'trigger_crear_usuario_comun';

-- Verificar rol
SELECT * FROM roles_usuario WHERE nombre = 'usuario común';
```

### Problema: El stock no se actualiza al crear venta

**Solución**:
1. Verificar que el trigger `trigger_procesar_venta_inventario` esté activo
2. Verificar que la función `registrar_movimiento_inventario` funcione correctamente

```sql
-- Verificar trigger
SELECT * FROM pg_trigger WHERE tgname = 'trigger_procesar_venta_inventario';

-- Probar función manualmente
SELECT registrar_movimiento_inventario(
  'uuid-producto',
  'salida',
  5,
  'Prueba manual',
  'uuid-usuario'
);
```

### Problema: Error de permisos RLS

**Solución**:
1. Verificar que el usuario esté autenticado
2. Verificar que las políticas RLS estén correctamente configuradas
3. Verificar el rol del usuario

```sql
-- Verificar rol del usuario actual
SELECT auth.role();

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'nombre_tabla';
```

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Triggers en PostgreSQL](https://www.postgresql.org/docs/current/triggers.html)
- [Funciones PL/pgSQL](https://www.postgresql.org/docs/current/plpgsql.html)

---

## ✅ Checklist de Implementación

- [ ] Script de estructura ejecutado sin errores
- [ ] Roles creados correctamente
- [ ] Categorías creadas correctamente
- [ ] Usuario de prueba registrado y rol asignado
- [ ] Venta de prueba creada y stock actualizado
- [ ] Movimiento de inventario registrado automáticamente
- [ ] Políticas RLS verificadas
- [ ] Vistas funcionando correctamente
- [ ] Frontend conectado y toasts funcionando

---

**¡Implementación completa! 🚀**

