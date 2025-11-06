// Servicio para gestión de usuarios (solo administradores)
import supabase from "./supabase";
import { toastService } from "../utils/toastService";

export const userService = {
  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      toastService.error(`Error al obtener usuarios: ${error.message}`);
      return { data: null, error };
    }
  },

  // Obtener roles disponibles (solo administrador y usuario)
  getRoles() {
    return {
      data: [
        { nombre: "usuario", descripcion: "Usuario con permisos básicos" },
        {
          nombre: "administrador",
          descripcion: "Usuario con permisos completos",
        },
      ],
      error: null,
    };
  },

  // Crear un nuevo usuario (solo administradores)
  // Nota: Esto requiere usar el Admin API de Supabase desde el backend
  // Para este caso, usaremos una función edge o el cliente admin
  async createUser(userData) {
    try {
      toastService.info("Creando usuario...");

      // Primero crear el usuario en auth.users usando Admin API
      // Nota: En producción, esto debería hacerse desde un backend seguro
      // Por ahora, usamos signUp normal pero el administrador puede asignar roles después

      const { data: authData, error: authError } =
        await supabase.auth.admin?.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true, // Confirmar email automáticamente
          user_metadata: {
            nombre: userData.nombre || userData.email,
          },
        });

      // Si no tenemos acceso a admin, intentamos con signUp normal
      // (esto requerirá que el usuario confirme su email)
      if (authError || !supabase.auth.admin) {
        // Fallback: usar signUp normal
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                nombre: userData.nombre || userData.email,
              },
            },
          });

        if (signUpError) throw signUpError;

        // Esperar a que el trigger cree el usuario en la tabla usuarios
        // y luego actualizar el rol
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Actualizar el rol del usuario recién creado
        const { error: updateError } = await this.updateUserRole(
          signUpData.user.id,
          userData.rol
        );

        if (updateError) {
          toastService.warning(
            'Usuario creado pero error al asignar rol. Se asignó rol "usuario" por defecto.'
          );
        } else {
          toastService.success("Usuario creado exitosamente");
        }

        return { data: signUpData, error: null };
      }

      // Si tenemos acceso a admin API
      if (authData.user) {
        // Actualizar el rol del usuario
        const { error: updateError } = await this.updateUserRole(
          authData.user.id,
          userData.rol
        );

        if (updateError) {
          toastService.warning(
            'Usuario creado pero error al asignar rol. Se asignó rol "usuario" por defecto.'
          );
        } else {
          toastService.success("Usuario creado exitosamente");
        }

        return { data: authData, error: null };
      }

      throw new Error("Error desconocido al crear usuario");
    } catch (error) {
      toastService.error(`Error al crear usuario: ${error.message}`);
      return { data: null, error };
    }
  },

  // Actualizar el rol de un usuario
  async updateUserRole(userId, rol) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .update({ rol })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Actualizar información de un usuario
  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      toastService.success("Usuario actualizado exitosamente");
      return { data, error: null };
    } catch (error) {
      toastService.error(`Error al actualizar usuario: ${error.message}`);
      return { data: null, error };
    }
  },

  // Desactivar/Activar un usuario
  async toggleUserStatus(userId, activo) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .update({ activo })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      toastService.success(
        `Usuario ${activo ? "activado" : "desactivado"} exitosamente`
      );
      return { data, error: null };
    } catch (error) {
      toastService.error(
        `Error al cambiar estado del usuario: ${error.message}`
      );
      return { data: null, error };
    }
  },
};
