import { useState, useEffect, useRef } from "react";
import { agenteCliente } from "../../Agents/agenteCliente";
import { useAuthContext } from "../../context/AuthContext";
import { productService } from "../../services/productService";
import { storageService } from "../../services/storageService";
import {
  FaComments,
  FaSearch,
  FaChartBar,
  FaLightbulb,
  FaShoppingCart,
  FaUser,
  FaPaperPlane,
  FaSpinner,
  FaRobot,
  
} from "react-icons/fa";

export default function ChatCliente() {
  const { user } = useAuthContext();
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productosMencionados, setProductosMencionados] = useState({});
  const messagesEndRef = useRef(null);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    const mensajeBienvenida = {
      tipo: "asistente",
      contenido: `¡Hola${
        user?.nombre ? ` ${user.nombre}` : ""
      }! 👋\n\nSoy tu asistente virtual inteligente. Estoy aquí para ayudarte con:\n\n✨ Buscar productos disponibles\n📦 Consultar información de productos\n💬 Responder preguntas sobre el catálogo\n🛒 Ayudarte con tus compras\n\n¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
    };
    setMensajes([mensajeBienvenida]);
  }, [user?.nombre]);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviar = async () => {
    if (!pregunta.trim() || loading) return;

    const preguntaUsuario = pregunta.trim();
    setPregunta("");

    // Agregar mensaje del usuario
    const mensajeUsuario = {
      tipo: "usuario",
      contenido: preguntaUsuario,
      timestamp: new Date(),
    };
    setMensajes((prev) => [...prev, mensajeUsuario]);

    setLoading(true);

    try {
      const respuesta = await agenteCliente(preguntaUsuario);

      // Buscar productos mencionados en la respuesta
      const productosEncontrados = await buscarProductosEnTexto(respuesta);
      if (productosEncontrados.length > 0) {
        const productosMap = {};
        productosEncontrados.forEach((producto) => {
          productosMap[producto.id] = producto;
        });
        setProductosMencionados((prev) => ({
          ...prev,
          [mensajes.length]: productosMap,
        }));
      }

      // Agregar respuesta del asistente
      const mensajeAsistente = {
        tipo: "asistente",
        contenido: respuesta,
        timestamp: new Date(),
      };
      setMensajes((prev) => [...prev, mensajeAsistente]);
    } catch (err) {
      console.error("Error al procesar consulta:", err);
      const mensajeError = {
        tipo: "asistente",
        contenido:
          "Lo siento, ocurrió un error al procesar tu consulta. Por favor intenta de nuevo.",
        timestamp: new Date(),
      };
      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header mejorado con gradiente */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
            <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
              <FaRobot className="text-white text-3xl animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <FaRobot className="text-yellow-900 text-xs" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">
              Asistente Virtual IA
            </h2>
            <p className="text-purple-100 text-sm font-medium">
              Tu compañero inteligente siempre disponible
            </p>
          </div>
        </div>
      </div>

      {/* Área de mensajes mejorada */}
      <div
        className="flex-1 rounded-2xl mb-6 bg-gradient-to-b from-gray-50 to-white border-2 border-gray-200 shadow-inner overflow-hidden relative"
        style={{
          minHeight: "450px",
          maxHeight: "650px",
        }}
      >
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIvPjwvZz48L2c+PC9zdmc+')]"></div>

        <div
          className="relative h-full overflow-y-auto p-6 space-y-6 chat-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {mensajes.map((mensaje, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 animate-fadeIn ${
                mensaje.tipo === "usuario" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar del mensaje */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                  mensaje.tipo === "usuario"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
                }`}
              >
                {mensaje.tipo === "usuario" ? (
                  <FaUser className="text-sm" />
                ) : (
                  <FaRobot className="text-sm" />
                )}
              </div>

              {/* Contenedor del mensaje */}
              <div
                className={`flex flex-col max-w-[75%] ${
                  mensaje.tipo === "usuario" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`relative group rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 ${
                    mensaje.tipo === "usuario"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 border-2 border-purple-100 rounded-tl-sm hover:border-purple-200 hover:shadow-xl"
                  }`}
                >
                  {/* Efecto de brillo en hover para mensajes del asistente */}
                  {mensaje.tipo === "asistente" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}

                  <div className="relative whitespace-pre-line leading-relaxed text-[15px]">
                    {mensaje.contenido}
                  </div>

                  {/* Mostrar imágenes de productos mencionados */}
                  {mensaje.tipo === "asistente" &&
                    productosMencionados[index] && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {Object.values(productosMencionados[index]).map(
                          (producto) => {
                            const imageUrl =
                              storageService.getProductImageUrl(producto) ||
                              producto.imagen_url;
                            return (
                              <div
                                key={producto.id}
                                className="group/product border-2 border-purple-200 rounded-xl p-3 bg-gradient-to-br from-white to-purple-50 hover:border-purple-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                style={{ maxWidth: "200px" }}
                              >
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={producto.nombre}
                                    className="w-full rounded-lg mb-2 shadow-md"
                                    style={{
                                      height: "130px",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : null}
                                <div className="text-center">
                                  <p className="text-sm font-bold text-gray-900 mb-1">
                                    {producto.nombre}
                                  </p>
                                  <p className="text-xs font-semibold text-purple-600">
                                    $
                                    {producto.precio?.toLocaleString() || "N/A"}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                </div>

                {/* Timestamp */}
                <span
                  className={`text-xs mt-2 px-2 ${
                    mensaje.tipo === "usuario"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {mensaje.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-4 animate-fadeIn">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <FaRobot className="text-sm" />
              </div>
              <div className="flex flex-col items-start max-w-[75%]">
                <div className="relative bg-white border-2 border-purple-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <FaSpinner className="text-purple-600 animate-spin text-lg" />
                      <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <span className="text-gray-700 font-medium">
                      Pensando...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input de mensaje mejorado */}
      <div className="relative">
        <div className="flex gap-3 items-end bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 hover:border-purple-300 transition-colors">
          <div className="flex-1 relative">
            <input
              type="text"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch className="text-sm" />
            </div>
          </div>
          <button
            onClick={enviar}
            disabled={loading || !pregunta.trim()}
            className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl disabled:hover:shadow-lg overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {loading ? (
              <FaSpinner className="animate-spin relative z-10" />
            ) : (
              <>
                <FaPaperPlane className="relative z-10" />
                <span className="relative z-10">Enviar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Función para buscar productos mencionados en el texto
  async function buscarProductosEnTexto(texto) {
    try {
      // Obtener todos los productos
      const { data: productos, error } = await productService.getAllProducts();

      if (error || !productos) return [];

      // Buscar productos mencionados en el texto
      const productosEncontrados = productos.filter((producto) => {
        if (!producto.nombre) return false;
        const nombreNormalizado = producto.nombre.toLowerCase();
        const textoNormalizado = texto.toLowerCase();
        return textoNormalizado.includes(nombreNormalizado);
      });

      // Limitar a los primeros 5 productos para no sobrecargar
      return productosEncontrados.slice(0, 5);
    } catch (error) {
      console.error("Error al buscar productos:", error);
      return [];
    }
  }
}
