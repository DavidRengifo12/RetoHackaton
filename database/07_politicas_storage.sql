-- ============================================
-- POLÍTICAS RLS PARA STORAGE (BUCKET productos)
-- ============================================
-- Este script configura las políticas RLS para el bucket de storage
-- Ejecutar este script en Supabase SQL Editor después de crear el bucket

-- IMPORTANTE: Primero debes crear el bucket "productos" desde el Dashboard de Supabase
-- Storage > Create a new bucket > Name: productos > Public: true

-- ============================================
-- POLÍTICAS PARA storage.objects
-- ============================================

-- 1. Política para SELECT (lectura pública)
-- Permite que todos puedan ver las imágenes (necesario para URLs públicas)
DROP POLICY IF EXISTS "Public Access - productos bucket" ON storage.objects;
CREATE POLICY "Public Access - productos bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'productos');

-- 2. Política para INSERT (subir archivos)
-- Solo usuarios autenticados pueden subir imágenes
DROP POLICY IF EXISTS "Authenticated users can upload - productos" ON storage.objects;
CREATE POLICY "Authenticated users can upload - productos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'productos' 
  AND auth.role() = 'authenticated'
);

-- 3. Política para UPDATE (actualizar archivos)
-- Solo usuarios autenticados pueden actualizar imágenes
DROP POLICY IF EXISTS "Authenticated users can update - productos" ON storage.objects;
CREATE POLICY "Authenticated users can update - productos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'productos' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'productos' 
  AND auth.role() = 'authenticated'
);

-- 4. Política para DELETE (eliminar archivos)
-- Solo usuarios autenticados pueden eliminar imágenes
-- Opcional: Puedes restringir esto solo a administradores si lo prefieres
DROP POLICY IF EXISTS "Authenticated users can delete - productos" ON storage.objects;
CREATE POLICY "Authenticated users can delete - productos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'productos' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar que las políticas se crearon correctamente, ejecuta:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. El bucket debe existir antes de ejecutar este script
-- 2. Si el bucket es público, las imágenes serán accesibles públicamente
-- 3. Las políticas RLS se aplican a nivel de fila en storage.objects
-- 4. Los usuarios autenticados pueden subir, actualizar y eliminar archivos
-- 5. Para restringir eliminación solo a administradores, modifica la política DELETE

