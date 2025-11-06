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
  // Normalizar texto: quitar acentos y convertir a minúsculas
  const texto = pregunta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .trim();

  // Palabras clave de contexto - COMPRAS
  // Nota: Las palabras ya están normalizadas (sin acentos) en el texto
  const comprasKeywords = [
    "comprar",
    "compras",
    "compra",
    "carrito",
    "agregar",
    "anadir", // sin acento (normalizado)
    "anade", // sin acento
    "agrega",
    "quiero comprar",
    "necesito comprar",
    "deseo comprar",
    "ayuda en compras",
    "ayudame en compras",
    "ayudame con compras",
    "ayuda con compras",
    "quiero",
    "necesito",
    "deseo",
    "busco comprar",
    "busco para comprar",
    "pago",
    "pagar",
    "metodo de pago",
    "saldo",
    "cuanto tengo",
  ];

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
    "ver productos",
    "mostrar productos",
    "qué productos",
    "que productos",
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

  // Detectar si es pregunta sobre compras
  const esCompras = comprasKeywords.some((w) => texto.includes(w));

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
    // Si es pregunta sobre compras, dar respuesta específica y útil
    if (esCompras) {
      // Primero intentar buscar productos si menciona algo específico
      if (esInventario) {
        // Si menciona productos específicos, buscar en inventario
        respuesta = await MCPManager(pregunta);

        // Agregar información sobre cómo comprar
        if (respuesta && !respuesta.includes("No encontré")) {
          respuesta += "\n\n🛒 Para agregar productos a tu carrito:\n";
          respuesta += "• Ve a la sección 'Tienda' en el menú\n";
          respuesta += "• Busca el producto que deseas\n";
          respuesta += "• Haz clic en 'Agregar' para añadirlo al carrito\n";
          respuesta += "• Luego ve a tu carrito para proceder al pago";
        } else {
          // Si no encontró productos, dar información general sobre compras
          respuesta = "🛒 ¡Te puedo ayudar con tus compras!\n\n";
          respuesta += "Para comprar productos:\n";
          respuesta += "1️⃣ Ve a la sección 'Tienda' en el menú superior\n";
          respuesta += "2️⃣ Explora los productos disponibles\n";
          respuesta +=
            "3️⃣ Usa los filtros para encontrar lo que buscas (categoría, género, etc.)\n";
          respuesta +=
            "4️⃣ Haz clic en 'Agregar' para añadir productos a tu carrito\n";
          respuesta +=
            "5️⃣ Ve a tu carrito (ícono en la parte superior) para revisar y pagar\n\n";
          respuesta +=
            "💡 También puedes preguntarme sobre productos específicos, por ejemplo:\n";
          respuesta += "• '¿Tienen camisas para mujer?'\n";
          respuesta += "• 'Busco jeans talla 32'\n";
          respuesta += "• '¿Qué productos hay disponibles?'";
        }
      } else {
        // Pregunta genérica sobre compras
        respuesta = "🛒 ¡Te puedo ayudar con tus compras!\n\n";
        respuesta += "📋 Aquí tienes información útil:\n\n";
        respuesta += "🛍️ **Cómo comprar:**\n";
        respuesta += "1. Ve a la sección 'Tienda' en el menú\n";
        respuesta += "2. Explora los productos disponibles\n";
        respuesta += "3. Usa los filtros para encontrar lo que buscas\n";
        respuesta += "4. Haz clic en 'Agregar' para añadir al carrito\n";
        respuesta += "5. Ve a tu carrito para revisar y proceder al pago\n\n";
        respuesta += "💳 **Métodos de pago disponibles:**\n";
        respuesta += "• Nequi\n";
        respuesta += "• Tarjeta Débito\n";
        respuesta += "• Tarjeta Crédito\n";
        respuesta += "• Efectivo\n\n";
        respuesta += "💡 **Puedo ayudarte a:**\n";
        respuesta += "• Buscar productos específicos\n";
        respuesta += "• Consultar precios y disponibilidad\n";
        respuesta += "• Encontrar productos por categoría o género\n";
        respuesta += "• Ver información de stock\n\n";
        respuesta +=
          "¿Qué producto estás buscando? Por ejemplo: '¿Tienen camisas para mujer?' o 'Busco jeans'";
      }
    }
    // Si es una pregunta combinada o sobre inventario/análisis, enviar al MCPManager
    else if (esCombinado || esInventario || esAnalisis || esPreguntaGenerica) {
      respuesta = await MCPManager(pregunta);
    } else {
      // Si no se detecta ninguna intención clara, intentar buscar en inventario de todas formas
      // Esto ayuda con preguntas que no usan palabras clave obvias
      respuesta = await MCPManager(pregunta);

      // Si la respuesta del MCPManager indica que no encontró nada, mostrar mensaje genérico mejorado
      if (
        respuesta &&
        (respuesta.includes("No encontré") ||
          respuesta.includes("No estoy seguro") ||
          respuesta.toLowerCase().includes("no estoy"))
      ) {
        respuesta =
          "🤖 No estoy completamente seguro de qué necesitas, pero puedo ayudarte con:\n\n";
        respuesta += "🛒 **Compras:**\n";
        respuesta += "• Buscar productos\n";
        respuesta += "• Consultar precios y disponibilidad\n";
        respuesta += "• Información sobre el proceso de compra\n\n";
        respuesta += "📦 **Productos:**\n";
        respuesta += "• Consultar inventario\n";
        respuesta += "• Buscar por tipo, categoría o género\n";
        respuesta += "• Ver stock disponible\n\n";
        respuesta += "📊 **Análisis:**\n";
        respuesta += "• Consultar ventas\n";
        respuesta += "• Ver productos más vendidos\n\n";
        respuesta += "💡 Puedes preguntar cosas como:\n";
        respuesta += "• '¿Tienen camisas para mujer?'\n";
        respuesta += "• 'Ayúdame en compras'\n";
        respuesta += "• '¿Qué productos hay disponibles?'\n";
        respuesta += "• 'Busco jeans talla 32'";
      }
    }

    // Mejorar respuesta con OpenAI si está configurado
    // No mejorar respuestas de compras ya que están bien formateadas y son específicas
    if (respuesta && !esCompras) {
      respuesta = await mejorarRespuestaConOpenAI(
        respuesta,
        "Rol: Agente Cliente. Punto de entrada principal que enruta consultas a agentes especializados. Responde de manera amigable y útil."
      );
    }
  } catch (error) {
    console.error("Error en AgenteCliente:", error);
    respuesta = "⚠️ Ocurrió un error procesando tu consulta.";
  }

  return respuesta;
}
