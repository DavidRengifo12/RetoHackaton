-- ============================================
-- CREAR BUCKET DE STORAGE PARA IMÁGENES
-- ============================================
-- Este script crea el bucket de almacenamiento de imágenes
-- Ejecutar este script en Supabase SQL Editor

-- IMPORTANTE: Después de ejecutar este script, ejecuta 07_politicas_storage.sql
-- para configurar las políticas RLS necesarias

-- Crear el bucket si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'productos',
  'productos',
  true,  -- Bucket público para que las imágenes sean accesibles
  5242880,  -- 5MB límite de tamaño
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- NOTAS
-- ============================================
-- 1. Este script crea el bucket "productos"
-- 2. El bucket es público para que las imágenes sean accesibles
-- 3. Límite de tamaño: 5MB
-- 4. Tipos MIME permitidos: JPEG, JPG, PNG, WEBP
-- 5. DESPUÉS de ejecutar este script, ejecuta 07_politicas_storage.sql
--    para configurar las políticas RLS necesarias

-- ============================================
-- INSTRUCCIONES ALTERNATIVAS (si prefieres crear desde el Dashboard):
-- ============================================
-- 1. Ve al Dashboard de Supabase
-- 2. Navega a Storage
-- 3. Haz clic en "Create a new bucket"
-- 4. Configura:
--    - Name: productos
--    - Public bucket: Sí (activado)
--    - File size limit: 5242880 (5MB)
--    - Allowed MIME types: image/jpeg, image/png, image/webp
-- 5. Guarda el bucket
-- 6. DESPUÉS ejecuta 07_politicas_storage.sql para las políticas RLS
-- ============================================

