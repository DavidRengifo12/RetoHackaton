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
    if (filePath.startsWith("http")) {
      return filePath;
    }

    // Si es una ruta del bucket, obtener URL pública
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return data.publicUrl;
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
