-- ============================================
-- DATOS DE EJEMPLO PARA SISTEMA DE INVENTARIO (VERSIÓN CORREGIDA)
-- Base de Datos PostgreSQL en Supabase
-- Hackatón de Programación 2025
-- ============================================
-- 
-- Este script inserta datos de ejemplo para probar el sistema
-- IMPORTANTE: Ejecutar después de 01_tablas.sql, 02_triggers.sql y 03_policies.sql
-- 
-- NOTA: Esta versión usa IDs directos en lugar de subconsultas para evitar errores
-- ============================================

-- Limpiar datos existentes (opcional, comentar si no deseas borrar)
-- DELETE FROM ventas;
-- DELETE FROM movimientos_inventario;
-- DELETE FROM recomendaciones;
-- DELETE FROM productos;
-- DELETE FROM clientes;

-- ============================================
-- OBTENER IDs DE CATEGORÍAS (debe ejecutarse primero)
-- ============================================
-- Obtener los IDs de las categorías antes de insertar productos
DO $$
DECLARE
  cat_ropa_id UUID;
  cat_calzado_id UUID;
  cat_accesorios_id UUID;
BEGIN
  SELECT id INTO cat_ropa_id FROM categorias WHERE nombre = 'Ropa' LIMIT 1;
  SELECT id INTO cat_calzado_id FROM categorias WHERE nombre = 'Calzado' LIMIT 1;
  SELECT id INTO cat_accesorios_id FROM categorias WHERE nombre = 'Accesorios' LIMIT 1;
  
  -- Si no existen las categorías, crearlas
  IF cat_ropa_id IS NULL THEN
    INSERT INTO categorias (nombre, descripcion) VALUES ('Ropa', 'Ropa y prendas de vestir') RETURNING id INTO cat_ropa_id;
  END IF;
  
  IF cat_calzado_id IS NULL THEN
    INSERT INTO categorias (nombre, descripcion) VALUES ('Calzado', 'Zapatos y calzado') RETURNING id INTO cat_calzado_id;
  END IF;
  
  IF cat_accesorios_id IS NULL THEN
    INSERT INTO categorias (nombre, descripcion) VALUES ('Accesorios', 'Accesorios y complementos') RETURNING id INTO cat_accesorios_id;
  END IF;
  
  -- ============================================
  -- INSERTAR PRODUCTOS DE EJEMPLO
  -- ============================================
  
  INSERT INTO productos (nombre, sku, categoria_id, categoria, talla, genero, stock, stock_minimo, precio, precio_costo, descripcion) VALUES
  -- Ropa - Hombre
  ('Camiseta Básica Negra', 'CAM-001-NEG-M', cat_ropa_id, 'Ropa', 'M', 'Hombre', 50, 10, 29.99, 15.00, 'Camiseta de algodón 100%, color negro, manga corta'),
  ('Camiseta Básica Blanca', 'CAM-002-BLC-L', cat_ropa_id, 'Ropa', 'L', 'Hombre', 45, 10, 29.99, 15.00, 'Camiseta de algodón 100%, color blanco, manga corta'),
  ('Pantalón Vaquero Clásico', 'PAN-001-32', cat_ropa_id, 'Ropa', '32', 'Hombre', 30, 5, 59.99, 35.00, 'Pantalón vaquero de corte clásico, color azul'),
  ('Pantalón Vaquero Clásico', 'PAN-002-34', cat_ropa_id, 'Ropa', '34', 'Hombre', 25, 5, 59.99, 35.00, 'Pantalón vaquero de corte clásico, color azul'),
  ('Chaqueta de Cuero', 'CHA-001-L', cat_ropa_id, 'Ropa', 'L', 'Hombre', 15, 3, 129.99, 80.00, 'Chaqueta de cuero genuino, estilo casual'),
  ('Chaqueta Impermeable', 'CHA-002-M', cat_ropa_id, 'Ropa', 'M', 'Hombre', 20, 5, 89.99, 50.00, 'Chaqueta resistente al agua, ideal para lluvia'),
  
  -- Ropa - Mujer
  ('Vestido Casual Floral', 'VES-001-S', cat_ropa_id, 'Ropa', 'S', 'Mujer', 25, 5, 49.99, 25.00, 'Vestido casual para día a día, estampado floral'),
  ('Vestido Casual Floral', 'VES-002-M', cat_ropa_id, 'Ropa', 'M', 'Mujer', 30, 5, 49.99, 25.00, 'Vestido casual para día a día, estampado floral'),
  ('Blusa Elegante', 'BLU-001-S', cat_ropa_id, 'Ropa', 'S', 'Mujer', 35, 5, 39.99, 20.00, 'Blusa elegante para ocasiones especiales'),
  ('Falda Plisada', 'FAL-001-M', cat_ropa_id, 'Ropa', 'M', 'Mujer', 32, 5, 34.99, 18.00, 'Falda plisada, cómoda y versátil'),
  
  -- Ropa - Unisex
  ('Sudadera con Capucha', 'SUD-001-M', cat_ropa_id, 'Ropa', 'M', 'Unisex', 40, 10, 59.99, 35.00, 'Sudadera cómoda con capucha, ideal para clima frío'),
  ('Sudadera con Capucha', 'SUD-002-L', cat_ropa_id, 'Ropa', 'L', 'Unisex', 35, 10, 59.99, 35.00, 'Sudadera cómoda con capucha, ideal para clima frío'),
  ('Camiseta Polo', 'POL-001-M', cat_ropa_id, 'Ropa', 'M', 'Unisex', 50, 10, 44.99, 25.00, 'Polo clásico, algodón pima, varios colores'),
  
  -- Calzado
  ('Zapatillas Deportivas Running', 'ZAP-001-42', cat_calzado_id, 'Calzado', '42', 'Unisex', 40, 10, 79.99, 45.00, 'Zapatillas para running, tecnología de amortiguación'),
  ('Zapatillas Deportivas Running', 'ZAP-002-43', cat_calzado_id, 'Calzado', '43', 'Unisex', 35, 10, 79.99, 45.00, 'Zapatillas para running, tecnología de amortiguación'),
  ('Zapatos Casuales', 'ZAP-003-40', cat_calzado_id, 'Calzado', '40', 'Hombre', 25, 5, 69.99, 40.00, 'Zapatos casuales de cuero, cómodos para caminar'),
  ('Sandalias Playa', 'SAN-001-39', cat_calzado_id, 'Calzado', '39', 'Mujer', 28, 5, 24.99, 12.00, 'Sandalias cómodas para playa, goma resistente'),
  ('Botas Invierno', 'BOT-001-42', cat_calzado_id, 'Calzado', '42', 'Unisex', 15, 3, 99.99, 60.00, 'Botas resistentes al agua, forro térmico'),
  
  -- Accesorios
  ('Gorra Deportiva', 'GOR-001-UNI', cat_accesorios_id, 'Accesorios', 'Única', 'Unisex', 60, 15, 19.99, 10.00, 'Gorra ajustable, protección UV'),
  ('Bufanda Lana', 'BUF-001-UNI', cat_accesorios_id, 'Accesorios', 'Única', 'Unisex', 45, 10, 29.99, 15.00, 'Bufanda de lana merino, cálida y suave'),
  ('Guantes Invierno', 'GUA-001-M', cat_accesorios_id, 'Accesorios', 'M', 'Unisex', 40, 10, 24.99, 12.00, 'Guantes térmicos, resistentes al agua'),
  ('Cinturón Cuero', 'CIN-001-L', cat_accesorios_id, 'Accesorios', 'L', 'Hombre', 45, 10, 34.99, 18.00, 'Cinturón de cuero genuino, hebilla metálica'),
  ('Bolso Tote', 'BOL-001-UNI', cat_accesorios_id, 'Accesorios', 'Única', 'Mujer', 30, 5, 49.99, 25.00, 'Bolso tote grande, algodón resistente'),
  ('Mochila Escolar', 'MOC-001-UNI', cat_accesorios_id, 'Accesorios', 'Única', 'Unisex', 40, 10, 59.99, 35.00, 'Mochila resistente, múltiples compartimentos')
  
  ON CONFLICT (sku) DO NOTHING;
  
END $$;

-- ============================================
-- INSERTAR CLIENTES DE EJEMPLO
-- ============================================

INSERT INTO clientes (nombre, email, telefono) VALUES
('Juan Pérez', 'juan.perez@email.com', '+34 600 123 456'),
('María González', 'maria.gonzalez@email.com', '+34 600 234 567'),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '+34 600 345 678'),
('Ana Martínez', 'ana.martinez@email.com', '+34 600 456 789'),
('Luis Fernández', 'luis.fernandez@email.com', '+34 600 567 890'),
('Laura Torres', 'laura.torres@email.com', '+34 600 678 901'),
('Pedro Sánchez', 'pedro.sanchez@email.com', '+34 600 789 012'),
('Sofía Ramírez', 'sofia.ramirez@email.com', '+34 600 890 123'),
('Miguel López', 'miguel.lopez@email.com', '+34 600 901 234'),
('Carmen Ruiz', 'carmen.ruiz@email.com', '+34 600 012 345')

ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTAR VENTAS DE EJEMPLO
-- ============================================
-- NOTA: Las ventas se distribuyen en los últimos 30 días
-- Los triggers automáticamente:
-- 1. Generarán el número de venta
-- 2. Actualizarán el stock del producto
-- 3. Registrarán el movimiento de inventario

-- Ventas de hace 30 días
INSERT INTO ventas (producto_id, nombre_producto, cliente_id, nombre_cliente, cantidad, precio_unitario, metodo_pago, fecha_venta) VALUES
((SELECT id FROM productos WHERE sku = 'CAM-001-NEG-M' LIMIT 1), 'Camiseta Básica Negra', (SELECT id FROM clientes WHERE email = 'juan.perez@email.com' LIMIT 1), 'Juan Pérez', 3, 29.99, 'Tarjeta', NOW() - INTERVAL '30 days'),
((SELECT id FROM productos WHERE sku = 'PAN-001-32' LIMIT 1), 'Pantalón Vaquero Clásico', (SELECT id FROM clientes WHERE email = 'carlos.rodriguez@email.com' LIMIT 1), 'Carlos Rodríguez', 1, 59.99, 'Efectivo', NOW() - INTERVAL '30 days'),
((SELECT id FROM productos WHERE sku = 'ZAP-001-42' LIMIT 1), 'Zapatillas Deportivas Running', (SELECT id FROM clientes WHERE email = 'maria.gonzalez@email.com' LIMIT 1), 'María González', 2, 79.99, 'Tarjeta', NOW() - INTERVAL '30 days'),

-- Ventas de hace 25 días
((SELECT id FROM productos WHERE sku = 'VES-002-M' LIMIT 1), 'Vestido Casual Floral', (SELECT id FROM clientes WHERE email = 'ana.martinez@email.com' LIMIT 1), 'Ana Martínez', 2, 49.99, 'Transferencia', NOW() - INTERVAL '25 days'),
((SELECT id FROM productos WHERE sku = 'SUD-002-L' LIMIT 1), 'Sudadera con Capucha', (SELECT id FROM clientes WHERE email = 'luis.fernandez@email.com' LIMIT 1), 'Luis Fernández', 1, 59.99, 'Tarjeta', NOW() - INTERVAL '25 days'),

-- Ventas de hace 20 días
((SELECT id FROM productos WHERE sku = 'CAM-002-BLC-L' LIMIT 1), 'Camiseta Básica Blanca', (SELECT id FROM clientes WHERE email = 'laura.torres@email.com' LIMIT 1), 'Laura Torres', 4, 29.99, 'Efectivo', NOW() - INTERVAL '20 days'),
((SELECT id FROM productos WHERE sku = 'CHA-002-M' LIMIT 1), 'Chaqueta Impermeable', (SELECT id FROM clientes WHERE email = 'pedro.sanchez@email.com' LIMIT 1), 'Pedro Sánchez', 1, 89.99, 'Tarjeta', NOW() - INTERVAL '20 days'),

-- Ventas de hace 15 días
((SELECT id FROM productos WHERE sku = 'ZAP-002-43' LIMIT 1), 'Zapatillas Deportivas Running', (SELECT id FROM clientes WHERE email = 'miguel.lopez@email.com' LIMIT 1), 'Miguel López', 3, 79.99, 'Tarjeta', NOW() - INTERVAL '15 days'),
((SELECT id FROM productos WHERE sku = 'FAL-001-M' LIMIT 1), 'Falda Plisada', (SELECT id FROM clientes WHERE email = 'carmen.ruiz@email.com' LIMIT 1), 'Carmen Ruiz', 2, 34.99, 'Efectivo', NOW() - INTERVAL '15 days'),
((SELECT id FROM productos WHERE sku = 'GOR-001-UNI' LIMIT 1), 'Gorra Deportiva', (SELECT id FROM clientes WHERE email = 'juan.perez@email.com' LIMIT 1), 'Juan Pérez', 5, 19.99, 'Tarjeta', NOW() - INTERVAL '15 days'),

-- Ventas de hace 10 días
((SELECT id FROM productos WHERE sku = 'PAN-002-34' LIMIT 1), 'Pantalón Vaquero Clásico', (SELECT id FROM clientes WHERE email = 'sofia.ramirez@email.com' LIMIT 1), 'Sofía Ramírez', 2, 59.99, 'Transferencia', NOW() - INTERVAL '10 days'),
((SELECT id FROM productos WHERE sku = 'SAN-001-39' LIMIT 1), 'Sandalias Playa', (SELECT id FROM clientes WHERE email = 'maria.gonzalez@email.com' LIMIT 1), 'María González', 3, 24.99, 'Efectivo', NOW() - INTERVAL '10 days'),

-- Ventas de hace 7 días
((SELECT id FROM productos WHERE sku = 'BOT-001-42' LIMIT 1), 'Botas Invierno', (SELECT id FROM clientes WHERE email = 'carlos.rodriguez@email.com' LIMIT 1), 'Carlos Rodríguez', 1, 99.99, 'Tarjeta', NOW() - INTERVAL '7 days'),
((SELECT id FROM productos WHERE sku = 'BUF-001-UNI' LIMIT 1), 'Bufanda Lana', (SELECT id FROM clientes WHERE email = 'ana.martinez@email.com' LIMIT 1), 'Ana Martínez', 4, 29.99, 'Efectivo', NOW() - INTERVAL '7 days'),
((SELECT id FROM productos WHERE sku = 'MOC-001-UNI' LIMIT 1), 'Mochila Escolar', (SELECT id FROM clientes WHERE email = 'luis.fernandez@email.com' LIMIT 1), 'Luis Fernández', 2, 59.99, 'Tarjeta', NOW() - INTERVAL '7 days'),

-- Ventas de hace 5 días
((SELECT id FROM productos WHERE sku = 'CAM-001-NEG-M' LIMIT 1), 'Camiseta Básica Negra', (SELECT id FROM clientes WHERE email = 'laura.torres@email.com' LIMIT 1), 'Laura Torres', 5, 29.99, 'Tarjeta', NOW() - INTERVAL '5 days'),
((SELECT id FROM productos WHERE sku = 'VES-001-S' LIMIT 1), 'Vestido Casual Floral', (SELECT id FROM clientes WHERE email = 'pedro.sanchez@email.com' LIMIT 1), 'Pedro Sánchez', 3, 49.99, 'Transferencia', NOW() - INTERVAL '5 days'),

-- Ventas de hace 3 días
((SELECT id FROM productos WHERE sku = 'CHA-001-L' LIMIT 1), 'Chaqueta de Cuero', (SELECT id FROM clientes WHERE email = 'miguel.lopez@email.com' LIMIT 1), 'Miguel López', 1, 129.99, 'Tarjeta', NOW() - INTERVAL '3 days'),
((SELECT id FROM productos WHERE sku = 'BOL-001-UNI' LIMIT 1), 'Bolso Tote', (SELECT id FROM clientes WHERE email = 'carmen.ruiz@email.com' LIMIT 1), 'Carmen Ruiz', 2, 49.99, 'Efectivo', NOW() - INTERVAL '3 days'),

-- Ventas de hace 2 días
((SELECT id FROM productos WHERE sku = 'POL-001-M' LIMIT 1), 'Camiseta Polo', (SELECT id FROM clientes WHERE email = 'juan.perez@email.com' LIMIT 1), 'Juan Pérez', 2, 44.99, 'Tarjeta', NOW() - INTERVAL '2 days'),
((SELECT id FROM productos WHERE sku = 'CIN-001-L' LIMIT 1), 'Cinturón Cuero', (SELECT id FROM clientes WHERE email = 'maria.gonzalez@email.com' LIMIT 1), 'María González', 1, 34.99, 'Efectivo', NOW() - INTERVAL '2 days'),

-- Ventas de ayer
((SELECT id FROM productos WHERE sku = 'ZAP-003-40' LIMIT 1), 'Zapatos Casuales', (SELECT id FROM clientes WHERE email = 'carlos.rodriguez@email.com' LIMIT 1), 'Carlos Rodríguez', 1, 69.99, 'Tarjeta', NOW() - INTERVAL '1 day'),
((SELECT id FROM productos WHERE sku = 'BLU-001-S' LIMIT 1), 'Blusa Elegante', (SELECT id FROM clientes WHERE email = 'ana.martinez@email.com' LIMIT 1), 'Ana Martínez', 3, 39.99, 'Transferencia', NOW() - INTERVAL '1 day'),

-- Ventas de hoy
((SELECT id FROM productos WHERE sku = 'GUA-001-M' LIMIT 1), 'Guantes Invierno', (SELECT id FROM clientes WHERE email = 'laura.torres@email.com' LIMIT 1), 'Laura Torres', 2, 24.99, 'Efectivo', NOW()),
((SELECT id FROM productos WHERE sku = 'SUD-001-M' LIMIT 1), 'Sudadera con Capucha', (SELECT id FROM clientes WHERE email = 'luis.fernandez@email.com' LIMIT 1), 'Luis Fernández', 1, 59.99, 'Tarjeta', NOW())

ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTAR RECOMENDACIONES DE EJEMPLO
-- ============================================

-- Recomendación de descuento para producto con baja rotación
INSERT INTO recomendaciones (producto_id, tipo_recomendacion, prioridad, mensaje) VALUES
((SELECT id FROM productos WHERE sku = 'CHA-001-L' LIMIT 1), 'descuento', 'alta', 'Chaqueta de Cuero tiene baja rotación. Considera aplicar un descuento para aumentar las ventas.'),
((SELECT id FROM productos WHERE sku = 'BOT-001-42' LIMIT 1), 'reposicion', 'media', 'Botas Invierno tiene stock bajo. Considera aumentar el stock antes de la temporada.')

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================

-- Verificar productos
SELECT COUNT(*) as total_productos FROM productos;

-- Verificar clientes
SELECT COUNT(*) as total_clientes FROM clientes;

-- Verificar ventas
SELECT COUNT(*) as total_ventas FROM ventas;

-- Verificar movimientos de inventario (deberían ser igual al número de ventas)
SELECT COUNT(*) as total_movimientos FROM movimientos_inventario;

-- Verificar stock actualizado
SELECT nombre, stock FROM productos ORDER BY stock ASC LIMIT 10;

-- Verificar recomendaciones
SELECT COUNT(*) as total_recomendaciones FROM recomendaciones;

-- ============================================
-- FIN DE INSERCIÓN DE DATOS
-- ============================================

