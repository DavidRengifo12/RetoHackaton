-- ============================================
-- SISTEMA DE ANÁLISIS DE VENTAS E INVENTARIO
-- Base de Datos PostgreSQL en Supabase
-- Hackatón de Programación 2025
-- ============================================
-- 
-- ARCHIVO 2: FUNCIONES Y TRIGGERS AUTOMÁTICOS
-- 
-- Este script crea las funciones y triggers automáticos
-- 
-- INSTRUCCIONES:
-- 1. Ejecutar 01_tablas.sql primero
-- 2. Luego ejecutar este script
-- 3. Luego ejecutar 03_policies.sql
-- 4. Finalmente ejecutar 04_datos_ejemplo.sql
-- 
-- ============================================

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- --------------------------------------------
-- Función: actualizar_timestamp
-- Descripción: Actualiza automáticamente el campo actualizado_en
-- --------------------------------------------
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------
-- Función: generar_numero_venta
-- Descripción: Genera un número de venta único automáticamente
-- Formato: VENTA-YYYYMMDD-XXXXXX
-- --------------------------------------------
CREATE OR REPLACE FUNCTION generar_numero_venta()
RETURNS TRIGGER AS $$
DECLARE
  numero_secuencial INTEGER;
  fecha_actual VARCHAR(8);
BEGIN
  -- Obtener la fecha actual en formato YYYYMMDD
  fecha_actual := TO_CHAR(NOW(), 'YYYYMMDD');
  
  -- Si no existe número de venta, generar uno nuevo
  IF NEW.numero_venta IS NULL THEN
    -- Obtener el siguiente número secuencial del día
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_venta FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO numero_secuencial
    FROM ventas
    WHERE numero_venta LIKE 'VENTA-' || fecha_actual || '-%';
    
    -- Construir el número de venta
    NEW.numero_venta := 'VENTA-' || fecha_actual || '-' || LPAD(numero_secuencial::TEXT, 6, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------
-- Función: registrar_movimiento_inventario
-- Descripción: Registra automáticamente un movimiento de inventario
-- Parámetros: producto_id, tipo_movimiento, cantidad, motivo, usuario_id
-- --------------------------------------------
CREATE OR REPLACE FUNCTION registrar_movimiento_inventario(
  p_producto_id UUID,
  p_tipo_movimiento VARCHAR,
  p_cantidad INTEGER,
  p_motivo TEXT DEFAULT NULL,
  p_usuario_id UUID DEFAULT NULL,
  p_referencia_venta UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_stock_anterior INTEGER;
  v_stock_nuevo INTEGER;
  v_movimiento_id UUID;
BEGIN
  -- Obtener stock actual del producto
  SELECT stock INTO v_stock_anterior
  FROM productos
  WHERE id = p_producto_id;
  
  -- Calcular nuevo stock según tipo de movimiento
  IF p_tipo_movimiento = 'entrada' OR p_tipo_movimiento = 'devolucion' THEN
    v_stock_nuevo := v_stock_anterior + ABS(p_cantidad);
  ELSIF p_tipo_movimiento = 'salida' THEN
    v_stock_nuevo := v_stock_anterior - ABS(p_cantidad);
  ELSIF p_tipo_movimiento = 'ajuste' THEN
    v_stock_nuevo := p_cantidad;
  ELSE
    RAISE EXCEPTION 'Tipo de movimiento no válido: %', p_tipo_movimiento;
  END IF;
  
  -- Asegurar que el stock no sea negativo
  IF v_stock_nuevo < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente. Stock actual: %, Cantidad solicitada: %', v_stock_anterior, ABS(p_cantidad);
  END IF;
  
  -- Actualizar stock del producto
  UPDATE productos
  SET stock = v_stock_nuevo,
      actualizado_en = NOW()
  WHERE id = p_producto_id;
  
  -- Registrar el movimiento
  INSERT INTO movimientos_inventario (
    producto_id,
    tipo_movimiento,
    cantidad,
    stock_anterior,
    stock_nuevo,
    motivo,
    usuario_id,
    referencia_venta
  )
  VALUES (
    p_producto_id,
    p_tipo_movimiento,
    p_cantidad,
    v_stock_anterior,
    v_stock_nuevo,
    p_motivo,
    p_usuario_id,
    p_referencia_venta
  )
  RETURNING id INTO v_movimiento_id;
  
  RETURN v_movimiento_id;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------
-- Función: crear_usuario
-- Descripción: Asigna automáticamente el rol de "usuario" al registrarse
-- Se ejecuta automáticamente cuando se crea un usuario en auth.users
-- --------------------------------------------
CREATE OR REPLACE FUNCTION crear_usuario()
RETURNS TRIGGER AS $$
DECLARE
  v_rol_usuario UUID;
BEGIN
  -- Buscar el ID del rol "usuario"
  SELECT id INTO v_rol_usuario
  FROM roles_usuario
  WHERE nombre = 'usuario'
  LIMIT 1;
  
  -- Si no existe el rol, crearlo
  IF v_rol_usuario IS NULL THEN
    INSERT INTO roles_usuario (nombre, descripcion)
    VALUES ('usuario', 'Usuario con permisos básicos de lectura y escritura')
    RETURNING id INTO v_rol_usuario;
  END IF;
  
  -- Insertar el usuario con el rol de "usuario"
  INSERT INTO usuarios (
    id,
    email,
    nombre_completo,
    rol_id,
    activo
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', NEW.email),
    v_rol_usuario,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE
  SET email = NEW.email,
      actualizado_en = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------
-- Función: procesar_venta_inventario
-- Descripción: Procesa automáticamente el movimiento de inventario al crear una venta
-- --------------------------------------------
CREATE OR REPLACE FUNCTION procesar_venta_inventario()
RETURNS TRIGGER AS $$
DECLARE
  v_movimiento_id UUID;
BEGIN
  -- Registrar salida de inventario automáticamente
  SELECT registrar_movimiento_inventario(
    NEW.producto_id,
    'salida',
    NEW.cantidad,
    'Venta registrada: ' || NEW.numero_venta,
    NEW.usuario_id,
    NEW.id
  ) INTO v_movimiento_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS AUTOMÁTICOS
-- ============================================

-- --------------------------------------------
-- Trigger: Actualizar timestamp en productos
-- --------------------------------------------
DROP TRIGGER IF EXISTS trigger_actualizar_productos ON productos;
CREATE TRIGGER trigger_actualizar_productos
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

-- --------------------------------------------
-- Trigger: Actualizar timestamp en categorias
-- --------------------------------------------
DROP TRIGGER IF EXISTS trigger_actualizar_categorias ON categorias;
CREATE TRIGGER trigger_actualizar_categorias
  BEFORE UPDATE ON categorias
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

-- --------------------------------------------
-- Trigger: Actualizar timestamp en clientes
-- --------------------------------------------
DROP TRIGGER IF EXISTS trigger_actualizar_clientes ON clientes;
CREATE TRIGGER trigger_actualizar_clientes
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

-- --------------------------------------------
-- Trigger: Actualizar timestamp en usuarios
-- --------------------------------------------
DROP TRIGGER IF EXISTS trigger_actualizar_usuarios ON usuarios;
CREATE TRIGGER trigger_actualizar_usuarios
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

-- --------------------------------------------
-- Trigger: Actualizar timestamp en ventas
-- --------------------------------------------
DROP TRIGGER IF EXISTS trigger_actualizar_ventas ON ventas;
CREATE TRIGGER trigger_actualizar_ventas
  BEFORE UPDATE ON ventas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

-- --------------------------------------------
-- Trigger: Generar número de venta automáticamente
-- --------------------------------------------
DROP TRIGGER IF EXISTS trigger_generar_numero_venta ON ventas;
CREATE TRIGGER trigger_generar_numero_venta
  BEFORE INSERT ON ventas
  FOR EACH ROW
  EXECUTE FUNCTION generar_numero_venta();

-- --------------------------------------------
-- Trigger: Registrar movimiento de inventario al crear venta
-- --------------------------------------------
DROP TRIGGER IF EXISTS trigger_procesar_venta_inventario ON ventas;
CREATE TRIGGER trigger_procesar_venta_inventario
  AFTER INSERT ON ventas
  FOR EACH ROW
  EXECUTE FUNCTION procesar_venta_inventario();

-- --------------------------------------------
-- Trigger: Crear usuario en tabla usuarios cuando se registra en auth.users
-- --------------------------------------------
DROP TRIGGER IF EXISTS trigger_crear_usuario ON auth.users;
CREATE TRIGGER trigger_crear_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION crear_usuario();

-- ============================================
-- FIN DEL SCRIPT DE TRIGGERS
-- ============================================

