// Context de autenticación
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import supabase from '../services/supabase';

const AuthContext = createContext(null);

// Función para obtener datos completos del usuario desde la tabla usuarios
const fetchUserData = async (authUser) => {
  if (!authUser) return null;
  
  // Retornar datos básicos inmediatamente si no hay authUser válido
  const defaultUserData = {
    ...authUser,
    nombre: authUser.email?.split('@')[0] || authUser.email || 'Usuario',
    rol: 'usuario'
  };
  
  try {
    // Intentar obtener datos del usuario
    // Si hay error de políticas RLS o timeout, retornar datos básicos inmediatamente
    const { data: usuarioData, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', authUser.id)
      .single()
    
    if (error) {
      // Si el usuario no existe en la tabla usuarios (error PGRST116)
      if (error.code === 'PGRST116' || error.message?.includes('No rows') || error.message?.includes('not found')) {
        console.warn('Usuario no encontrado en tabla usuarios, usando datos básicos');
        // Intentar insertar un registro básico (sin esperar resultado - no bloqueante)
        supabase
          .from('usuarios')
          .insert({
            id: authUser.id,
            nombre: authUser.email?.split('@')[0] || 'Usuario',
            rol: 'usuario',
            activo: true
          })
          .then(({ error: insertError }) => {
            if (insertError) {
              console.warn('No se pudo insertar usuario en tabla usuarios:', insertError);
            }
          })
          .catch(() => {
            // Ignorar errores de inserción
          });
        
        // Retornar datos básicos inmediatamente (no esperar inserción)
        return defaultUserData;
      }
      
      // Cualquier otro error (políticas RLS, timeout, etc.) - retornar datos básicos
      console.warn('Error al obtener datos del usuario, usando datos básicos:', error.message || error);
      return defaultUserData;
    }
    
    // Si se obtuvieron datos correctamente
    if (usuarioData) {
      return {
        ...authUser,
        nombre: usuarioData.nombre || authUser.email?.split('@')[0] || 'Usuario',
        rol: usuarioData.rol || 'usuario',
        usuarioData: usuarioData,
      };
    }
    
    // Si no hay datos pero no hay error, retornar datos básicos
    return defaultUserData;
  } catch (error) {
    // Cualquier excepción - retornar datos básicos inmediatamente
    console.warn('Error en fetchUserData, usando datos básicos:', error.message || error);
    return defaultUserData;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual
    const checkSession = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          const userData = await fetchUserData(session.user);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          // fetchUserData siempre retorna datos (nunca null) gracias a manejo de errores robusto
          const userData = await fetchUserData(session.user);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error en onAuthStateChange:', error);
        // Si hay error pero hay sesión, usar datos básicos
        if (session?.user) {
          setUser({
            ...session.user,
            nombre: session.user.email?.split('@')[0] || 'Usuario',
            rol: 'usuario'
          });
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    console.log('[AUTH] Iniciando signIn...');
    setLoading(true);
    
    try {
      // Hacer login con timeout adicional en el contexto
      console.log('[AUTH] Llamando authService.signIn...');
      
      const signInPromise = authService.signIn(email, password);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: El inicio de sesión tardó demasiado')), 15000)
      );
      
      const { data, error } = await Promise.race([signInPromise, timeoutPromise]);
      
      console.log('[AUTH] Respuesta de authService.signIn recibida:', { hasData: !!data, hasError: !!error });
      
      if (error) {
        console.error('[AUTH] Error en authService.signIn:', error);
        // El toast ya se muestra desde authService
        setLoading(false);
        return { success: false, error: error.message };
      }
      
      if (!data?.user) {
        console.error('[AUTH] No se obtuvo usuario de authService');
        setLoading(false);
        return { success: false, error: 'No se pudo obtener datos del usuario autenticado' };
      }
      
      console.log('[AUTH] Usuario autenticado, obteniendo datos...', data.user.id);
      
      // Obtener datos del usuario - fetchUserData siempre retorna algo (nunca null)
      // Agregar timeout también aquí
      const fetchUserDataPromise = fetchUserData(data.user);
      const fetchTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al obtener datos del usuario')), 10000)
      );
      
      const userData = await Promise.race([fetchUserDataPromise, fetchTimeoutPromise]);
      
      console.log('[AUTH] Datos del usuario obtenidos:', userData ? 'OK' : 'NULL');
      
      // Establecer usuario y finalizar carga
      setUser(userData);
      setLoading(false);
      
      console.log('[AUTH] signIn completado exitosamente');
      return { success: true };
    } catch (error) {
      // El toast ya se muestra desde authService
      console.error('[AUTH] Excepción en signIn:', error);
      
      // Si hay error pero el usuario está autenticado, usar datos básicos
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('[AUTH] Usando datos básicos del usuario autenticado');
          setUser({
            ...user,
            nombre: user.email?.split('@')[0] || 'Usuario',
            rol: 'usuario'
          });
          setLoading(false);
          return { success: true }; // Aún así retornar éxito si tenemos usuario
        }
      } catch (secondaryError) {
        console.error('[AUTH] Error secundario al obtener usuario:', secondaryError);
      }
      
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para verificar si el usuario es administrador
  const isAdmin = () => {
    return user?.rol === 'administrador';
  };

  // Función para refrescar datos del usuario
  const refreshUser = async () => {
    if (user?.id) {
      const userData = await fetchUserData(user);
      setUser(userData);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

