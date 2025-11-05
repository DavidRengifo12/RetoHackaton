// Servicios para recomendaciones
import supabase from './supabase';
import { toastService } from '../utils/toastService';

export const recommendationsService = {
  // Obtener recomendaciones
  async getRecommendations() {
    try {
      const { data, error } = await supabase
        .from('recomendaciones')
        .select('*, productos(*)')
        .eq('resuelta', false)
        .order('prioridad', { ascending: false })
        .order('creado_en', { ascending: false });

      if (error) throw error;

      const recomendacionesAltas = data.filter(r => r.prioridad === 'alta');
      
      if (recomendacionesAltas.length > 0) {
        toastService.warning(
          `⚠️ Tienes ${recomendacionesAltas.length} recomendaciones de alta prioridad\n` +
          `Revisa el panel de recomendaciones para más detalles`
        );
      } else if (data.length > 0) {
        toastService.info(`Tienes ${data.length} recomendaciones nuevas`);
      }
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al obtener recomendaciones: ' + error.message);
      return { data: null, error };
    }
  },

  // Marcar como leída
  async markAsRead(id) {
    try {
      const { error } = await supabase
        .from('recomendaciones')
        .update({ leida: true })
        .eq('id', id);

      if (error) throw error;

      toastService.success('Recomendación marcada como leída');
      
      return { error: null };
    } catch (error) {
      toastService.error('Error al actualizar recomendación: ' + error.message);
      return { error };
    }
  },

  // Marcar como resuelta
  async markAsResolved(id) {
    try {
      const { error } = await supabase
        .from('recomendaciones')
        .update({ 
          resuelta: true,
          resuelto_en: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toastService.success('Recomendación marcada como resuelta');
      
      return { error: null };
    } catch (error) {
      toastService.error('Error al resolver recomendación: ' + error.message);
      return { error };
    }
  },
};

