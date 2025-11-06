// Servicio para manejar almacenamiento de imágenes en Supabase Storage
import supabase from "./supabase";
import { toastService } from "../utils/toastService";

const BUCKET_NAME = "productos"; // Nombre del bucket en Supabase

// URLs de imágenes placeholder públicas (fallback)
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
];

export const storageService = {
  // Subir imagen de producto
  async uploadProductImage(file, productId) {
    try {
      // Verificar que el usuario esté autenticado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("Debes iniciar sesión para subir imágenes");
      }

      // Validar que el archivo sea una imagen
      if (!file.type.startsWith("image/")) {
        throw new Error("El archivo debe ser una imagen");
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("La imagen no puede ser mayor a 5MB");
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${productId || Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        // Manejar diferentes tipos de errores
        if (error.message.includes("Bucket not found")) {
          toastService.error(
            "El bucket de almacenamiento no existe. Por favor créalo en Supabase Storage."
          );
        } else if (
          error.message.includes("row-level security policy") ||
          error.message.includes("violates row-level security")
        ) {
          toastService.error(
            "Error de permisos: Las políticas de seguridad están bloqueando la subida. Verifica que las políticas RLS estén configuradas correctamente."
          );
          console.error(
            "Error RLS - Verifica que las políticas de storage estén configuradas:",
            error
          );
        } else if (
          error.message.includes("JWT") ||
          error.message.includes("token")
        ) {
          toastService.error(
            "Error de autenticación: Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          );
        }
        throw error;
      }

      // Obtener URL pública de la imagen
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath,
        error: null,
      };
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toastService.error(`Error al subir imagen: ${error.message}`);
      return {
        success: false,
        url: null,
        path: null,
        error: error.message,
      };
    }
  },

  // Eliminar imagen
  async deleteProductImage(filePath) {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      return { success: false, error: error.message };
    }
  },

  // Obtener URL pública de una imagen
  getPublicUrl(filePath) {
    if (!filePath) {
      console.warn("getPublicUrl: filePath es null o undefined");
      return null;
    }

    // Si ya es una URL completa, retornarla
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      console.log("getPublicUrl: Ya es una URL completa:", filePath);
      return filePath;
    }

    // Normalizar la ruta del archivo
    let normalizedPath = filePath.trim();

    // Si empieza con "/", quitarlo
    if (normalizedPath.startsWith("/")) {
      normalizedPath = normalizedPath.substring(1);
    }

    // Si la ruta no empieza con "productos/", agregarlo
    if (!normalizedPath.startsWith("productos/")) {
      normalizedPath = `productos/${normalizedPath}`;
    }

    // Obtener URL pública de Supabase Storage
    try {
      const { data, error } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(normalizedPath);

      if (error) {
        console.error("❌ Error al obtener URL pública:", {
          error,
          filePath,
          normalizedPath,
          bucket: BUCKET_NAME,
        });
        return null;
      }

      if (data?.publicUrl) {
        console.log("✅ URL pública generada:", {
          ruta_original: filePath,
          ruta_normalizada: normalizedPath,
          url_publica: data.publicUrl,
        });
        return data.publicUrl;
      }

      console.warn("⚠️ getPublicUrl: No se obtuvo publicUrl para:", {
        filePath,
        normalizedPath,
        bucket: BUCKET_NAME,
        data,
      });
      return null;
    } catch (error) {
      console.error("❌ Error al obtener URL pública (catch):", {
        error,
        filePath,
        normalizedPath,
        bucket: BUCKET_NAME,
      });
      return null;
    }
  },

  // Obtener imagen placeholder aleatoria
  getPlaceholderImage(productId = null) {
    // Usar el ID del producto para seleccionar una imagen consistente
    if (productId) {
      const index = productId.split("-").reduce((sum, part) => {
        return sum + parseInt(part.replace(/\D/g, ""), 16) || 0;
      }, 0);
      return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
    }
    return PLACEHOLDER_IMAGES[
      Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)
    ];
  },

  // Obtener URL pública de imagen de producto (helper para productos)
  getProductImageUrl(product) {
    if (!product || !product.imagen_url) {
      console.warn(
        "getProductImageUrl: Producto sin imagen_url, usando placeholder",
        product?.nombre
      );
      // Retornar placeholder si no hay imagen_url
      return this.getPlaceholderImage(product?.id);
    }

    const imagenUrl = product.imagen_url.trim();

    // Si ya es una URL completa (http/https), retornarla directamente
    if (imagenUrl.startsWith("http://") || imagenUrl.startsWith("https://")) {
      console.log("✅ URL completa detectada:", imagenUrl);
      return imagenUrl;
    }

    // Normalizar la ruta: asegurarse de que tenga el formato "productos/archivo.jpg"
    let normalizedPath = imagenUrl;

    // Si empieza con "/", quitarlo
    if (normalizedPath.startsWith("/")) {
      normalizedPath = normalizedPath.substring(1);
    }

    // Si no empieza con "productos/", agregarlo
    if (!normalizedPath.startsWith("productos/")) {
      // Si tiene "/productos/" en algún lugar, extraer la parte después
      if (normalizedPath.includes("/productos/")) {
        normalizedPath = "productos/" + normalizedPath.split("/productos/")[1];
      } else if (normalizedPath.includes("/")) {
        // Si tiene otras rutas, tomar solo el nombre del archivo
        normalizedPath = "productos/" + normalizedPath.split("/").pop();
      } else {
        // Si es solo el nombre del archivo, agregar "productos/"
        normalizedPath = "productos/" + normalizedPath;
      }
    }

    // Generar URL pública
    const url = this.getPublicUrl(normalizedPath);

    if (url) {
      console.log("✅ URL generada para producto:", {
        producto: product.nombre,
        imagen_url_original: imagenUrl,
        ruta_normalizada: normalizedPath,
        url_generada: url,
        nota: "Si la imagen no carga, verifica que el bucket 'productos' esté marcado como PÚBLICO en Supabase Dashboard > Storage > productos > Settings > Public bucket",
      });
      return url;
    }

    console.warn("⚠️ No se pudo obtener URL para:", {
      producto: product.nombre,
      imagen_url: imagenUrl,
      ruta_normalizada: normalizedPath,
    });
    // Retornar placeholder si no se pudo generar URL
    return this.getPlaceholderImage(product?.id);
  },

  // Validar archivo antes de subir
  validateImageFile(file) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Solo se permiten imágenes JPG, PNG o WEBP",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "La imagen no puede ser mayor a 5MB",
      };
    }

    return { valid: true, error: null };
  },
};
