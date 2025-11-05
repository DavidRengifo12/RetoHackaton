# 📋 Instrucciones de Ejecución - Base de Datos

## 🎯 Orden de Ejecución de Scripts SQL

Ejecuta los scripts en Supabase SQL Editor en el siguiente orden:

### 1️⃣ Ejecutar `01_tablas.sql`
- Crea todas las tablas del sistema
- Crea índices para optimización
- Crea vistas útiles
- Inserta datos iniciales (roles y categorías)

### 2️⃣ Ejecutar `02_triggers.sql`
- Crea funciones auxiliares
- Crea triggers automáticos:
  - Actualización de timestamps
  - Generación de números de venta
  - Actualización de stock al crear ventas
  - Asignación automática de rol "usuario" al registrarse

### 3️⃣ Ejecutar `03_policies.sql`
- Habilita Row Level Security (RLS) en todas las tablas
- Crea políticas de seguridad para usuarios autenticados

### 4️⃣ Ejecutar `04_datos_ejemplo.sql` (Opcional)
- Inserta productos de ejemplo
- Inserta clientes de ejemplo
- Inserta ventas de ejemplo
- Los triggers automáticamente actualizarán el stock y registrarán movimientos

---

## ✅ Verificaciones Post-Ejecución

Después de ejecutar todos los scripts, verifica:

```sql
-- 1. Verificar roles
SELECT * FROM roles_usuario;

-- 2. Verificar categorías
SELECT * FROM categorias;

-- 3. Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 4. Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- 5. Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 🔐 Probar Registro de Usuario

1. Ve a **Authentication** en Supabase
2. Crea un usuario de prueba desde el dashboard o desde tu frontend
3. Verifica que se creó automáticamente en la tabla `usuarios`:

```sql
SELECT u.*, r.nombre as rol
FROM usuarios u
LEFT JOIN roles_usuario r ON u.rol_id = r.id
WHERE u.email = 'tu-email@ejemplo.com';
```

**Debería mostrar el rol "usuario" asignado automáticamente**

---

## 💰 Probar Creación de Venta

1. Primero, inserta un producto de prueba:

```sql
INSERT INTO productos (nombre, sku, categoria, stock, precio, precio_costo)
VALUES ('Producto Prueba', 'PRUEBA-001', 'Ropa', 100, 50.00, 30.00)
RETURNING id;
```

2. Luego, crea una venta (esto activará automáticamente los triggers):

```sql
INSERT INTO ventas (producto_id, nombre_producto, cantidad, precio_unitario, usuario_id)
VALUES (
  (SELECT id FROM productos WHERE sku = 'PRUEBA-001'),
  'Producto Prueba',
  5,
  50.00,
  (SELECT id FROM auth.users LIMIT 1)
)
RETURNING *;
```

3. Verifica que se actualizó el stock:

```sql
SELECT stock FROM productos WHERE sku = 'PRUEBA-001';
-- Debería mostrar 95 (100 - 5)
```

4. Verifica que se registró el movimiento de inventario:

```sql
SELECT * FROM movimientos_inventario 
WHERE producto_id = (SELECT id FROM productos WHERE sku = 'PRUEBA-001')
ORDER BY creado_en DESC;
```

---

## 🎯 Características Implementadas

✅ **Extensión UUID**: `uuid-ossp` habilitada
✅ **Tabla usuarios**: Conectada a `auth.users` con referencia CASCADE
✅ **Rol automático**: Asignación automática de rol "usuario" al registrarse
✅ **Triggers funcionales**: Actualización de stock y registro de movimientos
✅ **Políticas RLS**: Seguridad completa en todas las tablas
✅ **Código en español**: Nombres de variables y tablas en español
✅ **Bien comentado**: Comentarios claros en cada sección
✅ **Estructurado**: Separado en 3 secciones claras

---

## 📝 Notas Importantes

1. **Orden de ejecución**: Respeta el orden indicado (01, 02, 03, 04)
2. **Sin relaciones explícitas**: Solo se mantienen las referencias necesarias para integridad
3. **Variables en español**: Todos los nombres están en español
4. **Buenas prácticas**: Código limpio, comentado y estructurado

---

**¡Base de datos lista para usar! 🚀**

