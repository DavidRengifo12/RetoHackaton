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
    email: payload.email || "N/A",
  });

  // Mostrar advertencia si se está usando la URL por defecto
  if (
    payload.tipo === "comprobante_pago" &&
    !import.meta.env.VITE_N8N_WEBHOOK_COMPROBANTE
  ) {
    console.warn(
      "[N8N] ⚠️ Usando URL por defecto para comprobantes. Verifica que el webhook exista en n8n."
    );
    console.warn(
      "[N8N] 💡 Para usar una URL personalizada, crea un archivo .env con VITE_N8N_WEBHOOK_COMPROBANTE"
    );
  }

  // Validar payload
  if (!payload || !payload.tipo) {
    console.error("[N8N] ❌ Payload inválido:", payload);
    return false;
  }

  // Crear un AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("[N8N] 📥 Respuesta HTTP de n8n:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Obtener el texto de la respuesta primero
    const responseText = await response.text();
    console.log("[N8N] 📄 Respuesta en texto:", responseText.substring(0, 500));

    if (!response.ok) {
      console.error("[N8N] ❌ Error HTTP al enviar a n8n:", {
        status: response.status,
        statusText: response.statusText,
        error: responseText,
        webhook: webhookUrl,
        payload: {
          tipo: payload.tipo,
          email: payload.email,
          asunto: payload.asunto,
        },
      });
      return false;
    }

    // Intentar parsear como JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log("[N8N] ✅ Respuesta JSON parseada:", responseData);
    } catch {
      // Si no es JSON, puede ser que n8n responda con texto plano (esto es normal)
      console.warn(
        "[N8N] ⚠️ Respuesta de n8n no es JSON, pero el status es OK (200)"
      );
      console.warn("[N8N] 📄 Respuesta recibida:", responseText);
      // Si n8n responde con 200 OK, asumimos que recibió la solicitud correctamente
      // El envío del email puede fallar después, pero eso es responsabilidad de n8n
      return true;
    }

    console.log("[N8N] ✅ Solicitud enviada exitosamente a n8n");
    console.log("[N8N] 📥 Respuesta completa:", responseData);
    console.log("[N8N] 🔗 Webhook usado:", webhookUrl);

    // Verificar si n8n retorna un campo de éxito/error
    if (responseData && responseData.success === false) {
      console.error(
        "[N8N] ❌ n8n reportó error en la respuesta:",
        responseData.error || responseData.message || responseData
      );
      return false;
    }

    // Si llegamos aquí, la solicitud fue exitosa
    // Nota: n8n puede recibir la solicitud correctamente pero el email puede fallar después
    // Eso se manejaría en los logs de n8n, no aquí
    return true;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error("[N8N] ❌ Timeout: La solicitud tardó más de 30 segundos");
      console.error("[N8N] 🔗 Webhook:", webhookUrl);
      return false;
    }

    console.error("[N8N] ❌ Error de red al conectar con n8n:", error);
    console.error("[N8N] 🔗 Webhook intentado:", webhookUrl);
    console.error("[N8N] 📧 Email destino:", payload.email);
    console.error("[N8N] ⚠️ Posibles causas:");
    console.error("  1. El webhook no está activo en n8n");
    console.error("  2. La URL del webhook es incorrecta");
    console.error("  3. Problemas de conectividad de red");
    console.error("  4. CORS bloqueando la solicitud");
    console.error("  5. El servidor de n8n está caído");
    console.error("[N8N] 💡 Solución: Verifica en n8n que:");
    console.error("  - El workflow esté activo");
    console.error("  - El webhook esté activado");
    console.error("  - La URL del webhook sea correcta");
    console.error("  - El nodo de email esté configurado correctamente");
    return false;
  }
}
