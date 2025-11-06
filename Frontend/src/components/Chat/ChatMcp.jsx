import { useState, useRef, useEffect } from "react";
import { MCPManager } from "../../mcp/mcpManager";
import {
  FaHandshake,
  FaSpinner,
  FaPaperPlane,
  FaSearch,
  FaNetworkWired,
} from "react-icons/fa";

export default function ChatMCP() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historial, respuesta]);

  const consultar = async () => {
    if (!pregunta.trim() || loading) return;

    const preguntaActual = pregunta.trim();
    setPregunta("");

    // Agregar pregunta al historial
    const nuevaPregunta = {
      tipo: "usuario",
      contenido: preguntaActual,
      timestamp: new Date(),
    };
    setHistorial((prev) => [...prev, nuevaPregunta]);

    setLoading(true);
    try {
      const r = await MCPManager(preguntaActual);
      setRespuesta(r);

      // Agregar respuesta al historial
      const nuevaRespuesta = {
        tipo: "asistente",
        contenido: r,
        timestamp: new Date(),
      };
      setHistorial((prev) => [...prev, nuevaRespuesta]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = {
        tipo: "asistente",
        contenido:
          "Lo siento, ocurrió un error al procesar. Por favor intenta de nuevo.",
        timestamp: new Date(),
      };
      setHistorial((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      consultar();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header mejorado */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
            <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
              <FaHandshake className="text-white text-3xl animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <FaNetworkWired className="text-yellow-900 text-xs" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">
              MCP Manager IA
            </h2>
            <p className="text-green-100 text-sm font-medium">
              Coordinación inteligente entre múltiples agentes
            </p>
          </div>
        </div>
      </div>

      {/* Área de conversación */}
      {historial.length > 0 && (
        <div
          className="flex-1 rounded-2xl mb-6 bg-gradient-to-b from-gray-50 to-white border-2 border-gray-200 shadow-inner overflow-hidden relative"
          style={{
            minHeight: "400px",
            maxHeight: "550px",
          }}
        >
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIvPjwvZz48L2c+PC9zdmc+')]"></div>

          <div className="relative h-full overflow-y-auto p-6 space-y-6 chat-scrollbar">
            {historial.map((mensaje, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 animate-fadeIn ${
                  mensaje.tipo === "usuario" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    mensaje.tipo === "usuario"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                  }`}
                >
                  {mensaje.tipo === "usuario" ? (
                    <FaSearch className="text-sm" />
                  ) : (
                    <FaHandshake className="text-sm" />
                  )}
                </div>

                <div
                  className={`flex flex-col max-w-[75%] ${
                    mensaje.tipo === "usuario" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`relative group rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 ${
                      mensaje.tipo === "usuario"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border-2 border-green-100 rounded-tl-sm hover:border-green-200 hover:shadow-xl"
                    }`}
                  >
                    {mensaje.tipo === "asistente" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}

                    <div className="relative whitespace-pre-line leading-relaxed text-[15px]">
                      {mensaje.contenido}
                    </div>
                  </div>

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
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg">
                  <FaHandshake className="text-sm" />
                </div>
                <div className="flex flex-col items-start max-w-[75%]">
                  <div className="relative bg-white border-2 border-green-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FaSpinner className="text-green-600 animate-spin text-lg" />
                        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <span className="text-gray-700 font-medium">
                        Coordinando agentes...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input mejorado */}
      <div className="relative">
        <div className="flex gap-3 items-end bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 hover:border-green-300 transition-colors">
          <div className="flex-1 relative">
            <input
              type="text"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ej: ¿Qué productos con stock bajo tuvieron buena rotación?"
              className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch className="text-sm" />
            </div>
          </div>
          <button
            onClick={consultar}
            disabled={loading || !pregunta.trim()}
            className="relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl disabled:hover:shadow-lg overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {loading ? (
              <FaSpinner className="animate-spin relative z-10" />
            ) : (
              <>
                <FaPaperPlane className="relative z-10" />
                <span className="relative z-10">Consultar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
