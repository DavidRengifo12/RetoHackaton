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
};
