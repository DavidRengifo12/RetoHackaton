import { agenteInventario } from "../Agents/agenteInventario";
import { agenteAnalista } from "../Agents/agenteAnalista";
import { enviarAlertaN8N } from "../services/n8n.js";

/**
 * 🤝 MCP Manager - Coordinador Agent-to-Agent
 * - Decide qué agente debe responder una pregunta
 * - Permite consultas encadenadas entre agentes
 * - Maneja errores y respuestas combinadas
 * - Envía alertas a n8n cuando detecta problemas
 */

export async function MCPManager(pregunta) {
  try {
    const consulta = pregunta.toLowerCase().trim();

    // Clasificar tipo de intención
    const esInventario =
      consulta.includes("stock") ||
      consulta.includes("inventario") ||
      consulta.includes("producto") ||
      consulta.includes("talla") ||
      consulta.includes("precio") ||
      consulta.includes("camisa") ||
      consulta.includes("chaqueta") ||
      consulta.includes("leggin") ||
      consulta.includes("jean") ||
      consulta.includes("ropa");

    const esAnalisis =
      consulta.includes("rotacion") ||
      consulta.includes("rotación") ||
      consulta.includes("vendido") ||
      consulta.includes("ventas") ||
      consulta.includes("ganancia") ||
      consulta.includes("ingreso") ||
      consulta.includes("categoria") ||
      consulta.includes("top") ||
      consulta.includes("mejor") ||
      consulta.includes("mas vendidos") ||
      consulta.includes("más vendidos") ||
      consulta.includes("buena rotacion") ||
      consulta.includes("buena rotación") ||
      (consulta.includes("buena") && consulta.includes("rotacion"));

    // 🔄 Caso mixto: requiere ambos agentes (Agent-to-Agent)
    // Detecta consultas que necesitan ambos agentes
    const esCombinado =
      (consulta.includes("stock") &&
        (consulta.includes("rotacion") || consulta.includes("rotación"))) ||
      (consulta.includes("bajo") &&
        (consulta.includes("rotacion") || consulta.includes("rotación"))) ||
      (consulta.includes("bajo") && consulta.includes("vendido")) ||
      (consulta.includes("producto") &&
        consulta.includes("ventas") &&
        consulta.includes("bajo")) ||
      (consulta.includes("inventario") && consulta.includes("analisis")) ||
      (consulta.includes("stock bajo") && consulta.includes("buena"));

    // Lógica de decisión Agent-to-Agent
    if (esCombinado) {
      // Ejecutar ambos agentes en paralelo para mejor performance
      const [inventario, analisis] = await Promise.all([
        agenteInventario(pregunta),
        agenteAnalista(pregunta),
      ]);

      // Detectar si hay productos con stock bajo
      // Solo enviar alerta si realmente hay stock bajo (no si todos tienen stock suficiente)
      const tieneStockBajo =
        (inventario.includes("⚠️") ||
          inventario.includes("stock bajo") ||
          inventario.includes("Productos con stock bajo")) &&
        !inventario.includes("✅ Todos los productos tienen stock suficiente");

      // Si detectamos productos con stock bajo, enviar alerta a n8n
      if (tieneStockBajo) {
        try {
          const resultado = await enviarAlertaN8N({
            origen: "MCP",
            tipo: "stock_alert",
            mensaje: "Stock bajo detectado con análisis de rotación",
            detalle: {
              inventario: inventario,
              analisis: analisis,
              pregunta: pregunta,
            },
            fecha: new Date().toISOString(),
          });

          if (resultado) {
            console.log("[MCP Manager] ✅ Alerta enviada a n8n exitosamente");
          } else {
            console.warn("[MCP Manager] ⚠️ No se pudo enviar alerta a n8n");
          }
        } catch (error) {
          console.error(
            "[MCP Manager] ❌ Error al enviar alerta a n8n:",
            error
          );
          // No fallar si n8n no responde, continuar con la respuesta
        }
      }

      return `📦 *Análisis Combinado (Agent-to-Agent)*\n\n🤖 *Agente de Inventario:*\n${inventario}\n\n📊 *Agente Analista:*\n${analisis}`;
    }

    // Caso: Solo inventario
    if (esInventario && !esAnalisis) {
      const resultado = await agenteInventario(pregunta);

      // Detectar stock bajo incluso en consultas individuales
      // Solo enviar alerta si realmente hay stock bajo
      const tieneStockBajoIndividual =
        (resultado.includes("⚠️") || resultado.includes("stock bajo")) &&
        !resultado.includes("✅ Todos los productos tienen stock suficiente");

      if (tieneStockBajoIndividual) {
        try {
          await enviarAlertaN8N({
            origen: "MCP",
            tipo: "stock_alert",
            mensaje: "Stock bajo detectado",
            detalle: {
              inventario: resultado,
              pregunta: pregunta,
            },
            fecha: new Date().toISOString(),
          });
          console.log("[MCP Manager] ✅ Alerta enviada a n8n");
        } catch (error) {
          console.error("[MCP Manager] Error al enviar alerta a n8n:", error);
        }
      }

      return resultado;
    }

    // Caso: Solo análisis
    if (esAnalisis && !esInventario) {
      return await agenteAnalista(pregunta);
    }

    // Caso: Ambos indicadores pero no claramente combinado
    if (esInventario && esAnalisis) {
      const [inventario, analisis] = await Promise.all([
        agenteInventario(pregunta),
        agenteAnalista(pregunta),
      ]);

      // Verificar si hay stock bajo
      // Solo enviar alerta si realmente hay stock bajo
      const tieneStockBajo =
        (inventario.includes("⚠️") || inventario.includes("stock bajo")) &&
        !inventario.includes("✅ Todos los productos tienen stock suficiente");

      if (tieneStockBajo) {
        try {
          await enviarAlertaN8N({
            origen: "MCP",
            tipo: "stock_alert",
            mensaje: "Stock bajo detectado",
            detalle: {
              inventario: inventario,
              analisis: analisis,
              pregunta: pregunta,
            },
            fecha: new Date().toISOString(),
          });
          console.log("[MCP Manager] ✅ Alerta enviada a n8n");
        } catch (error) {
          console.error("[MCP Manager] Error al enviar alerta a n8n:", error);
        }
      }

      return `🤖 *Agente de Inventario:*\n${inventario}\n\n📊 *Agente Analista:*\n${analisis}`;
    }

    // Si no se entiende, consultar a ambos agentes (fallback)
    const [inv, ana] = await Promise.all([
      agenteInventario(pregunta),
      agenteAnalista(pregunta),
    ]);

    // Verificar si hay stock bajo en el fallback también
    // Solo enviar alerta si realmente hay stock bajo
    const tieneStockBajoFallback =
      (inv.includes("⚠️") || inv.includes("stock bajo")) &&
      !inv.includes("✅ Todos los productos tienen stock suficiente");

    if (tieneStockBajoFallback) {
      try {
        await enviarAlertaN8N({
          origen: "MCP",
          tipo: "stock_alert",
          mensaje: "Stock bajo detectado",
          detalle: {
            inventario: inv,
            analisis: ana,
            pregunta: pregunta,
          },
          fecha: new Date().toISOString(),
        });
        console.log("[MCP Manager] ✅ Alerta enviada a n8n");
      } catch (error) {
        console.error("[MCP Manager] Error al enviar alerta a n8n:", error);
      }
    }

    return `🤖 *Agente de Inventario:*\n${inv}\n\n📊 *Agente Analista:*\n${ana}`;
  } catch (error) {
    console.error("[MCP Manager] Error:", error);
    return `❌ Error al procesar la consulta: ${error.message}\n\n💡 Intenta reformular tu pregunta.`;
  }
}
