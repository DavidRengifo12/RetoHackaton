import { MCPManager } from "../mcp/mcpManager";
import { mejorarRespuestaConOpenAI } from "../services/openaiService";

/**
 * 🗣️ AgenteCliente
 * - Interpreta lenguaje natural del usuario
 * - Decide a qué agente delegar la consulta
 * - Devuelve una respuesta formateada y fácil de leer
 * - Mejora respuestas con OpenAI para lenguaje natural
 */

export async function agenteCliente(pregunta) {
  const texto = pregunta.toLowerCase().trim();

  // Palabras clave de contexto - INVENTARIO
  const invKeywords = [
    // Tipos de productos
    "camisa",
    "chaqueta",
    "chaquetas",
    "jean",
    "jeans",
    "pantalon",
    "pantalones",
    "leggin",
    "leggings",
    "vestido",
    "vestidos",
    "falda",
    "faldas",
    "blusa",
    "blusas",
    "short",
    "shorts",
    "sudadera",
    "sudaderas",
    "polo",
    "polos",
    "ropa",
    // Conceptos generales
    "producto",
    "productos",
    "inventario",
    "precio",
    "precios",
    "talla",
    "tallas",
    "stock",
    "disponible",
    "disponibles",
    "tiene",
    "tienen",
    "hay",
    "tienda",
    "qué tiene",
    "qué hay",
    "que tiene",
    "que hay",
    "listar",
    "mostrar",
    "buscar",
    "busco",
    "categoría",
    "categoria",
    "género",
    "genero",
  ];

  // Palabras clave de contexto - ANÁLISIS
  const anaKeywords = [
    "venta",
    "ventas",
    "vendido",
    "vendidos",
    "ganancia",
    "ganancias",
    "rotacion",
    "rotación",
    "categoria",
    "ingreso",
    "ingresos",
    "análisis",
    "analisis",
    "estadística",
    "estadisticas",
    "top",
    "mejor",
    "mejores",
    "más vendido",
    "mas vendido",
  ];

  // Detectar si es pregunta sobre inventario
  const esInventario = invKeywords.some((w) => texto.includes(w));

  // Detectar si es pregunta sobre análisis
  const esAnalisis = anaKeywords.some((w) => texto.includes(w));

  // Detectar preguntas genéricas sobre productos disponibles
  const esPreguntaGenerica =
    ((texto.includes("qué") || texto.includes("que")) &&
      (texto.includes("tiene") ||
        texto.includes("hay") ||
        texto.includes("disponible"))) ||
    texto.includes("tienda") ||
    texto.includes("qué tiene") ||
    texto.includes("que tiene");

  const esCombinado = esInventario && esAnalisis;

  let respuesta = "";

  try {
    // Si es una pregunta combinada o sobre inventario/análisis, enviar al MCPManager
    if (esCombinado || esInventario || esAnalisis || esPreguntaGenerica) {
      respuesta = await MCPManager(pregunta);
    } else {
      // Si no se detecta ninguna intención clara, intentar buscar en inventario de todas formas
      // Esto ayuda con preguntas que no usan palabras clave obvias
      respuesta = await MCPManager(pregunta);

      // Si la respuesta del MCPManager indica que no encontró nada, mostrar mensaje genérico
      if (
        respuesta &&
        (respuesta.includes("No encontré") ||
          respuesta.includes("No estoy seguro") ||
          respuesta.toLowerCase().includes("no estoy"))
      ) {
        respuesta =
          "🤖 No estoy del todo seguro de a qué te refieres. Pero si quieres, puedes preguntar sobre nuestros productos (como el inventario) o sobre ventas (como los análisis). Estoy aquí para ayudarte.";
      }
    }

    // Mejorar respuesta con OpenAI si está configurado
    if (respuesta) {
      respuesta = await mejorarRespuestaConOpenAI(
        respuesta,
        "Rol: Agente Cliente. Punto de entrada principal que enruta consultas a agentes especializados."
      );
    }
  } catch (error) {
    console.error("Error en AgenteCliente:", error);
    respuesta = "⚠️ Ocurrió un error procesando tu consulta.";
  }

  return respuesta;
}
