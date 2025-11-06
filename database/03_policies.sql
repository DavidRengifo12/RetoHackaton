-- ============================================
-- SISTEMA DE ANÁLISIS DE VENTAS E INVENTARIO
-- Base de Datos PostgreSQL en Supabase
-- Hackatón de Programación 2025
-- ============================================
-- 
-- ARCHIVO 3: ROW LEVEL SECURITY (RLS) Y POLÍTICAS
-- 
-- Este script configura las políticas de seguridad RLS sin conflictos
-- 
-- INSTRUCCIONES:
-- 1. Ejecutar 01_tablas.sql primero
-- 2. Luego ejecutar 02_triggers.sql
-- 3. Luego ejecutar este script
-- 4. Finalmente ejecutar 04_datos_ejemplo.sql
-- 
-- NOTA: Las funciones de triggers usan SECURITY DEFINER para bypassear RLS
-- cuando es necesario (ej: insertar movimientos de inventario automáticamente)
-- 
-- ============================================

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE recomendaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE carritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carritos_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS
-- ============================================

-- --------------------------------------------
-- Políticas RLS para usuarios
-- --------------------------------------------
-- SELECT: Todos los usuarios autenticados pueden ver otros usuarios
-- Esto es necesario para que fetchUserData funcione después del login
DROP POLICY IF EXISTS "usuarios_pueden_ver_otros_usuarios" ON usuarios;
CREATE POLICY "usuarios_pueden_ver_otros_usuarios"
  ON usuarios FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_pueden_actualizar_su_perfil" ON usuarios;
CREATE POLICY "usuarios_pueden_actualizar_su_perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para que administradores puedan actualizar cualquier usuario
DROP POLICY IF EXISTS "administradores_pueden_actualizar_usuarios" ON usuarios;
CREATE POLICY "administradores_pueden_actualizar_usuarios"
  ON usuarios FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- Política para insertar usuarios
-- IMPORTANTE: El trigger crear_usuario() usa SECURITY DEFINER y puede insertar sin RLS
-- Esta política permite que los usuarios inserten su propio registro (útil si el trigger falla)
-- y que los administradores inserten registros de otros usuarios
DROP POLICY IF EXISTS "usuarios_pueden_insertar_registro" ON usuarios;
CREATE POLICY "usuarios_pueden_insertar_registro"
  ON usuarios FOR INSERT
  WITH CHECK (
    -- Permitir si el usuario está insertando su propio registro
    id = auth.uid()
    OR
    -- Permitir si es administrador
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- --------------------------------------------
-- Políticas RLS para categorias
-- --------------------------------------------
-- SELECT: Todos los usuarios pueden ver categorías
DROP POLICY IF EXISTS "usuarios_pueden_ver_categorias" ON categorias;
CREATE POLICY "usuarios_pueden_ver_categorias"
  ON categorias FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: Solo admin puede crear categorías
DROP POLICY IF EXISTS "administradores_pueden_insertar_categorias" ON categorias;
CREATE POLICY "administradores_pueden_insertar_categorias"
  ON categorias FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- UPDATE: Solo admin puede actualizar categorías
DROP POLICY IF EXISTS "administradores_pueden_actualizar_categorias" ON categorias;
CREATE POLICY "administradores_pueden_actualizar_categorias"
  ON categorias FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- DELETE: Solo admin puede eliminar categorías
DROP POLICY IF EXISTS "administradores_pueden_eliminar_categorias" ON categorias;
CREATE POLICY "administradores_pueden_eliminar_categorias"
  ON categorias FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- --------------------------------------------
-- Políticas RLS para clientes
-- --------------------------------------------
-- SELECT: Todos los usuarios pueden ver clientes
DROP POLICY IF EXISTS "usuarios_pueden_ver_clientes" ON clientes;
CREATE POLICY "usuarios_pueden_ver_clientes"
  ON clientes FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: Solo admin puede crear clientes
DROP POLICY IF EXISTS "administradores_pueden_insertar_clientes" ON clientes;
CREATE POLICY "administradores_pueden_insertar_clientes"
  ON clientes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- UPDATE: Solo admin puede actualizar clientes
DROP POLICY IF EXISTS "administradores_pueden_actualizar_clientes" ON clientes;
CREATE POLICY "administradores_pueden_actualizar_clientes"
  ON clientes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- DELETE: Solo admin puede eliminar clientes
DROP POLICY IF EXISTS "administradores_pueden_eliminar_clientes" ON clientes;
CREATE POLICY "administradores_pueden_eliminar_clientes"
  ON clientes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- --------------------------------------------
-- Políticas RLS para productos
-- --------------------------------------------
-- SELECT: Todos los usuarios pueden ver productos
DROP POLICY IF EXISTS "usuarios_pueden_ver_productos" ON productos;
CREATE POLICY "usuarios_pueden_ver_productos"
  ON productos FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: Solo admin puede crear productos
DROP POLICY IF EXISTS "administradores_pueden_insertar_productos" ON productos;
CREATE POLICY "administradores_pueden_insertar_productos"
  ON productos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- UPDATE: Solo admin puede actualizar productos
DROP POLICY IF EXISTS "administradores_pueden_actualizar_productos" ON productos;
CREATE POLICY "administradores_pueden_actualizar_productos"
  ON productos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- DELETE: Solo admin puede eliminar productos
DROP POLICY IF EXISTS "administradores_pueden_eliminar_productos" ON productos;
CREATE POLICY "administradores_pueden_eliminar_productos"
  ON productos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- --------------------------------------------
-- Políticas RLS para ventas
-- --------------------------------------------
-- Políticas diferenciadas: Admin puede gestionar todas las ventas, usuarios solo las suyas

-- SELECT: Admin ve todas, usuarios solo las suyas
DROP POLICY IF EXISTS "usuarios_pueden_ver_sus_ventas" ON ventas;
CREATE POLICY "usuarios_pueden_ver_sus_ventas"
  ON ventas FOR SELECT
  USING (
    usuario_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- INSERT: Todos los usuarios pueden crear ventas, pero solo pueden asignarse a sí mismos
DROP POLICY IF EXISTS "usuarios_pueden_crear_ventas" ON ventas;
CREATE POLICY "usuarios_pueden_crear_ventas"
  ON ventas FOR INSERT
  WITH CHECK (
    usuario_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- UPDATE: Admin puede actualizar todas, usuarios solo las suyas
DROP POLICY IF EXISTS "usuarios_pueden_actualizar_ventas" ON ventas;
CREATE POLICY "usuarios_pueden_actualizar_ventas"
  ON ventas FOR UPDATE
  USING (
    usuario_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  )
  WITH CHECK (
    usuario_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- DELETE: Admin puede eliminar todas, usuarios solo las suyas
DROP POLICY IF EXISTS "usuarios_pueden_eliminar_ventas" ON ventas;
CREATE POLICY "usuarios_pueden_eliminar_ventas"
  ON ventas FOR DELETE
  USING (
    usuario_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- --------------------------------------------
-- Políticas RLS para movimientos_inventario
-- --------------------------------------------
-- SELECT: Todos los usuarios pueden ver movimientos
DROP POLICY IF EXISTS "usuarios_pueden_ver_movimientos" ON movimientos_inventario;
CREATE POLICY "usuarios_pueden_ver_movimientos"
  ON movimientos_inventario FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: Permitir inserción desde triggers y por admin
-- IMPORTANTE: Las funciones con SECURITY DEFINER en Supabase aún deben cumplir RLS
-- Pero cuando se ejecutan desde triggers, el contexto puede ser diferente
-- Permitimos inserción si es admin o si tiene referencia_venta (viene de trigger)
DROP POLICY IF EXISTS "sistema_puede_insertar_movimientos" ON movimientos_inventario;
CREATE POLICY "sistema_puede_insertar_movimientos"
  ON movimientos_inventario FOR INSERT
  WITH CHECK (
    -- Permitir si es admin
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
    OR
    -- Permitir si viene de un trigger (tiene referencia_venta)
    -- Los triggers ejecutan con el contexto del usuario que hizo la venta
    referencia_venta IS NOT NULL
  );

-- --------------------------------------------
-- Políticas RLS para recomendaciones
-- --------------------------------------------
-- SELECT: Todos los usuarios pueden ver recomendaciones
DROP POLICY IF EXISTS "usuarios_pueden_ver_recomendaciones" ON recomendaciones;
CREATE POLICY "usuarios_pueden_ver_recomendaciones"
  ON recomendaciones FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: Solo admin puede crear recomendaciones
DROP POLICY IF EXISTS "administradores_pueden_insertar_recomendaciones" ON recomendaciones;
CREATE POLICY "administradores_pueden_insertar_recomendaciones"
  ON recomendaciones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- UPDATE: Solo admin puede actualizar recomendaciones
DROP POLICY IF EXISTS "administradores_pueden_actualizar_recomendaciones" ON recomendaciones;
CREATE POLICY "administradores_pueden_actualizar_recomendaciones"
  ON recomendaciones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- DELETE: Solo admin puede eliminar recomendaciones
DROP POLICY IF EXISTS "administradores_pueden_eliminar_recomendaciones" ON recomendaciones;
CREATE POLICY "administradores_pueden_eliminar_recomendaciones"
  ON recomendaciones FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid()
      AND u.rol = 'administrador'
    )
  );

-- --------------------------------------------
-- Políticas RLS para carritos
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_pueden_ver_su_carrito" ON carritos;
CREATE POLICY "usuarios_pueden_ver_su_carrito"
  ON carritos FOR SELECT
  USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_pueden_crear_su_carrito" ON carritos;
CREATE POLICY "usuarios_pueden_crear_su_carrito"
  ON carritos FOR INSERT
  WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_pueden_actualizar_su_carrito" ON carritos;
CREATE POLICY "usuarios_pueden_actualizar_su_carrito"
  ON carritos FOR UPDATE
  USING (usuario_id = auth.uid())
  WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_pueden_eliminar_su_carrito" ON carritos;
CREATE POLICY "usuarios_pueden_eliminar_su_carrito"
  ON carritos FOR DELETE
  USING (usuario_id = auth.uid());

-- --------------------------------------------
-- Políticas RLS para carritos_items
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_pueden_ver_items_su_carrito" ON carritos_items;
CREATE POLICY "usuarios_pueden_ver_items_su_carrito"
  ON carritos_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carritos c
      WHERE c.id = carritos_items.carrito_id
      AND c.usuario_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "usuarios_pueden_crear_items_su_carrito" ON carritos_items;
CREATE POLICY "usuarios_pueden_crear_items_su_carrito"
  ON carritos_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carritos c
      WHERE c.id = carritos_items.carrito_id
      AND c.usuario_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "usuarios_pueden_actualizar_items_su_carrito" ON carritos_items;
CREATE POLICY "usuarios_pueden_actualizar_items_su_carrito"
  ON carritos_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM carritos c
      WHERE c.id = carritos_items.carrito_id
      AND c.usuario_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carritos c
      WHERE c.id = carritos_items.carrito_id
      AND c.usuario_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "usuarios_pueden_eliminar_items_su_carrito" ON carritos_items;
CREATE POLICY "usuarios_pueden_eliminar_items_su_carrito"
  ON carritos_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM carritos c
      WHERE c.id = carritos_items.carrito_id
      AND c.usuario_id = auth.uid()
    )
  );

-- ============================================
-- FIN DEL SCRIPT DE POLÍTICAS
-- ============================================

