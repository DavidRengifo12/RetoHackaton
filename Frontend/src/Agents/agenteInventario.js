import supabase from "../services/supabase";
import { mejorarRespuestaConOpenAI } from "../services/openaiService";

/**
 * 🧠 Agente de Inventario - Búsqueda Inteligente
 * - Busca por palabras individuales en el nombre
 * - Busca en categoría y género
 * - Maneja plurales y sinónimos
 * - Mejora respuestas con OpenAI para lenguaje natural
 */

export async function agenteInventario(pregunta) {
  // Normalizar la pregunta (minúsculas y limpiar signos)
  const consulta = pregunta.toLowerCase().replace(/[¿?]/g, "").trim();

  // 1️⃣ Cargar todos los productos
  const { data: productos, error } = await supabase
    .from("productos_con_estadisticas")
    .select("*");

  if (error) {
    console.error("Error al consultar inventario:", error);
    return "Hubo un problema al consultar el inventario.";
  }

  if (!productos || productos.length === 0) {
    return "No hay productos en el inventario.";
  }

  // 2️⃣ PRIORIDAD 1: Verificar si pregunta sobre stock bajo
  const palabrasStockBajo = [
    "stock bajo",
    "bajo stock",
    "agotado",
    "agotados",
    "poco stock",
    "stock mínimo",
    "qué productos tienen stock bajo",
    "productos con stock bajo",
    "productos con poco stock",
  ];

  const esConsultaStockBajo = palabrasStockBajo.some((palabra) =>
    consulta.includes(palabra)
  );

  if (esConsultaStockBajo) {
    const bajos = productos.filter((p) => p.alerta_stock_bajo);
    if (bajos.length === 0) {
      const respuestaBase = "✅ Todos los productos tienen stock suficiente.";
      return await mejorarRespuestaConOpenAI(
        respuestaBase,
        "Rol: Agente de Inventario. Consulta sobre stock bajo. No hay productos con stock bajo."
      );
    }
    const respuestaBase = `⚠️ Productos con stock bajo (${
      bajos.length
    }):\n${bajos
      .map(
        (p) =>
          `• ${p.nombre}${p.talla ? ` (${p.talla})` : ""} - ${p.stock} unidades`
      )
      .join("\n")}`;
    return await mejorarRespuestaConOpenAI(
      respuestaBase,
      "Rol: Agente de Inventario. Consulta sobre stock bajo. Hay productos con stock bajo que requieren atención."
    );
  }

  // 3️⃣ PRIORIDAD 2: Verificar si pregunta sobre inventario general
  const palabrasInventario = [
    "todos los productos",
    "listar productos",
    "inventario completo",
    "qué productos hay",
    "productos disponibles",
  ];

  const esConsultaGeneral = palabrasInventario.some((palabra) =>
    consulta.includes(palabra)
  );

  if (esConsultaGeneral) {
    const total = productos.length;
    const conStockBajo = productos.filter((p) => p.alerta_stock_bajo).length;
    const resumen = productos
      .slice(0, 10)
      .map((p) => {
        let r = `• ${p.nombre}${p.talla ? ` (${p.talla})` : ""}`;
        r += ` - Stock: ${p.stock} unidades`;
        if (p.alerta_stock_bajo) r += " ⚠️";
        return r;
      })
      .join("\n");

    let respuesta = `📦 Inventario completo: ${total} productos\n`;
    if (conStockBajo > 0) {
      respuesta += `⚠️ ${conStockBajo} productos con stock bajo\n\n`;
    }
    respuesta += `Primeros 10 productos:\n${resumen}`;
    if (total > 10) {
      respuesta += `\n\n... y ${total - 10} productos más.`;
    }
    return respuesta;
  }

  // 4️⃣ PRIORIDAD 3: Búsqueda inteligente por palabras
  // Extraer palabras clave de la pregunta (incluir palabras cortas también)
  const palabrasClave = consulta.split(/\s+/).filter(
    (palabra) =>
      palabra.length > 1 && // Palabras de más de 1 carácter (incluye "camisa", "azul", etc.)
      ![
        "tienen",
        "tiene",
        "hay",
        "quiero",
        "busco",
        "necesito",
        "que",
        "qué",
        "de",
        "la",
        "el",
        "un",
        "una",
      ].includes(palabra)
  );

  // Si no hay palabras clave después del filtro, usar la consulta completa
  const palabrasABuscar = palabrasClave.length > 0 ? palabrasClave : [consulta];

  // Función para normalizar palabras (quitar plurales y acentos)
  const normalizarPalabra = (palabra) => {
    let normalizada = palabra
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quitar acentos
      .toLowerCase();

    // Quitar plurales
    if (normalizada.endsWith("es")) return normalizada.slice(0, -2); // camisas -> camisa
    if (normalizada.endsWith("s")) return normalizada.slice(0, -1); // leggins -> leggin

    return normalizada;
  };

  // Función para buscar productos por palabras (búsqueda más robusta)
  const buscarPorPalabras = (palabras) => {
    return productos.filter((producto) => {
      const nombreLower = (producto.nombre || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const categoriaLower = (producto.categoria || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const generoLower = (producto.genero || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      // Verificar si alguna palabra coincide en nombre, categoría o género
      return palabras.some((palabra) => {
        const palabraLower = palabra.toLowerCase();
        const palabraNormalizada = normalizarPalabra(palabra);

        // 1. Búsqueda directa (sin normalización)
        if (
          nombreLower.includes(palabraLower) ||
          categoriaLower.includes(palabraLower) ||
          generoLower.includes(palabraLower)
        ) {
          return true;
        }

        // 2. Búsqueda con normalización (maneja plurales)
        const nombreNormalizado = normalizarPalabra(nombreLower);
        const categoriaNormalizada = normalizarPalabra(categoriaLower);
        const generoNormalizado = normalizarPalabra(generoLower);

        if (
          nombreNormalizado.includes(palabraNormalizada) ||
          palabraNormalizada.includes(nombreNormalizado) ||
          categoriaNormalizada.includes(palabraNormalizada) ||
          generoNormalizado.includes(palabraNormalizada)
        ) {
          return true;
        }

        // 3. Búsqueda parcial (por si el producto tiene "Camisa Blanca" y buscan "camisa")
        const palabrasNombre = nombreLower.split(/\s+/);
        if (
          palabrasNombre.some(
            (p) => p.includes(palabraLower) || palabraLower.includes(p)
          )
        ) {
          return true;
        }

        return false;
      });
    });
  };

  // Buscar productos
  let encontrados = buscarPorPalabras(palabrasABuscar);

  // Si no se encontraron resultados, intentar con la consulta completa sin filtrar
  if (encontrados.length === 0) {
    encontrados = productos.filter((producto) => {
      const nombreLower = (producto.nombre || "").toLowerCase();
      const categoriaLower = (producto.categoria || "").toLowerCase();
      const generoLower = (producto.genero || "").toLowerCase();

      return (
        nombreLower.includes(consulta) ||
        categoriaLower.includes(consulta) ||
        generoLower.includes(consulta)
      );
    });
  }

  if (encontrados.length > 0) {
    const respuestas = encontrados.map((p) => {
      let r = `👕 ${p.nombre}${p.talla ? ` (${p.talla})` : ""}\n`;
      r += `📦 Stock: ${p.stock} unidades\n`;
      r += `💲 Precio: $${p.precio}\n`;
      if (p.categoria) r += `🏷️ Categoría: ${p.categoria}\n`;
      if (p.genero) r += `👤 Género: ${p.genero}\n`;
      if (p.alerta_stock_bajo) r += "⚠️ ¡Stock bajo!\n";
      return r;
    });

    const respuestaBase = respuestas.join("\n----------------------\n");
    return await mejorarRespuestaConOpenAI(
      respuestaBase,
      `Rol: Agente de Inventario. Consulta sobre productos. Encontrados ${encontrados.length} producto(s) que coinciden con la búsqueda.`
    );
  }

  // 5️⃣ Si no encontró coincidencias, ofrecer ayuda
  const respuestaBase = `No encontré productos que coincidan con "${pregunta}".\n\n💡 Puedes preguntar:\n• "¿Qué productos tienen stock bajo?"\n• "Listar todos los productos"\n• Buscar por tipo: "camisas", "chaquetas", "jeans"\n• Buscar por género: "ropa mujer", "ropa hombre"\n• Buscar por color: "negro", "azul", "blanco"`;

  // Mejorar respuesta con OpenAI si está configurado
  return await mejorarRespuestaConOpenAI(
    respuestaBase,
    "Rol: Agente de Inventario. Especialista en consultas de productos, stock, tallas y precios."
  );
}
