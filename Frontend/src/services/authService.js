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
            nombre: nombreCompleto || email
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
      console.log('[AUTH SERVICE] Iniciando signInWithPassword...');
      toastService.info('Iniciando sesión...');
      
      // Crear un timeout para evitar que se quede colgado
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La solicitud de inicio de sesión tardó demasiado')), 10000)
      );
      
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('[AUTH SERVICE] Esperando respuesta de signInWithPassword...');
      const result = await Promise.race([signInPromise, timeoutPromise]);
      const { data, error } = result;
      
      console.log('[AUTH SERVICE] Respuesta recibida:', { hasData: !!data, hasError: !!error });

      if (error) {
        console.error('[AUTH SERVICE] Error en signInWithPassword:', error);
        throw error;
      }

      if (!data || !data.user) {
        console.error('[AUTH SERVICE] No se obtuvo usuario en la respuesta');
        throw new Error('No se obtuvo usuario en la respuesta de autenticación');
      }

      console.log('[AUTH SERVICE] Usuario autenticado:', data.user.id);
      
      // No intentar obtener datos del usuario aquí - AuthContext lo hará
      // Esto evita problemas de políticas RLS o errores silenciosos
      toastService.success('Sesión iniciada correctamente');
      
      return { data, error: null };
    } catch (error) {
      console.error('[AUTH SERVICE] Excepción en signIn:', error);
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
