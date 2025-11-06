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

      // Enviar a n8n (que se encargará de enviar el email)
      const enviado = await enviarAlertaN8N(payload);

      if (enviado) {
        console.log("[EmailService] ✅ Comprobante enviado exitosamente");
        return { success: true, error: null };
      } else {
        console.warn("[EmailService] ⚠️ No se pudo enviar el comprobante");
        return { success: false, error: "No se pudo enviar el comprobante" };
      }
    } catch (error) {
      console.error("[EmailService] ❌ Error al enviar comprobante:", error);
      return { success: false, error: error.message };
    }
  },
};
