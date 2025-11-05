# 📊 Base de Datos - Sistema de Inventario
## Hackatón de Programación 2025

Este directorio contiene los scripts SQL necesarios para configurar la base de datos en Supabase.

---

## 📁 Archivos

### `01_tablas.sql` ⭐ **Primer paso**
**Archivo de estructura de tablas**

Contiene:
- ✅ Extensión UUID
- ✅ Todas las tablas del sistema (roles_usuario, usuarios, categorias, clientes, productos, ventas, movimientos_inventario, recomendaciones)
- ✅ Índices para optimización
- ✅ Vistas útiles (productos_con_estadisticas, ventas_con_detalles, resumen_ventas_diarias)
- ✅ Datos iniciales (roles y categorías por defecto)

**Ejecutar primero este archivo.**

### `02_triggers.sql` ⭐ **Segundo paso**
**Archivo de funciones y triggers automáticos**

Contiene:
- ✅ Funciones auxiliares (actualizar_timestamp, generar_numero_venta, registrar_movimiento_inventario, crear_usuario_comun)
- ✅ Triggers automáticos para actualización de timestamps
- ✅ Trigger para generación de números de venta
- ✅ Trigger para actualización de stock al crear ventas
- ✅ Trigger para asignación automática de rol "usuario común" al registrarse

**Ejecutar después de 01_tablas.sql**

### `03_policies.sql` ⭐ **Tercer paso**
**Archivo de políticas RLS (Row Level Security)**

Contiene:
- ✅ Habilitación de RLS en todas las tablas
- ✅ Políticas de seguridad para usuarios autenticados
- ✅ Control de acceso por roles

**Ejecutar después de 02_triggers.sql**

### `04_datos_ejemplo.sql` ⭐ **Cuarto paso**
**Archivo de datos de ejemplo**

Contiene:
- ✅ Inserción de productos de ejemplo (20+ productos)
- ✅ Inserción de clientes de ejemplo (10 clientes)
- ✅ Inserción de ventas de ejemplo (20+ ventas distribuidas en los últimos 30 días)
- ✅ Inserción de recomendaciones de ejemplo

**Ejecutar después de 03_policies.sql**

---

## 🚀 Instrucciones de Uso

### Paso 1: Crear proyecto en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Anota las credenciales (URL y Anon Key)

### Paso 2: Ejecutar scripts en orden

**IMPORTANTE**: Ejecutar los scripts en el orden indicado:

1. **Ejecutar `01_tablas.sql`**:
   - Ve a **SQL Editor** en tu proyecto de Supabase
   - Copia y pega todo el contenido de `01_tablas.sql`
   - Haz clic en **Run** o presiona `Ctrl + Enter`
   - Verifica que no haya errores

2. **Ejecutar `02_triggers.sql`**:
   - En el mismo SQL Editor
   - Copia y pega todo el contenido de `02_triggers.sql`
   - Haz clic en **Run**
   - Verifica que no haya errores

3. **Ejecutar `03_policies.sql`**:
   - En el mismo SQL Editor
   - Copia y pega todo el contenido de `03_policies.sql`
   - Haz clic en **Run**
   - Verifica que no haya errores

4. **Ejecutar `04_datos_ejemplo.sql`**:
   - En el mismo SQL Editor
   - Copia y pega todo el contenido de `04_datos_ejemplo.sql`
   - Haz clic en **Run**
   - Verifica que los datos se insertaron correctamente

### Paso 3: Verificar Implementación

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

-- Verificar productos
SELECT COUNT(*) as total_productos FROM productos;

-- Verificar ventas
SELECT COUNT(*) as total_ventas FROM ventas;

-- Verificar movimientos de inventario
SELECT COUNT(*) as total_movimientos FROM movimientos_inventario;
```

---

## 📊 Estructura de Tablas

### Tablas Principales

1. **roles_usuario**: Roles del sistema (usuario común, administrador, gerente)
2. **usuarios**: Información extendida de usuarios sincronizada con auth.users
3. **categorias**: Categorías de productos
4. **clientes**: Información de clientes
5. **productos**: Catálogo de productos
6. **ventas**: Registro de todas las ventas
7. **movimientos_inventario**: Historial de movimientos de inventario
8. **recomendaciones**: Recomendaciones automáticas del sistema

---

## 🔐 Seguridad (RLS)

Todas las tablas tienen **Row Level Security (RLS)** habilitado con políticas para usuarios autenticados.

### Políticas Implementadas
- ✅ **SELECT**: Usuarios autenticados pueden ver registros
- ✅ **INSERT**: Usuarios autenticados pueden insertar registros
- ✅ **UPDATE**: Usuarios autenticados pueden actualizar registros
- ✅ **DELETE**: Usuarios autenticados pueden eliminar registros

---

## 🔧 Triggers Automáticos

### 1. Asignación de Rol al Registrarse
- **Cuándo**: Al crear un usuario en `auth.users`
- **Qué hace**: Asigna automáticamente el rol "usuario común"
- **Trigger**: `trigger_crear_usuario_comun`

### 2. Actualización de Stock
- **Cuándo**: Al crear una nueva venta
- **Qué hace**: Actualiza automáticamente el stock del producto y registra el movimiento
- **Trigger**: `trigger_procesar_venta_inventario`

### 3. Generación de Número de Venta
- **Cuándo**: Al crear una nueva venta sin número
- **Qué hace**: Genera un número único (formato: `VENTA-YYYYMMDD-XXXXXX`)
- **Trigger**: `trigger_generar_numero_venta`

---

## 📚 Documentación Adicional

- **`GUIA_IMPLEMENTACION.md`**: Guía completa de implementación y uso
- **`TOASTS_INTEGRACION.md`** (en Frontend/): Guía de integración de toasts en React
- **`MEJORAS_DB.md`**: Comparación entre versiones (si aplica)

---

## 🔗 Integración con Frontend

### Variables de Entorno
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### Instalación de Toasts
```bash
npm install react-toastify
```

Ver `Frontend/TOASTS_INTEGRACION.md` para guía completa de integración.

---

**¡Listo para usar! 🚀**
