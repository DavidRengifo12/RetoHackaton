# Solución: Error RLS Storage - "new row violates row-level security policy"

## 📋 Descripción del Error

El error **"new row violates row-level security policy"** ocurre cuando intentas subir una imagen al bucket de Supabase Storage, pero las políticas de Row-Level Security (RLS) están bloqueando la operación.

```
StorageApiError: new row violates row-level security policy
```

## 🔍 Causa del Problema

Este error se produce cuando:

1. **Faltan políticas RLS de INSERT**: El bucket tiene políticas de lectura (SELECT) pero no tiene políticas que permitan INSERT para usuarios autenticados.

2. **Usuario no autenticado**: El usuario no ha iniciado sesión cuando intenta subir la imagen.

3. **Políticas RLS mal configuradas**: Las políticas existentes no permiten la operación que se está intentando realizar.

## ✅ Solución

### Paso 1: Verificar Autenticación

Asegúrate de que el usuario esté autenticado antes de intentar subir imágenes. El código ahora verifica automáticamente la autenticación y mostrará un mensaje claro si no lo está.

### Paso 2: Ejecutar Script SQL

Ejecuta el script `08_desactivar_politicas_storage.sql` en el SQL Editor de Supabase. Este script:

1. **Elimina políticas conflictivas** existentes
2. **Crea las políticas correctas**:
   - **SELECT**: Permite lectura pública de imágenes
   - **INSERT**: Permite a usuarios autenticados subir imágenes
   - **UPDATE**: Permite a usuarios autenticados actualizar imágenes
   - **DELETE**: Permite a usuarios autenticados eliminar imágenes

### Paso 3: Configurar Bucket como Público

1. Ve al **Dashboard de Supabase**
2. Navega a **Storage > productos**
3. Haz clic en **Settings** (Configuración)
4. Activa **"Public bucket"** (Bucket público)
5. **Guarda** los cambios

### Paso 4: Verificar Configuración

Ejecuta estas consultas en el SQL Editor para verificar:

```sql
-- Verificar que las políticas existen
SELECT * FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%productos%';

-- Verificar que el bucket es público
SELECT id, name, public FROM storage.buckets WHERE id = 'productos';
-- Debe mostrar: public = true
```

## 🔧 Cambios Realizados en el Código

### 1. `storageService.js`

- ✅ Verificación de autenticación antes de subir
- ✅ Manejo mejorado de errores con mensajes claros
- ✅ Detección específica de errores RLS

### 2. `08_desactivar_politicas_storage.sql`

- ✅ Políticas completas para SELECT, INSERT, UPDATE, DELETE
- ✅ Políticas que requieren autenticación para operaciones de escritura
- ✅ Política pública para lectura de imágenes

## 🧪 Cómo Probar la Solución

1. **Inicia sesión** en la aplicación
2. **Intenta subir una imagen** en la página de agregar producto
3. Si el error persiste:
   - Verifica que el script SQL se ejecutó correctamente
   - Verifica que el bucket está marcado como público
   - Verifica que estás autenticado (revisa la consola del navegador)

## 📝 Notas Adicionales

- Las políticas RLS se aplican a nivel de fila en `storage.objects`
- Los usuarios **NO autenticados** solo pueden **ver** imágenes (SELECT)
- Los usuarios **autenticados** pueden **subir, actualizar y eliminar** imágenes
- El bucket debe estar marcado como **público** para que las URLs públicas funcionen

## 🆘 Si el Problema Persiste

1. **Verifica la consola del navegador** para ver mensajes de error detallados
2. **Revisa el estado de autenticación** en la aplicación
3. **Ejecuta las consultas de verificación** en Supabase
4. **Asegúrate de que el bucket existe** y tiene el nombre correcto: `productos`
5. **Verifica las variables de entorno** (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`)

## 📚 Referencias

- [Documentación de Supabase Storage RLS](https://supabase.com/docs/guides/storage/security/access-control)
- [Documentación de Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
