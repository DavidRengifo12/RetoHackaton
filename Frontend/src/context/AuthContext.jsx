import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../services/supabase";

const AuthContext = createContext(null);

// Función para cargar perfil del usuario desde la tabla usuarios
const loadPerfilUsuario = async (authUser) => {
  if (!authUser) {
    return null;
  }

  try {
    // Timeout para evitar que se quede colgado
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout al cargar perfil")), 5000)
    );

    const fetchPromise = (async () => {
      const result = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", authUser.id)
        .single();
      return result;
    })();

    const { data: perfil, error } = await Promise.race([
      fetchPromise,
      timeoutPromise,
    ]);

    if (error) {
      console.warn("[AuthContext] Error al cargar perfil:", error);
      // Si no existe en usuarios, crear uno por defecto
      if (error.code === "PGRST116") {
        console.log(
          "[AuthContext] Usuario no existe en tabla usuarios, creando..."
        );
        try {
          const { data: newUser, error: insertError } = await supabase
            .from("usuarios")
            .insert({
              id: authUser.id,
              nombre:
                authUser.user_metadata?.nombre ||
                authUser.email?.split("@")[0] ||
                "Usuario",
              rol: "usuario",
              activo: true,
            })
            .select()
            .single();

          if (insertError) {
            console.error("[AuthContext] Error al crear usuario:", insertError);
          } else if (newUser) {
            console.log("[AuthContext] Usuario creado exitosamente:", newUser);
            return { ...authUser, ...newUser };
          }
        } catch (insertErr) {
          console.error("[AuthContext] Excepción al crear usuario:", insertErr);
        }
      }
      // Retornar usuario básico si no se puede obtener perfil (no bloquea el login)
      return {
        ...authUser,
        nombre:
          authUser.user_metadata?.nombre ||
          authUser.email?.split("@")[0] ||
          "Usuario",
        rol: "usuario",
      };
    }

    if (perfil) {
      return { ...authUser, ...perfil };
    }

    return {
      ...authUser,
      nombre:
        authUser.user_metadata?.nombre ||
        authUser.email?.split("@")[0] ||
        "Usuario",
      rol: "usuario",
    };
  } catch (error) {
    console.error("[AuthContext] Error en loadPerfilUsuario:", error);
    // Retornar usuario básico en caso de error (no bloquea el login)
    return {
      ...authUser,
      nombre:
        authUser.user_metadata?.nombre ||
        authUser.email?.split("@")[0] ||
        "Usuario",
      rol: "usuario",
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        loadPerfilUsuario(data.user).then((perfil) => {
          if (perfil) {
            setUser(perfil);
            setIsAuthenticated(true);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "[AuthContext] Auth state changed:",
        event,
        session?.user?.id
      );

      if (session?.user) {
        // Establecer autenticación inmediatamente para no bloquear la navegación
        setIsAuthenticated(true);

        // Cargar perfil en segundo plano (no bloqueante)
        loadPerfilUsuario(session.user)
          .then((perfil) => {
            if (perfil) {
              setUser(perfil);
              console.log("[AuthContext] Perfil cargado:", perfil);
            } else {
              // Si no se puede cargar el perfil, usar datos básicos
              setUser({
                ...session.user,
                nombre:
                  session.user.user_metadata?.nombre ||
                  session.user.email?.split("@")[0] ||
                  "Usuario",
                rol: "usuario",
              });
              console.warn("[AuthContext] Usando datos básicos del usuario");
            }
          })
          .catch((error) => {
            console.error("[AuthContext] Error al cargar perfil:", error);
            // Usar datos básicos en caso de error
            setUser({
              ...session.user,
              nombre:
                session.user.user_metadata?.nombre ||
                session.user.email?.split("@")[0] ||
                "Usuario",
              rol: "usuario",
            });
          });
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log("[AuthContext] Usuario desautenticado");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const perfil = await loadPerfilUsuario(data.user);
        if (perfil) {
          setUser(perfil);
          setIsAuthenticated(true);
        }
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: "Error al iniciar sesión" };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    isAdmin: user?.rol === "administrador",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
