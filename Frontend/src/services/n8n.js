export async function enviarAlertaN8N(payload) {
  // Determinar qué webhook usar según el tipo
  let webhookUrl;

  if (payload.tipo === "comprobante_pago") {
    // Webhook para comprobantes de pago
    webhookUrl =
      import.meta.env.VITE_N8N_WEBHOOK_COMPROBANTE ||
      "https://alexjh230.app.n8n.cloud/webhook-test/comprobante_pago";
  } else {
    // Webhook para alertas de stock (por defecto)
    webhookUrl =
      import.meta.env.VITE_N8N_WEBHOOK_ALERTA ||
      "https://alexjh230.app.n8n.cloud/webhook-test/alerta_stock";
  }

  console.log("[N8N] 📤 Enviando a n8n:", {
    tipo: payload.tipo,
    webhook: webhookUrl,
    fecha: payload.fecha,
  });

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("[N8N] 📥 Respuesta de n8n:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[N8N] ❌ Error al enviar alerta a n8n:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return false;
    }

    const responseData = await response.json().catch(() => null);
    console.log("[N8N] ✅ Alerta enviada exitosamente a n8n", responseData);
    return true;
  } catch (error) {
    console.error("[N8N] ❌ Error conectando con n8n:", error);
    return false;
  }
}
