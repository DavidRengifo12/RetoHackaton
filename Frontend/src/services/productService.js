// Servicios CRUD para productos
import supabase from "./supabase";
import { toastService } from "../utils/toastService";

export const productService = {
  // Obtener todos los productos
  async getAllProducts() {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("nombre", { ascending: true });
    return { data, error };
  },

  // Obtener productos con estadísticas de ventas
  async getProductsWithStats() {
    const { data, error } = await supabase
      .from("productos_con_estadisticas")
      .select("*")
      .order("total_ventas", { ascending: false });
    return { data, error };
  },

  // Obtener un producto por ID
  async getProductById(id) {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  // Buscar productos por nombre
  async searchProducts(query) {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .ilike("nombre", `%${query}%`);
    return { data, error };
  },

  // Filtrar productos por categoría
  async filterByCategory(category) {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("categoria", category);
    return { data, error };
  },

  // Filtrar productos por género
  async filterByGender(gender) {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("genero", gender);
    return { data, error };
  },

  // Crear un nuevo producto
  async createProduct(product) {
    try {
      const { data, error } = await supabase
        .from("productos")
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      toastService.success("Producto creado exitosamente");
      return { data, error: null };
    } catch (error) {
      toastService.error(`Error al crear producto: ${error.message}`);
      return { data: null, error };
    }
  },

  // Actualizar un producto
  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from("productos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  // Eliminar un producto
  async deleteProduct(id) {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    return { error };
  },

  // Crear múltiples productos (bulk insert)
  async createBulkProducts(productos) {
    try {
      toastService.info(`Procesando ${productos.length} productos...`);

      // Procesar productos en lotes para evitar problemas de tamaño
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < productos.length; i += batchSize) {
        batches.push(productos.slice(i, i + batchSize));
      }

      let totalInserted = 0;
      const errors = [];

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        try {
          const { data, error } = await supabase
            .from("productos")
            .insert(batch)
            .select();

          if (error) {
            // Si hay error de SKU duplicado, intentar insertar uno por uno
            if (
              error.code === "23505" ||
              error.message.includes("duplicate") ||
              error.message.includes("unique")
            ) {
              toastService.info(
                `Algunos productos tienen SKU duplicado, insertando individualmente...`
              );

              for (const producto of batch) {
                try {
                  const { data: singleData, error: singleError } =
                    await supabase
                      .from("productos")
                      .insert([producto])
                      .select();

                  if (singleError) {
                    errors.push(
                      `Error al insertar ${producto.nombre}: ${singleError.message}`
                    );
                  } else {
                    totalInserted++;
                  }
                } catch (err) {
                  errors.push(
                    `Error al insertar ${producto.nombre}: ${err.message}`
                  );
                }
              }
            } else {
              throw error;
            }
          } else {
            totalInserted += data.length;
          }
        } catch (err) {
          errors.push(`Error en lote ${i + 1}: ${err.message}`);
        }
      }

      if (totalInserted > 0) {
        toastService.success(
          `✅ ${totalInserted} productos cargados exitosamente\n` +
            (errors.length > 0
              ? `⚠️ ${errors.length} errores durante la importación`
              : "")
        );
      } else {
        throw new Error("No se pudo insertar ningún producto");
      }

      return {
        data: { inserted: totalInserted, errors },
        error: errors.length > 0 ? errors : null,
      };
    } catch (error) {
      toastService.error("Error al cargar productos: " + error.message);
      return { data: null, error };
    }
  },
};
