-- ============================================
-- SISTEMA DE ANÁLISIS DE VENTAS E INVENTARIO
-- Base de Datos PostgreSQL en Supabase
-- Hackatón de Programación 2025
-- ============================================
-- 
-- ARCHIVO 3: ROW LEVEL SECURITY (RLS) Y POLÍTICAS
-- 
-- Este script configura las políticas de seguridad RLS
-- 
-- INSTRUCCIONES:
-- 1. Ejecutar 01_tablas.sql primero
-- 2. Luego ejecutar 02_triggers.sql
-- 3. Luego ejecutar este script
-- 4. Finalmente ejecutar 04_datos_ejemplo.sql
-- 
-- ============================================

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE roles_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE recomendaciones ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS
-- ============================================

-- --------------------------------------------
-- Políticas RLS para roles_usuario
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_autenticados_pueden_ver_roles" ON roles_usuario;
CREATE POLICY "usuarios_autenticados_pueden_ver_roles"
  ON roles_usuario FOR SELECT
  USING (auth.role() = 'authenticated');

-- --------------------------------------------
-- Políticas RLS para usuarios
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_pueden_ver_otros_usuarios" ON usuarios;
CREATE POLICY "usuarios_pueden_ver_otros_usuarios"
  ON usuarios FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_pueden_actualizar_su_perfil" ON usuarios;
CREATE POLICY "usuarios_pueden_actualizar_su_perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- --------------------------------------------
-- Políticas RLS para categorias
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_autenticados_pueden_ver_categorias" ON categorias;
CREATE POLICY "usuarios_autenticados_pueden_ver_categorias"
  ON categorias FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_insertar_categorias" ON categorias;
CREATE POLICY "usuarios_autenticados_pueden_insertar_categorias"
  ON categorias FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_actualizar_categorias" ON categorias;
CREATE POLICY "usuarios_autenticados_pueden_actualizar_categorias"
  ON categorias FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_eliminar_categorias" ON categorias;
CREATE POLICY "usuarios_autenticados_pueden_eliminar_categorias"
  ON categorias FOR DELETE
  USING (auth.role() = 'authenticated');

-- --------------------------------------------
-- Políticas RLS para clientes
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_autenticados_pueden_ver_clientes" ON clientes;
CREATE POLICY "usuarios_autenticados_pueden_ver_clientes"
  ON clientes FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_insertar_clientes" ON clientes;
CREATE POLICY "usuarios_autenticados_pueden_insertar_clientes"
  ON clientes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_actualizar_clientes" ON clientes;
CREATE POLICY "usuarios_autenticados_pueden_actualizar_clientes"
  ON clientes FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_eliminar_clientes" ON clientes;
CREATE POLICY "usuarios_autenticados_pueden_eliminar_clientes"
  ON clientes FOR DELETE
  USING (auth.role() = 'authenticated');

-- --------------------------------------------
-- Políticas RLS para productos
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_autenticados_pueden_ver_productos" ON productos;
CREATE POLICY "usuarios_autenticados_pueden_ver_productos"
  ON productos FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_insertar_productos" ON productos;
CREATE POLICY "usuarios_autenticados_pueden_insertar_productos"
  ON productos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_actualizar_productos" ON productos;
CREATE POLICY "usuarios_autenticados_pueden_actualizar_productos"
  ON productos FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_eliminar_productos" ON productos;
CREATE POLICY "usuarios_autenticados_pueden_eliminar_productos"
  ON productos FOR DELETE
  USING (auth.role() = 'authenticated');

-- --------------------------------------------
-- Políticas RLS para ventas
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_autenticados_pueden_ver_ventas" ON ventas;
CREATE POLICY "usuarios_autenticados_pueden_ver_ventas"
  ON ventas FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_insertar_ventas" ON ventas;
CREATE POLICY "usuarios_autenticados_pueden_insertar_ventas"
  ON ventas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_actualizar_ventas" ON ventas;
CREATE POLICY "usuarios_autenticados_pueden_actualizar_ventas"
  ON ventas FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_eliminar_ventas" ON ventas;
CREATE POLICY "usuarios_autenticados_pueden_eliminar_ventas"
  ON ventas FOR DELETE
  USING (auth.role() = 'authenticated');

-- --------------------------------------------
-- Políticas RLS para movimientos_inventario
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_autenticados_pueden_ver_movimientos" ON movimientos_inventario;
CREATE POLICY "usuarios_autenticados_pueden_ver_movimientos"
  ON movimientos_inventario FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "sistema_puede_insertar_movimientos" ON movimientos_inventario;
CREATE POLICY "sistema_puede_insertar_movimientos"
  ON movimientos_inventario FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- --------------------------------------------
-- Políticas RLS para recomendaciones
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_autenticados_pueden_ver_recomendaciones" ON recomendaciones;
CREATE POLICY "usuarios_autenticados_pueden_ver_recomendaciones"
  ON recomendaciones FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_insertar_recomendaciones" ON recomendaciones;
CREATE POLICY "usuarios_autenticados_pueden_insertar_recomendaciones"
  ON recomendaciones FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "usuarios_autenticados_pueden_actualizar_recomendaciones" ON recomendaciones;
CREATE POLICY "usuarios_autenticados_pueden_actualizar_recomendaciones"
  ON recomendaciones FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- FIN DEL SCRIPT DE POLÍTICAS
-- ============================================

