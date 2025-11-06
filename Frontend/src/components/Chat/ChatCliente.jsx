import { useState, useEffect, useRef } from "react";
import { agenteCliente } from "../../Agents/agenteCliente";
import { useAuthContext } from "../../context/AuthContext";

export default function ChatCliente() {
  const { user } = useAuthContext();
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    const mensajeBienvenida = {
      tipo: "asistente",
      contenido: `¡Hola${
        user?.nombre ? ` ${user.nombre}` : ""
      }! 👋\n\nSoy tu asistente virtual. Estoy aquí para ayudarte con:\n\n• 🔍 Buscar productos disponibles\n• 📊 Consultar información de productos\n• 💡 Responder preguntas sobre el catálogo\n• 🛒 Ayudarte con tus compras\n\n¿En qué puedo ayudarte hoy?`,
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

      // Agregar respuesta del asistente
      const mensajeAsistente = {
        tipo: "asistente",
        contenido: respuesta,
        timestamp: new Date(),
      };
      setMensajes((prev) => [...prev, mensajeAsistente]);
    } catch (error) {
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
    <div className="d-flex flex-column h-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        💬 Asistente Virtual
      </h2>

      {/* Área de mensajes */}
      <div
        className="flex-grow-1 border rounded-lg p-3 mb-3"
        style={{
          minHeight: "400px",
          maxHeight: "500px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        {mensajes.map((mensaje, index) => (
          <div
            key={index}
            className={`mb-3 ${
              mensaje.tipo === "usuario" ? "text-end" : "text-start"
            }`}
          >
            <div
              className={`d-inline-block p-3 rounded-lg ${
                mensaje.tipo === "usuario"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800 border"
              }`}
              style={{ maxWidth: "80%" }}
            >
              <div className="whitespace-pre-line">{mensaje.contenido}</div>
              <small
                className={`d-block mt-1 ${
                  mensaje.tipo === "usuario" ? "text-white-50" : "text-muted"
                }`}
                style={{ fontSize: "0.75rem" }}
              >
                {mensaje.timestamp.toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-start mb-3">
            <div className="d-inline-block bg-white p-3 rounded-lg border">
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <span>Pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className="d-flex gap-2">
        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu pregunta aquí..."
          className="form-control"
          disabled={loading}
        />
        <button
          onClick={enviar}
          disabled={loading || !pregunta.trim()}
          className="btn btn-primary"
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </div>
  );
}
