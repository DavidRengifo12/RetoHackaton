// Servicios CRUD para ventas
import supabase from './supabase';
import { toastService } from '../utils/toastService';

export const salesService = {
  // Obtener todas las ventas
  async getAllSales() {
    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .order('fecha_venta', { ascending: false });
    return { data, error };
  },

  // Obtener ventas por rango de fechas
  async getSalesByDateRange(startDate, endDate) {
    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .gte('fecha_venta', startDate)
      .lte('fecha_venta', endDate)
      .order('fecha_venta', { ascending: false });
    return { data, error };
  },

  // Obtener ventas del mes actual
  async getCurrentMonthSales() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    return this.getSalesByDateRange(startOfMonth.toISOString(), endOfMonth.toISOString());
  },

  // Obtener ventas por producto
  async getSalesByProduct(productId) {
    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .eq('producto_id', productId)
      .order('fecha_venta', { ascending: false });
    return { data, error };
  },

  // Crear una nueva venta
  async createSale(ventaData) {
    try {
      toastService.info('Procesando venta...');
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Agregar usuario_id a la venta
      const ventaConUsuario = {
        ...ventaData,
        usuario_id: user.id,
      };

      const { data, error } = await supabase
        .from('ventas')
        .insert([ventaConUsuario])
        .select()
        .single();

      if (error) throw error;

      // Los triggers automáticamente:
      // 1. Generarán el número de venta
      // 2. Actualizarán el stock del producto
      // 3. Registrarán el movimiento de inventario

      toastService.success(
        `Venta creada exitosamente: ${data.numero_venta}\n` +
        `Producto: ${data.nombre_producto}\n` +
        `Cantidad: ${data.cantidad}\n` +
        `Total: $${data.precio_total?.toFixed(2) || '0.00'}\n` +
        `Stock actualizado automáticamente`
      );
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al crear venta: ' + error.message);
      return { data: null, error };
    }
  },

  // Crear múltiples ventas (bulk insert)
  async createBulkSales(ventas) {
    try {
      toastService.info(`Procesando ${ventas.length} ventas...`);
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Agregar usuario_id a todas las ventas
      const ventasConUsuario = ventas.map(venta => ({
        ...venta,
        usuario_id: user.id,
      }));

      const { data, error } = await supabase
        .from('ventas')
        .insert(ventasConUsuario)
        .select();

      if (error) throw error;

      const totalIngresos = data.reduce((sum, v) => sum + (v.precio_total || 0), 0);

      toastService.success(
        `✅ ${data.length} ventas cargadas exitosamente\n` +
        `📊 Total ingresos: $${totalIngresos.toFixed(2)}\n` +
        `📦 Stock actualizado automáticamente`
      );
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al cargar ventas: ' + error.message);
      return { data: null, error };
    }
  },

  // Actualizar una venta
  async updateSale(id, updates) {
    const { data, error } = await supabase
      .from('ventas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Eliminar una venta
  async deleteSale(id) {
    const { error } = await supabase
      .from('ventas')
      .delete()
      .eq('id', id);
    return { error };
  },
};
