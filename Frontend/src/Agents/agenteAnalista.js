import supabase from "../services/supabase";
import { mejorarRespuestaConOpenAI } from "../services/openaiService";

/**
 * 📊 Agente Analista de Ventas
 * - Consulta vistas de Supabase (rotacion_mensual, ventas_con_detalles, productos_con_estadisticas)
 * - Calcula KPIs y responde preguntas de negocio
 * - Mejora respuestas con OpenAI para lenguaje natural
 */

export async function agenteAnalista(pregunta) {
  // 🧹 Normalizar texto
  const consulta = pregunta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[¿?]/g, "")
    .trim();

  // ===========================================
  // 1️⃣ DETECCIÓN DE INTENCIÓN
  // ===========================================
  const buscaRotacion =
    consulta.includes("rotacion") ||
    consulta.includes("vendid") || // para “vendidos”, “vendido”, “más vendidos”
    consulta.includes("top") ||
    consulta.includes("mas vendidos") ||
    consulta.includes("mejores productos") ||
    consulta.includes("productos populares");

  const buscaIngresos =
    consulta.includes("ingreso") ||
    consulta.includes("ganancia") ||
    consulta.includes("ventas") ||
    consulta.includes("vendimos") ||
    consulta.includes("se vendio") ||
    consulta.includes("vendido");

  const buscaCategoria =
    consulta.includes("categoria") ||
    consulta.includes("categorias") ||
    consulta.includes("por categoria") ||
    consulta.includes("cada categoria");

  const buscaMejor =
    consulta.includes("mejor") ||
    consulta.includes("alto") ||
    consulta.includes("mayor") ||
    consulta.includes("top");

  // ===========================================
  // 2️⃣ CASO: ROTACIÓN MENSUAL / PRODUCTOS MÁS VENDIDOS
  // ===========================================
  if (buscaRotacion || buscaMejor) {
    // Usar productos_con_estadisticas para obtener productos más vendidos
    const { data, error } = await supabase
      .from("productos_con_estadisticas")
      .select("nombre, total_ventas, ingresos_totales")
      .order("total_ventas", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error al consultar rotación:", error);
      return "❌ No se pudo obtener la rotación mensual.";
    }

    if (!data || data.length === 0) {
      return "No hay datos de rotación disponibles aún.";
    }

    const lista = data
      .map(
        (p, i) =>
          `${i + 1}. ${p.nombre} — ${p.total_ventas || 0} und. — $${(
            p.ingresos_totales || 0
          ).toLocaleString()}`
      )
      .join("\n");

    const respuestaBase = `📈 *Top 5 productos con mayor rotación:*\n${lista}`;
    return await mejorarRespuestaConOpenAI(
      respuestaBase,
      "Rol: Agente Analista. Consulta sobre rotación de productos. Top 5 productos más vendidos con sus ingresos."
    );
  }

  // ===========================================
  // 3️⃣ CASO: INGRESOS Y GANANCIAS
  // ===========================================
  if (buscaIngresos) {
    const { data, error } = await supabase
      .from("ventas_con_detalles")
      .select("precio_total, descuento, precio_final");

    if (error) {
      console.error("Error al consultar ventas:", error);
      return "❌ Error al obtener las ventas.";
    }

    if (!data || data.length === 0) {
      return "No se registran ventas en el periodo.";
    }

    // Usar precio_final si existe, sino calcular
    const ingresosTotales = data.reduce(
      (acc, v) =>
        acc + Number(v.precio_final || v.precio_total - (v.descuento || 0)),
      0
    );
    const promedioVenta = ingresosTotales / data.length;

    const respuestaBase = `💰 *Resumen de ventas:*\n- Ventas registradas: ${
      data.length
    }\n- Ingresos totales: $${ingresosTotales.toLocaleString()}\n- Promedio por venta: $${promedioVenta.toFixed(
      2
    )}`;
    return await mejorarRespuestaConOpenAI(
      respuestaBase,
      "Rol: Agente Analista. Consulta sobre ingresos y ventas. Resumen de ventas con totales y promedios."
    );
  }

  // ===========================================
  // 4️⃣ CASO: VENTAS POR CATEGORÍA
  // ===========================================
  if (buscaCategoria) {
    const { data, error } = await supabase
      .from("productos_con_estadisticas")
      .select("categoria, total_ventas, ingresos_totales")
      .order("ingresos_totales", { ascending: false });

    if (error) {
      console.error("Error al consultar categorías:", error);
      return "❌ No se pudieron consultar las ventas por categoría.";
    }

    if (!data || data.length === 0) {
      return "No hay datos de ventas por categoría disponibles.";
    }

    const agrupado = data.reduce((acc, item) => {
      const cat = item.categoria || item.nombre_categoria || "Sin categoría";
      if (!acc[cat]) acc[cat] = { ventas: 0, ingresos: 0 };
      acc[cat].ventas += item.total_ventas || 0;
      acc[cat].ingresos += Number(item.ingresos_totales || 0);
      return acc;
    }, {});

    const resumen = Object.entries(agrupado)
      .map(
        ([cat, val]) =>
          `• ${cat}: ${val.ventas} und. — $${val.ingresos.toLocaleString()}`
      )
      .join("\n");

    const respuestaBase = `📊 *Ventas por categoría:*\n${resumen}`;
    return await mejorarRespuestaConOpenAI(
      respuestaBase,
      "Rol: Agente Analista. Consulta sobre ventas por categoría. Desglose de ventas e ingresos por categoría."
    );
  }

  // ===========================================
  // 5️⃣ CASO GENERAL (cuando no entiende)
  // ===========================================
  const respuestaBase = `No entendí tu consulta analítica.\n💡 Puedes preguntar:\n• "¿Cuáles son los productos más vendidos?"\n• "¿Qué categoría vendió más?"\n• "¿Cuánto se vendió este mes?"\n• "¿Cuál es la rotación promedio?"`;
  return await mejorarRespuestaConOpenAI(
    respuestaBase,
    "Rol: Agente Analista. No entendió la consulta. Ofrecer ayuda sobre qué puede preguntar."
  );
}
