// Servicios CRUD para productos
import supabase from './supabase';

export const productService = {
  // Obtener todos los productos
  async getAllProducts() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('creado_en', { ascending: false });
    return { data, error };
  },

  // Obtener productos con estadísticas de ventas
  async getProductsWithStats() {
    const { data, error } = await supabase
      .from('productos_con_estadisticas')
      .select('*')
      .order('total_ventas', { ascending: false });
    return { data, error };
  },

  // Obtener un producto por ID
  async getProductById(id) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Buscar productos por nombre
  async searchProducts(query) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .ilike('nombre', `%${query}%`);
    return { data, error };
  },

  // Filtrar productos por categoría
  async filterByCategory(category) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria', category);
    return { data, error };
  },

  // Filtrar productos por género
  async filterByGender(gender) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('genero', gender);
    return { data, error };
  },

  // Crear un nuevo producto
  async createProduct(product) {
    const { data, error } = await supabase
      .from('productos')
      .insert([product])
      .select()
      .single();
    return { data, error };
  },

  // Actualizar un producto
  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from('productos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Eliminar un producto
  async deleteProduct(id) {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);
    return { error };
  },
};
