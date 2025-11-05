-- ============================================
-- SISTEMA DE ANÁLISIS DE VENTAS E INVENTARIO
-- Base de Datos PostgreSQL en Supabase
-- Hackatón de Programación 2025
-- ============================================
-- 
-- ARCHIVO 1: ESTRUCTURA DE TABLAS
-- 
-- Este script crea todas las tablas, relaciones e índices
-- 
-- INSTRUCCIONES:
-- 1. Ejecutar este script primero en Supabase SQL Editor
-- 2. Luego ejecutar 02_triggers.sql
-- 3. Luego ejecutar 03_policies.sql
-- 4. Finalmente ejecutar 04_datos_ejemplo.sql
-- 
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLAS DEL SISTEMA
-- ============================================

-- --------------------------------------------
-- Tabla: roles_usuario
-- Descripción: Define los roles disponibles en el sistema
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS roles_usuario (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  permisos JSONB DEFAULT '{}',
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para roles_usuario
CREATE INDEX IF NOT EXISTS idx_roles_usuario_nombre ON roles_usuario(nombre);

-- --------------------------------------------
-- Tabla: usuarios
-- Descripción: Información extendida de usuarios sincronizada con auth.users
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(255),
  rol_id UUID REFERENCES roles_usuario(id) ON DELETE SET NULL,
  telefono VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- --------------------------------------------
-- Tabla: categorias
-- Descripción: Categorías de productos para normalización
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activa BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para categorias
CREATE INDEX IF NOT EXISTS idx_categorias_nombre ON categorias(nombre);
CREATE INDEX IF NOT EXISTS idx_categorias_activa ON categorias(activa);

-- --------------------------------------------
-- Tabla: clientes
-- Descripción: Información de clientes para ventas
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(50),
  direccion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON clientes(activo);

-- --------------------------------------------
-- Tabla: productos
-- Descripción: Catálogo de productos con información completa
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  categoria VARCHAR(100),
  talla VARCHAR(50),
  genero VARCHAR(50),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  stock_minimo INTEGER DEFAULT 10 CHECK (stock_minimo >= 0),
  precio DECIMAL(10, 2) DEFAULT 0 CHECK (precio >= 0),
  precio_costo DECIMAL(10, 2) DEFAULT 0 CHECK (precio_costo >= 0),
  descripcion TEXT,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_genero ON productos(genero);
CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- --------------------------------------------
-- Tabla: ventas
-- Descripción: Registro de todas las ventas realizadas
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS ventas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero_venta VARCHAR(50) UNIQUE,
  producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto VARCHAR(255) NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  nombre_cliente VARCHAR(255),
  cantidad INTEGER DEFAULT 1 CHECK (cantidad > 0),
  precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  precio_total DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  descuento DECIMAL(10, 2) DEFAULT 0 CHECK (descuento >= 0),
  metodo_pago VARCHAR(50),
  notas TEXT,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fecha_venta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para ventas
CREATE INDEX IF NOT EXISTS idx_ventas_numero_venta ON ventas(numero_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_producto_id ON ventas(producto_id);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente_id ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_usuario_id ON ventas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_venta ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_nombre_producto ON ventas(nombre_producto);

-- --------------------------------------------
-- Tabla: movimientos_inventario
-- Descripción: Historial completo de todos los movimientos de inventario
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  tipo_movimiento VARCHAR(50) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste', 'devolucion')),
  cantidad INTEGER NOT NULL,
  stock_anterior INTEGER NOT NULL,
  stock_nuevo INTEGER NOT NULL,
  motivo TEXT,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referencia_venta UUID REFERENCES ventas(id) ON DELETE SET NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para movimientos_inventario
CREATE INDEX IF NOT EXISTS idx_movimientos_producto_id ON movimientos_inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON movimientos_inventario(tipo_movimiento);
CREATE INDEX IF NOT EXISTS idx_movimientos_usuario_id ON movimientos_inventario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_referencia_venta ON movimientos_inventario(referencia_venta);
CREATE INDEX IF NOT EXISTS idx_movimientos_creado_en ON movimientos_inventario(creado_en);

-- --------------------------------------------
-- Tabla: recomendaciones
-- Descripción: Recomendaciones automáticas generadas por el sistema
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS recomendaciones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  tipo_recomendacion VARCHAR(50) NOT NULL CHECK (tipo_recomendacion IN ('descuento', 'reposicion', 'revision', 'promocion')),
  prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta')),
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  resuelta BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resuelto_en TIMESTAMP WITH TIME ZONE
);

-- Índices para recomendaciones
CREATE INDEX IF NOT EXISTS idx_recomendaciones_producto_id ON recomendaciones(producto_id);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_tipo ON recomendaciones(tipo_recomendacion);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_prioridad ON recomendaciones(prioridad);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_leida ON recomendaciones(leida);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_resuelta ON recomendaciones(resuelta);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- --------------------------------------------
-- Vista: productos_con_estadisticas
-- Descripción: Productos con estadísticas de ventas agregadas
-- --------------------------------------------
CREATE OR REPLACE VIEW productos_con_estadisticas AS
SELECT 
  p.id,
  p.nombre,
  p.sku,
  c.nombre as nombre_categoria,
  p.categoria,
  p.talla,
  p.genero,
  p.stock,
  p.stock_minimo,
  p.precio,
  p.precio_costo,
  p.precio - p.precio_costo as margen_ganancia,
  p.descripcion,
  p.imagen_url,
  p.activo,
  p.creado_en,
  p.actualizado_en,
  COALESCE(SUM(v.cantidad), 0) as total_ventas,
  COALESCE(SUM(v.precio_total), 0) as ingresos_totales,
  COALESCE(SUM(v.precio_total - (v.cantidad * p.precio_costo)), 0) as ganancia_total,
  CASE 
    WHEN p.stock > 0 THEN ROUND((COALESCE(SUM(v.cantidad), 0)::DECIMAL / p.stock) * 100, 2)
    ELSE 0
  END as porcentaje_rotacion,
  CASE 
    WHEN p.stock <= p.stock_minimo THEN TRUE
    ELSE FALSE
  END as alerta_stock_bajo
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN ventas v ON p.id = v.producto_id
GROUP BY p.id, p.nombre, p.sku, c.nombre, p.categoria, p.talla, p.genero, p.stock, p.stock_minimo, p.precio, p.precio_costo, p.descripcion, p.imagen_url, p.activo, p.creado_en, p.actualizado_en;

-- --------------------------------------------
-- Vista: ventas_con_detalles
-- Descripción: Ventas con información completa de productos y clientes
-- --------------------------------------------
CREATE OR REPLACE VIEW ventas_con_detalles AS
SELECT 
  v.id,
  v.numero_venta,
  v.fecha_venta,
  v.producto_id,
  v.nombre_producto,
  p.categoria,
  p.genero,
  v.cliente_id,
  c.nombre as nombre_cliente,
  c.email as email_cliente,
  v.cantidad,
  v.precio_unitario,
  v.precio_total,
  v.descuento,
  v.precio_total - v.descuento as precio_final,
  v.metodo_pago,
  v.notas,
  u.email as email_usuario,
  v.creado_en,
  v.actualizado_en
FROM ventas v
LEFT JOIN productos p ON v.producto_id = p.id
LEFT JOIN clientes c ON v.cliente_id = c.id
LEFT JOIN usuarios u ON v.usuario_id = u.id;

-- --------------------------------------------
-- Vista: resumen_ventas_diarias
-- Descripción: Resumen de ventas agrupadas por día
-- --------------------------------------------
CREATE OR REPLACE VIEW resumen_ventas_diarias AS
SELECT 
  DATE(fecha_venta) as fecha,
  COUNT(*) as total_ventas,
  SUM(cantidad) as total_items_vendidos,
  SUM(precio_total) as ingresos_totales,
  SUM(precio_total - descuento) as ingresos_netos,
  AVG(precio_total) as promedio_venta,
  MAX(precio_total) as venta_maxima,
  MIN(precio_total) as venta_minima
FROM ventas
GROUP BY DATE(fecha_venta)
ORDER BY fecha DESC;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar roles por defecto
INSERT INTO roles_usuario (nombre, descripcion) VALUES
('usuario', 'Usuario con permisos básicos de lectura y escritura'),
('administrador', 'Usuario con permisos completos del sistema'),
('gerente', 'Usuario con permisos de gestión y análisis')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion) VALUES
('Ropa', 'Prendas de vestir para hombre, mujer y unisex'),
('Calzado', 'Zapatos, zapatillas y sandalias'),
('Accesorios', 'Complementos y accesorios varios')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- FIN DEL SCRIPT DE TABLAS
-- ============================================

