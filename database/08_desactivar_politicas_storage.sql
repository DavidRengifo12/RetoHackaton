-- ============================================
-- POLÍTICAS RLS PÚBLICAS PARA STORAGE (SIN AUTENTICACIÓN)
-- ============================================
-- Este script permite que CUALQUIERA pueda subir, actualizar y eliminar imágenes
-- SIN necesidad de autenticación. Ejecutar este script en Supabase SQL Editor

-- ============================================
-- ELIMINAR TODAS LAS POLÍTICAS RESTRICTIVAS
-- ============================================

-- Eliminar todas las políticas existentes del bucket productos
DROP POLICY IF EXISTS "Public Access - productos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload - productos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update - productos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete - productos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload - productos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update - productos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete - productos" ON storage.objects;

-- ============================================
-- CREAR POLÍTICAS DE ACCESO PARA STORAGE
-- ============================================

-- 1. Política para SELECT (lectura pública) - Permitir a TODOS ver las imágenes
CREATE POLICY "Public Access - productos bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'productos');

-- 2. Política para INSERT (subir archivos) - CUALQUIERA puede subir (sin autenticación)
CREATE POLICY "Anyone can upload - productos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'productos');

-- 3. Política para UPDATE (actualizar archivos) - CUALQUIERA puede actualizar (sin autenticación)
CREATE POLICY "Anyone can update - productos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'productos')
WITH CHECK (bucket_id = 'productos');

-- 4. Política para DELETE (eliminar archivos) - CUALQUIERA puede eliminar (sin autenticación)
CREATE POLICY "Anyone can delete - productos"
ON storage.objects FOR DELETE
USING (bucket_id = 'productos');

-- ============================================
-- IMPORTANTE: CONFIGURAR EL BUCKET COMO PÚBLICO
-- ============================================
-- 1. Ve al Dashboard de Supabase
-- 2. Navega a: Storage > productos
-- 3. Haz clic en "Settings" (Configuración)
-- 4. Activa "Public bucket" (Bucket público)
-- 5. Guarda los cambios
--
-- Esto es CRÍTICO para que las imágenes sean accesibles públicamente

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar que las políticas se crearon correctamente, ejecuta:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname LIKE '%productos%';

-- Para verificar que el bucket es público, ejecuta:
-- SELECT id, name, public FROM storage.buckets WHERE id = 'productos';
-- Debe mostrar: public = true

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. El bucket DEBE estar marcado como PÚBLICO en Supabase Dashboard
--    Dashboard > Storage > productos > Settings > Public bucket = ON
--
-- 2. Las políticas RLS permiten:
--    - SELECT (lectura): Todos pueden ver las imágenes (público)
--    - INSERT (subir): CUALQUIERA puede subir (sin autenticación)
--    - UPDATE (actualizar): CUALQUIERA puede actualizar (sin autenticación)
--    - DELETE (eliminar): CUALQUIERA puede eliminar (sin autenticación)
--
-- 3. Si recibes el error "new row violates row-level security policy":
--    a) Verifica que este script se haya ejecutado correctamente
--    b) Verifica que el bucket "productos" exista y esté marcado como público
--    c) Verifica que las políticas se hayan creado:
--       SELECT * FROM pg_policies 
--       WHERE tablename = 'objects' 
--       AND schemaname = 'storage' 
--       AND policyname LIKE '%productos%';
--
-- 4. Para verificar que el bucket es público:
--    SELECT id, name, public FROM storage.buckets WHERE id = 'productos';
--    Debe mostrar: public = true
--
-- 5. Si las imágenes aún no se muestran, verifica:
--    - Que el bucket esté marcado como público
--    - Que las URLs generadas sean correctas
--    - Que los archivos existan en el bucket
--    - Que las políticas de SELECT estén activas

