// Servicio para envío de comprobantes por email
import { enviarAlertaN8N } from "./n8n";

export const emailService = {
  // Enviar comprobante de pago por email
  async enviarComprobantePago({
    email,
    nombreUsuario,
    numeroVenta,
    items,
    total,
    metodoPago,
    fecha,
    nuevoSaldo,
  }) {
    try {
      // Validar datos requeridos
      if (!email) {
        console.error("[EmailService] ❌ Email no proporcionado");
        return {
          success: false,
          error: "Email no proporcionado",
        };
      }

      if (!items || items.length === 0) {
        console.error("[EmailService] ❌ No hay items para enviar");
        return {
          success: false,
          error: "No hay items en la compra",
        };
      }

      console.log("[EmailService] 📧 Preparando comprobante para:", email);
      console.log("[EmailService] 📦 Items:", items.length);

      // Formatear items para el comprobante
      const itemsFormateados = items.map((item, index) => ({
        numero: index + 1,
        producto: item.productos?.nombre || "Producto",
        cantidad: item.cantidad,
        precioUnitario: item.precio_unitario,
        subtotal: item.precio_unitario * item.cantidad,
      }));

      // Crear payload para n8n
      const payload = {
        tipo: "comprobante_pago",
        email: email,
        asunto: `Comprobante de Pago - Venta #${numeroVenta || "N/A"}`,
        datos: {
          nombreUsuario: nombreUsuario || "Cliente",
          numeroVenta: numeroVenta || "N/A",
          fecha: fecha || new Date().toLocaleString("es-CO"),
          items: itemsFormateados,
          subtotal: total,
          total: total,
          metodoPago: metodoPago,
          nuevoSaldo: nuevoSaldo,
        },
        fecha: new Date().toISOString(),
      };

      console.log("[EmailService] 📤 Payload preparado:", {
        tipo: payload.tipo,
        email: payload.email,
        asunto: payload.asunto,
        itemsCount: payload.datos.items.length,
        total: payload.datos.total,
      });

      // Enviar a n8n (que se encargará de enviar el email)
      const enviado = await enviarAlertaN8N(payload);

      if (enviado) {
        console.log("[EmailService] ✅ Comprobante enviado exitosamente a n8n");
        console.log("[EmailService] 📧 Email:", email);
        console.log("[EmailService] 📋 Asunto:", payload.asunto);
        return { success: true, error: null };
      } else {
        console.error(
          "[EmailService] ❌ No se pudo enviar el comprobante a n8n"
        );
        console.error("[EmailService] 📧 Email destino:", email);
        console.error("[EmailService] ⚠️ Verifica:");
        console.error("  1. Que el webhook de n8n esté activo");
        console.error("  2. Que la URL del webhook sea correcta");
        console.error("  3. Que n8n tenga configurado el servicio de email");
        return {
          success: false,
          error:
            "No se pudo enviar el comprobante. Verifica la configuración de n8n.",
        };
      }
    } catch (error) {
      console.error("[EmailService] ❌ Error al enviar comprobante:", error);
      return { success: false, error: error.message };
    }
  },
};
