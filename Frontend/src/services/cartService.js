// Servicio para gestión de carritos de compra
import supabase from "./supabase";
import { toastService } from "../utils/toastService";

export const cartService = {
  // Obtener o crear carrito activo del usuario
  async getOrCreateCart(userId) {
    try {
      // Buscar carrito activo
      const { data: existingCart, error: fetchError } = await supabase
        .from("carritos")
        .select("*")
        .eq("usuario_id", userId)
        .eq("activo", true)
        .single();

      if (existingCart && !fetchError) {
        return { data: existingCart, error: null };
      }

      // Si no existe, crear uno nuevo
      const { data: newCart, error: createError } = await supabase
        .from("carritos")
        .insert([{ usuario_id: userId, activo: true }])
        .select()
        .single();

      if (createError) throw createError;
      return { data: newCart, error: null };
    } catch (error) {
      toastService.error(`Error al obtener carrito: ${error.message}`);
      return { data: null, error };
    }
  },

  // Obtener items del carrito
  async getCartItems(cartId) {
    try {
      const { data, error } = await supabase
        .from("carritos_items")
        .select("*, productos(*)")
        .eq("carrito_id", cartId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      toastService.error(
        `Error al obtener items del carrito: ${error.message}`
      );
      return { data: null, error };
    }
  },

  // Agregar producto al carrito
  async addToCart(cartId, productId, cantidad = 1) {
    try {
      // Obtener precio del producto
      const { data: product, error: productError } = await supabase
        .from("productos")
        .select("precio, stock")
        .eq("id", productId)
        .single();

      if (productError) throw productError;

      if (product.stock < cantidad) {
        toastService.error("No hay suficiente stock disponible");
        return { data: null, error: { message: "Stock insuficiente" } };
      }

      // Verificar si el producto ya está en el carrito
      const { data: existingItem, error: checkError } = await supabase
        .from("carritos_items")
        .select("*")
        .eq("carrito_id", cartId)
        .eq("producto_id", productId)
        .single();

      if (existingItem && !checkError) {
        // Actualizar cantidad
        const newCantidad = existingItem.cantidad + cantidad;
        if (newCantidad > product.stock) {
          toastService.error("No hay suficiente stock disponible");
          return { data: null, error: { message: "Stock insuficiente" } };
        }

        const { data, error } = await supabase
          .from("carritos_items")
          .update({ cantidad: newCantidad })
          .eq("id", existingItem.id)
          .select()
          .single();

        if (error) throw error;
        toastService.success("Producto actualizado en el carrito");
        return { data, error: null };
      }

      // Insertar nuevo item
      const { data, error } = await supabase
        .from("carritos_items")
        .insert([
          {
            carrito_id: cartId,
            producto_id: productId,
            cantidad,
            precio_unitario: product.precio,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      toastService.success("Producto agregado al carrito");
      return { data, error: null };
    } catch (error) {
      toastService.error(`Error al agregar al carrito: ${error.message}`);
      return { data: null, error };
    }
  },

  // Actualizar cantidad de un item
  async updateItemQuantity(itemId, cantidad) {
    try {
      if (cantidad <= 0) {
        return await this.removeFromCart(itemId);
      }

      // Verificar stock disponible
      const { data: item, error: itemError } = await supabase
        .from("carritos_items")
        .select("producto_id, productos(stock)")
        .eq("id", itemId)
        .single();

      if (itemError) throw itemError;

      if (cantidad > item.productos.stock) {
        toastService.error("No hay suficiente stock disponible");
        return { data: null, error: { message: "Stock insuficiente" } };
      }

      const { data, error } = await supabase
        .from("carritos_items")
        .update({ cantidad })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      toastService.error(`Error al actualizar cantidad: ${error.message}`);
      return { data: null, error };
    }
  },

  // Eliminar item del carrito
  async removeFromCart(itemId) {
    try {
      const { error } = await supabase
        .from("carritos_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toastService.success("Producto eliminado del carrito");
      return { data: true, error: null };
    } catch (error) {
      toastService.error(`Error al eliminar del carrito: ${error.message}`);
      return { data: null, error };
    }
  },

  // Vaciar carrito
  async clearCart(cartId) {
    try {
      const { error } = await supabase
        .from("carritos_items")
        .delete()
        .eq("carrito_id", cartId);

      if (error) throw error;
      toastService.success("Carrito vaciado");
      return { data: true, error: null };
    } catch (error) {
      toastService.error(`Error al vaciar carrito: ${error.message}`);
      return { data: null, error };
    }
  },

  // Guardar carrito (marcar como inactivo y crear uno nuevo)
  async saveCart(cartId) {
    try {
      // Desactivar carrito actual
      const { error: deactivateError } = await supabase
        .from("carritos")
        .update({ activo: false })
        .eq("id", cartId);

      if (deactivateError) throw deactivateError;

      toastService.success("Carrito guardado exitosamente");
      return { data: true, error: null };
    } catch (error) {
      toastService.error(`Error al guardar carrito: ${error.message}`);
      return { data: null, error };
    }
  },
};
