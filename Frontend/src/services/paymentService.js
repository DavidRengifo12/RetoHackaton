// Servicio para gestión de pagos simulados
import supabase from "./supabase";
import { toastService } from "../utils/toastService";
import { emailService } from "./emailService";

export const paymentService = {
  // Métodos de pago disponibles
  METODOS_PAGO: [
    { id: "nequi", nombre: "Nequi", icon: "💳" },
    { id: "tarjeta_debito", nombre: "Tarjeta Débito", icon: "💳" },
    { id: "tarjeta_credito", nombre: "Tarjeta Crédito", icon: "💳" },
    { id: "efectivo", nombre: "Efectivo", icon: "💵" },
  ],

  // Obtener saldo del usuario
  async getSaldoUsuario(userId) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("saldo")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data: data?.saldo || 0, error: null };
    } catch (error) {
      console.error("Error al obtener saldo:", error);
      return { data: 0, error };
    }
  },

  // Actualizar saldo del usuario
  async updateSaldoUsuario(userId, nuevoSaldo) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .update({ saldo: nuevoSaldo })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error al actualizar saldo:", error);
      toastService.error(`Error al actualizar saldo: ${error.message}`);
      return { data: null, error };
    }
  },

  // Procesar pago
  async procesarPago(
    userId,
    monto,
    metodoPago,
    carritoId,
    userEmail,
    userName
  ) {
    try {
      // Obtener saldo actual
      const { data: saldoData, error: saldoError } = await this.getSaldoUsuario(
        userId
      );

      if (saldoError) throw saldoError;

      const saldoActual = saldoData;

      // Verificar que tenga suficiente saldo
      if (saldoActual < monto) {
        toastService.error("Saldo insuficiente");
        return {
          success: false,
          error: "Saldo insuficiente",
          saldoActual,
        };
      }

      // Calcular nuevo saldo
      const nuevoSaldo = saldoActual - monto;

      // Actualizar saldo
      const { error: updateError } = await this.updateSaldoUsuario(
        userId,
        nuevoSaldo
      );

      if (updateError) throw updateError;

      // Obtener items del carrito
      const { data: items, error: itemsError } = await supabase
        .from("carritos_items")
        .select("*, productos(*)")
        .eq("carrito_id", carritoId);

      if (itemsError) throw itemsError;

      // Crear ventas para cada item
      const ventas = [];
      let numeroVenta = null;
      for (const item of items) {
        const { data: venta, error: ventaError } = await supabase
          .from("ventas")
          .insert({
            producto_id: item.producto_id,
            nombre_producto: item.productos.nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            metodo_pago: metodoPago,
            usuario_id: userId,
            fecha_venta: new Date().toISOString(),
          })
          .select()
          .single();

        if (ventaError) {
          console.error("Error al crear venta:", ventaError);
        } else {
          ventas.push(venta);
          // Guardar el número de venta del primer item
          if (!numeroVenta && venta.numero_venta) {
            numeroVenta = venta.numero_venta;
          }
        }
      }

      // Desactivar carrito
      await supabase
        .from("carritos")
        .update({ activo: false })
        .eq("id", carritoId);

      // Enviar comprobante por email
      if (userEmail && items.length > 0) {
        try {
          await emailService.enviarComprobantePago({
            email: userEmail,
            nombreUsuario: userName || "Cliente",
            numeroVenta: numeroVenta || ventas[0]?.id || "N/A",
            items: items,
            total: monto,
            metodoPago: this.getMetodoPagoNombre(metodoPago),
            fecha: new Date().toLocaleString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            nuevoSaldo: nuevoSaldo,
          });
          console.log("[PaymentService] ✅ Comprobante enviado por email");
        } catch (emailError) {
          console.error(
            "[PaymentService] ⚠️ Error al enviar comprobante:",
            emailError
          );
          // No fallar el pago si el email falla
        }
      }

      toastService.success(
        `Pago procesado exitosamente con ${this.getMetodoPagoNombre(
          metodoPago
        )}. ${userEmail ? "Comprobante enviado a tu correo." : ""}`
      );

      return {
        success: true,
        nuevoSaldo,
        ventas,
        numeroVenta,
        error: null,
      };
    } catch (error) {
      console.error("Error al procesar pago:", error);
      toastService.error(`Error al procesar pago: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Obtener nombre del método de pago
  getMetodoPagoNombre(metodoId) {
    const metodo = this.METODOS_PAGO.find((m) => m.id === metodoId);
    return metodo ? metodo.nombre : metodoId;
  },

  // Recargar saldo (simulado - para testing)
  async recargarSaldo(userId, monto) {
    try {
      const { data: saldoData, error: saldoError } = await this.getSaldoUsuario(
        userId
      );

      if (saldoError) throw saldoError;

      const nuevoSaldo = (saldoData || 0) + monto;

      const { error: updateError } = await this.updateSaldoUsuario(
        userId,
        nuevoSaldo
      );

      if (updateError) throw updateError;

      toastService.success(`Saldo recargado: $${monto.toLocaleString()}`);
      return { success: true, nuevoSaldo, error: null };
    } catch (error) {
      console.error("Error al recargar saldo:", error);
      toastService.error(`Error al recargar saldo: ${error.message}`);
      return { success: false, error: error.message };
    }
  },
};
