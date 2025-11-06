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

  // 4️⃣ PRIORIDAD 3: Detectar consultas sobre precios específicos
  const palabrasPrecio = [
    "precio",
    "cuesta",
    "vale",
    "costo",
    "cuánto",
    "cuanto",
    "precio tiene",
    "precio del",
    "precio de la",
    "precio de",
  ];

  const esConsultaPrecio = palabrasPrecio.some((palabra) =>
    consulta.includes(palabra)
  );

  // Si es consulta de precio, extraer el nombre del producto de manera más inteligente
  let palabrasABuscar = [];
  if (esConsultaPrecio) {
    // Remover palabras relacionadas con precio y preguntas
    const palabrasARemover = [
      "precio",
      "cuesta",
      "vale",
      "costo",
      "cuánto",
      "cuanto",
      "tiene",
      "tienen",
      "hay",
      "que",
      "qué",
      "del",
      "de",
      "la",
      "el",
      "un",
      "una",
      "producto",
      "productos",
      "es",
      "son",
    ];

    // Extraer palabras que NO están en la lista de palabras a remover
    palabrasABuscar = consulta
      .split(/\s+/)
      .filter(
        (palabra) =>
          palabra.length > 0 &&
          !palabrasARemover.some((remover) =>
            palabra.toLowerCase().includes(remover.toLowerCase())
          )
      )
      .map((p) => p.toLowerCase().trim())
      .filter((p) => p.length > 0);

    // Si después de filtrar no quedan palabras o solo quedan palabras genéricas de una letra, limpiar
    if (
      palabrasABuscar.length === 0 ||
      palabrasABuscar.every((p) => p.length <= 1 || p === "x")
    ) {
      palabrasABuscar = [];
    }
  } else {
    // 5️⃣ PRIORIDAD 4: Búsqueda inteligente por palabras (caso general)
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
    palabrasABuscar = palabrasClave.length > 0 ? palabrasClave : [consulta];
  }

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

  // Buscar productos (solo si hay palabras para buscar)
  let encontrados = [];
  if (palabrasABuscar.length > 0) {
    encontrados = buscarPorPalabras(palabrasABuscar);

    // Si no se encontraron resultados, intentar búsqueda más flexible
    if (encontrados.length === 0) {
      // Intentar búsqueda parcial con cada palabra individualmente
      for (const palabra of palabrasABuscar) {
        const parciales = productos.filter((producto) => {
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

          const palabraLower = palabra
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          return (
            nombreLower.includes(palabraLower) ||
            palabraLower.includes(nombreLower) ||
            categoriaLower.includes(palabraLower) ||
            generoLower.includes(palabraLower)
          );
        });

        if (parciales.length > 0) {
          encontrados = parciales;
          break;
        }
      }

      // Si aún no hay resultados, intentar con la consulta completa sin filtrar
      if (encontrados.length === 0) {
        encontrados = productos.filter((producto) => {
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

          const consultaNormalizada = consulta
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          return (
            nombreLower.includes(consultaNormalizada) ||
            categoriaLower.includes(consultaNormalizada) ||
            generoLower.includes(consultaNormalizada)
          );
        });
      }
    }
  }

  // Si encontramos productos, formatear la respuesta
  if (encontrados.length > 0) {
    // Si es consulta de precio y hay un solo producto, dar respuesta más enfocada
    if (esConsultaPrecio && encontrados.length === 1) {
      const p = encontrados[0];
      const respuestaBase = `💲 El precio de "${p.nombre}"${
        p.talla ? ` (${p.talla})` : ""
      } es $${p.precio}\n\n📦 Stock disponible: ${p.stock} unidades${
        p.alerta_stock_bajo ? " ⚠️ (Stock bajo)" : ""
      }`;
      return await mejorarRespuestaConOpenAI(
        respuestaBase,
        `Rol: Agente de Inventario. Consulta sobre precio de producto específico. Producto encontrado: ${p.nombre}.`
      );
    }

    // Respuesta estándar para múltiples productos o búsquedas generales
    const respuestas = encontrados.slice(0, 10).map((p) => {
      let r = `👕 ${p.nombre}${p.talla ? ` (${p.talla})` : ""}\n`;
      r += `📦 Stock: ${p.stock} unidades\n`;
      r += `💲 Precio: $${p.precio}\n`;
      if (p.categoria) r += `🏷️ Categoría: ${p.categoria}\n`;
      if (p.genero) r += `👤 Género: ${p.genero}\n`;
      if (p.alerta_stock_bajo) r += "⚠️ ¡Stock bajo!\n";
      return r;
    });

    let respuestaBase = respuestas.join("\n----------------------\n");
    if (encontrados.length > 10) {
      respuestaBase += `\n\n... y ${encontrados.length - 10} producto(s) más.`;
    }

    return await mejorarRespuestaConOpenAI(
      respuestaBase,
      `Rol: Agente de Inventario. Consulta sobre productos${
        esConsultaPrecio ? " y precios" : ""
      }. Encontrados ${
        encontrados.length
      } producto(s) que coinciden con la búsqueda.`
    );
  }

  // 6️⃣ Si no encontró coincidencias, buscar productos similares o sugerir
  // Buscar productos que tengan alguna similitud (primeras letras, etc.)
  let productosSimilares = [];
  if (palabrasABuscar.length > 0 && palabrasABuscar[0].length > 1) {
    const primeraPalabra = palabrasABuscar[0].toLowerCase();
    productosSimilares = productos
      .filter((producto) => {
        const nombreLower = (producto.nombre || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        // Buscar productos que empiecen con las mismas letras
        return (
          nombreLower.startsWith(primeraPalabra.substring(0, 3)) ||
          nombreLower.includes(primeraPalabra.substring(0, 3))
        );
      })
      .slice(0, 5);
  }

  // Construir respuesta de ayuda
  let respuestaBase = "";
  if (esConsultaPrecio) {
    // Si es consulta de precio pero no se encontró el producto específico
    // Verificar si la consulta tiene palabras muy genéricas (como "X", "producto", etc.)
    const tienePalabraGenerica = palabrasABuscar.some(
      (p) => p.length <= 1 || p === "x" || p === "producto"
    );

    if (tienePalabraGenerica || palabrasABuscar.length === 0) {
      // Mostrar algunos productos de ejemplo con sus precios
      const productosEjemplo = productos.slice(0, 5);
      respuestaBase = `Para consultar el precio de un producto, necesito que me indiques el nombre específico del producto.\n\n`;
      respuestaBase += `📦 Aquí tienes algunos productos disponibles con sus precios:\n`;
      productosEjemplo.forEach((p) => {
        respuestaBase += `• ${p.nombre}${p.talla ? ` (${p.talla})` : ""} - $${
          p.precio
        }\n`;
      });
      respuestaBase += `\n💡 Ejemplos de consultas:\n`;
      respuestaBase += `• "¿Qué precio tiene ${
        productosEjemplo[0]?.nombre || "Camisa Blanca"
      }?"\n`;
      respuestaBase += `• "¿Cuánto cuesta [nombre del producto]?"\n`;
      respuestaBase += `• "Precio de [nombre del producto]"`;
    } else {
      respuestaBase = `No encontré un producto específico que coincida con "${palabrasABuscar.join(
        " "
      )}".\n\n`;
      if (productosSimilares.length > 0) {
        respuestaBase += `🔍 Productos similares que podrían interesarte:\n`;
        productosSimilares.forEach((p) => {
          respuestaBase += `• ${p.nombre}${p.talla ? ` (${p.talla})` : ""} - $${
            p.precio
          }\n`;
        });
        respuestaBase += `\n`;
      } else {
        // Mostrar algunos productos de ejemplo
        const productosEjemplo = productos.slice(0, 5);
        respuestaBase += `📦 Algunos productos disponibles:\n`;
        productosEjemplo.forEach((p) => {
          respuestaBase += `• ${p.nombre}${p.talla ? ` (${p.talla})` : ""} - $${
            p.precio
          }\n`;
        });
        respuestaBase += `\n`;
      }
      respuestaBase += `💡 Intenta ser más específico con el nombre del producto.`;
    }
  } else {
    respuestaBase = `No encontré productos que coincidan exactamente con "${pregunta}".\n\n`;
    if (productosSimilares.length > 0) {
      respuestaBase += `🔍 Productos similares que podrían interesarte:\n`;
      productosSimilares.forEach((p) => {
        respuestaBase += `• ${p.nombre}${p.talla ? ` (${p.talla})` : ""} - $${
          p.precio
        }\n`;
      });
      respuestaBase += `\n`;
    }

    respuestaBase += `💡 Puedes preguntar:\n`;
    respuestaBase += `• "¿Qué precio tiene [nombre del producto]?"\n`;
    respuestaBase += `• "¿Qué productos tienen stock bajo?"\n`;
    respuestaBase += `• "Listar todos los productos"\n`;
    respuestaBase += `• Buscar por tipo: "camisas", "chaquetas", "jeans"\n`;
    respuestaBase += `• Buscar por género: "ropa mujer", "ropa hombre"\n`;
    respuestaBase += `• Buscar por color: "negro", "azul", "blanco"`;
  }

  // Mejorar respuesta con OpenAI si está configurado
  return await mejorarRespuestaConOpenAI(
    respuestaBase,
    `Rol: Agente de Inventario. Especialista en consultas de productos, stock, tallas y precios.${
      esConsultaPrecio ? " Consulta sobre precio de producto." : ""
    } No se encontraron productos que coincidan exactamente con la búsqueda.${
      productosSimilares.length > 0 ? " Se muestran productos similares." : ""
    }`
  );
}
