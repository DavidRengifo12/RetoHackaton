/**
 * 🤖 Servicio de OpenAI
 * - Mejora respuestas con lenguaje natural
 * - Formatea respuestas de manera más amigable
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Modelos válidos de OpenAI (prioridad: más reciente primero)
const MODELOS_VALIDOS = [
  "gpt-4o", // Modelo más reciente y potente
  "gpt-4o-mini", // Versión económica de gpt-4o
  "gpt-4-turbo", // GPT-4 Turbo
  "gpt-4", // GPT-4 estándar
  "gpt-3.5-turbo", // GPT-3.5 Turbo (más económico)
];

// Obtener modelo configurado o usar el mejor disponible
const modeloConfigurado = import.meta.env.VITE_OPENAI_MODEL || "gpt-4o";
const OPENAI_MODEL = MODELOS_VALIDOS.includes(modeloConfigurado)
  ? modeloConfigurado
  : "gpt-4o"; // Modelo por defecto si el configurado no es válido

/**
 * Mejora una respuesta usando OpenAI para hacerla más natural
 * @param {string} respuestaOriginal - Respuesta técnica del agente
 * @param {string} contexto - Contexto adicional (rol del agente, pregunta del usuario)
 * @returns {Promise<string>} - Respuesta mejorada
 */
export async function mejorarRespuestaConOpenAI(
  respuestaOriginal,
  contexto = ""
) {
  // Si no hay API key, retorna la respuesta original
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "tu-api-key-aqui") {
    console.warn(
      "[OpenAI] ⚠️ API key no configurada, retornando respuesta original"
    );
    return respuestaOriginal;
  }

  // Log del modelo que se está usando
  console.log(`[OpenAI] 🤖 Usando modelo: ${OPENAI_MODEL}`);

  try {
    const prompt = `Eres un asistente experto que mejora respuestas técnicas haciéndolas más naturales y amigables.

Contexto: ${contexto}

Respuesta técnica original:
${respuestaOriginal}

Instrucciones:
- Mantén toda la información técnica importante
- Haz la respuesta más conversacional y natural
- Mejora la estructura si es necesario
- Mantén emojis y formato si los hay
- No agregues información que no esté en la respuesta original

Respuesta mejorada:`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en mejorar respuestas técnicas haciéndolas más naturales y amigables. Mantén toda la información importante pero hazla más conversacional.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: { message: "Error desconocido" },
      }));

      // Error 429: Cuota excedida o demasiadas solicitudes
      if (response.status === 429) {
        const errorMessage = errorData.error?.message || "";
        if (
          errorMessage.includes("quota") ||
          errorMessage.includes("exceeded")
        ) {
          console.warn(
            "[OpenAI] ⚠️ Cuota de API excedida. Usando respuesta original sin mejora."
          );
          console.info(
            "[OpenAI] 💡 Para resolver: Revisa tu plan y facturación en https://platform.openai.com/account/billing"
          );
        } else {
          console.warn(
            "[OpenAI] ⚠️ Demasiadas solicitudes (rate limit). Usando respuesta original."
          );
        }
        return respuestaOriginal; // Retorna original sin mejora
      }

      // Error 401/403: API key inválida o sin permisos
      if (response.status === 401 || response.status === 403) {
        console.error(
          "[OpenAI] ❌ API key inválida o sin permisos. Verifica tu API key."
        );
        return respuestaOriginal;
      }

      console.error(
        "[OpenAI] ❌ Error:",
        response.status,
        errorData.error?.message || errorData
      );

      // Si el modelo no existe, cambiar automáticamente al siguiente válido
      if (
        response.status === 404 ||
        errorData.error?.code === "model_not_found" ||
        errorData.error?.message?.includes("model")
      ) {
        console.warn(
          `[OpenAI] ⚠️ Modelo "${OPENAI_MODEL}" no disponible. Intentando con modelo alternativo...`
        );

        // Elegir el primer modelo que sí exista en la lista y no sea el actual
        const modeloAlternativo = MODELOS_VALIDOS.find(
          (m) => m !== OPENAI_MODEL && m !== "gpt-4-turbo"
        );

        if (!modeloAlternativo) {
          console.warn("[OpenAI] ⚠️ No hay modelos alternativos disponibles.");
          return respuestaOriginal;
        }

        console.log(`[OpenAI] 🔄 Intentando con modelo: ${modeloAlternativo}`);

        // Esperar un momento para evitar error 429
        await new Promise((res) => setTimeout(res, 1200));

        const responseAlt = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: modeloAlternativo,
              messages: [
                {
                  role: "system",
                  content:
                    "Eres un experto en mejorar respuestas técnicas haciéndolas más naturales y amigables. Mantén toda la información importante pero hazla más conversacional.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          }
        );

        if (responseAlt.ok) {
          const dataAlt = await responseAlt.json();
          const respuestaMejorada =
            dataAlt.choices[0]?.message?.content?.trim() || respuestaOriginal;
          console.log(
            `[OpenAI] ✅ Respuesta mejorada con ${modeloAlternativo}`
          );
          return respuestaMejorada;
        } else {
          console.warn("[OpenAI] ⚠️ El modelo alternativo también falló.");
        }
      }

      console.warn("[OpenAI] ⚠️ Retornando respuesta original sin mejora");
      return respuestaOriginal;
    }

    const data = await response.json();
    const respuestaMejorada =
      data.choices[0]?.message?.content?.trim() || respuestaOriginal;

    console.log("[OpenAI] ✅ Respuesta mejorada exitosamente");
    return respuestaMejorada;
  } catch (error) {
    console.error("[OpenAI] ❌ Error al mejorar respuesta:", error);
    return respuestaOriginal; // Retorna original si falla
  }
}

/**
 * Verifica si OpenAI está configurado
 */
export function estaOpenAIConfigurado() {
  return !!(OPENAI_API_KEY && OPENAI_API_KEY !== "tu-api-key-aqui");
}
