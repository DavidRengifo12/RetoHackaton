-- ============================================
-- AGREGAR CAMPO SALDO A USUARIOS
-- ============================================
-- Este script agrega el campo saldo a la tabla usuarios
-- para manejar el saldo disponible de cada usuario

-- Agregar columna saldo si no existe
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS saldo DECIMAL(10, 2) DEFAULT 0.00 CHECK (saldo >= 0);

-- Actualizar usuarios existentes con un saldo inicial de 100000 (simulado)
UPDATE usuarios 
SET saldo = 100000.00 
WHERE saldo IS NULL OR saldo = 0;

-- Crear índice para búsquedas por saldo
CREATE INDEX IF NOT EXISTS idx_usuarios_saldo ON usuarios(saldo);

