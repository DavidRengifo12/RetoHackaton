// Servicio para manejar almacenamiento de imágenes en Supabase Storage
import supabase from "./supabase";
import { toastService } from "../utils/toastService";

const BUCKET_NAME = "productos"; // Nombre del bucket en Supabase

export const storageService = {
  // Subir imagen de producto
  async uploadProductImage(file, productId) {
    try {
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
        // Si el bucket no existe, intentar crearlo
        if (error.message.includes("Bucket not found")) {
          toastService.error(
            "El bucket de almacenamiento no existe. Por favor créalo en Supabase Storage."
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
    if (!filePath) return null;

    // Si ya es una URL completa, retornarla
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    // Normalizar la ruta del archivo
    let normalizedPath = filePath;

    // Si la ruta no empieza con "productos/", agregarlo
    if (!normalizedPath.startsWith("productos/")) {
      // Si empieza con "/", quitarlo
      if (normalizedPath.startsWith("/")) {
        normalizedPath = normalizedPath.substring(1);
      }
      // Agregar "productos/" al inicio si no está
      if (!normalizedPath.startsWith("productos/")) {
        normalizedPath = `productos/${normalizedPath}`;
      }
    }

    // Obtener URL pública de Supabase Storage
    try {
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(normalizedPath);

      if (data?.publicUrl) {
        console.log("URL generada para:", normalizedPath, "->", data.publicUrl);
        return data.publicUrl;
      }

      return null;
    } catch (error) {
      console.error("Error al obtener URL pública:", error);
      return null;
    }
  },

  // Obtener URL pública de imagen de producto (helper para productos)
  getProductImageUrl(product) {
    if (!product) return null;

    // Si el producto tiene imagen_url, procesarla
    if (product.imagen_url) {
      // Intentar obtener URL con la ruta original
      let url = this.getPublicUrl(product.imagen_url);
      if (url) {
        return url;
      }

      // Si no funcionó, intentar diferentes formatos
      const imagenUrl = product.imagen_url.trim();

      // Si es solo el nombre del archivo sin ruta
      if (!imagenUrl.includes("/")) {
        url = this.getPublicUrl(`productos/${imagenUrl}`);
        if (url) return url;
      }

      // Si tiene "productos/" al inicio
      if (imagenUrl.startsWith("productos/")) {
        url = this.getPublicUrl(imagenUrl);
        if (url) return url;
      }

      // Si tiene "/productos/" en algún lugar
      if (imagenUrl.includes("/productos/")) {
        const pathAfterProductos = imagenUrl.split("/productos/")[1];
        url = this.getPublicUrl(`productos/${pathAfterProductos}`);
        if (url) return url;
      }

      // Intentar con el nombre del archivo extraído
      const fileName = imagenUrl.split("/").pop() || imagenUrl;
      if (fileName !== imagenUrl) {
        url = this.getPublicUrl(`productos/${fileName}`);
        if (url) return url;
      }

      // Último intento: usar la ruta tal cual
      console.warn(
        "No se pudo obtener URL para:",
        product.imagen_url,
        "Intentando con ruta directa"
      );
      return this.getPublicUrl(imagenUrl);
    }

    return null;
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
