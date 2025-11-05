// Servicios de autenticación con Supabase
import supabase from './supabase';
import { toastService } from '../utils/toastService';

export const authService = {
  // Registro de usuario
  async signUp(email, password, nombreCompleto) {
    try {
      toastService.info('Registrando usuario...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: nombreCompleto || email
          }
        }
      });

      if (error) throw error;

      // El trigger automáticamente creará el usuario en la tabla usuarios
      // y le asignará el rol "usuario"
      
      toastService.success('Usuario registrado exitosamente. Rol asignado: usuario');
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al registrar usuario: ' + error.message);
      return { data: null, error };
    }
  },

  // Inicio de sesión
  async signIn(email, password) {
    try {
      toastService.info('Iniciando sesión...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Obtener información del usuario y su rol
      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('*, roles_usuario(*)')
        .eq('id', data.user.id)
        .single();

      const rolNombre = usuarioData?.roles_usuario?.nombre || 'usuario';
      
      toastService.success(`Sesión iniciada correctamente. Rol: ${rolNombre}`);
      
      return { data, error: null };
    } catch (error) {
      toastService.error('Error al iniciar sesión: ' + error.message);
      return { data: null, error };
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      toastService.info('Cerrando sesión...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      toastService.success('Sesión cerrada correctamente');
      
      return { error: null };
    } catch (error) {
      toastService.error('Error al cerrar sesión: ' + error.message);
      return { error };
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Obtener sesión actual
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
