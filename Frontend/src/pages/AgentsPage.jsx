import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import ChatInventario from "../components/Chat/ChatInventario";
import ChatAnalista from "../components/Chat/ChatAnalista";
import ChatMCP from "../components/Chat/ChatMcp";
import ChatCliente from "../components/Chat/ChatCliente";
import {
  FaRobot,
  FaComments,
  FaBox,
  FaChartLine,
  FaCheckCircle,
  FaSearch,
  FaShoppingCart,
  FaInfoCircle,
  FaArrowLeft,
  FaHandshake,
} from "react-icons/fa";

/**
 * 🎯 Página de Presentación de Agentes
 * Organiza todos los agentes por rol con presentación bonita
 * - Usuarios: Solo ven Agente Cliente
 * - Administradores: Ven todos los agentes
 */
export default function AgentsPage() {
  const { isAdmin } = useAuthContext();
  const [agenteActivo, setAgenteActivo] = useState("overview");

  // Agentes disponibles según el rol
  const agentesAdmin = {
    inventario: {
      icon: FaBox,
      nombre: "Agente de Inventario",
      descripcion: "Consulta productos, stock, tallas y precios",
      descripcionLarga:
        "Este agente te ayuda a consultar información detallada sobre productos, verificar el stock disponible, revisar tallas y precios. Puedes preguntarle sobre disponibilidad de productos, buscar por categoría, género o talla, y obtener información completa del inventario.",
      ejemplos: [
        "¿Qué productos tenemos en stock?",
        "¿Cuántas camisetas talla M tenemos?",
        "Muéstrame todos los productos de la categoría Ropa",
        "¿Qué precio tiene el producto X?",
      ],
      color: "blue",
      componente: <ChatInventario />,
    },
    analista: {
      icon: FaChartLine,
      nombre: "Agente Analista",
      descripcion: "Analiza ventas, rotación y rendimiento de productos",
      descripcionLarga:
        "Este agente analiza las ventas, calcula la rotación de productos, identifica los más vendidos y genera reportes de rendimiento. Te ayuda a tomar decisiones informadas sobre qué productos están funcionando mejor y cuáles necesitan atención.",
      ejemplos: [
        "¿Cuáles son los productos más vendidos?",
        "Muéstrame el análisis de rotación de productos",
        "¿Qué productos tienen mejor rendimiento?",
        "Dame un reporte de ventas del último mes",
      ],
      color: "indigo",
      componente: <ChatAnalista />,
    },
    mcp: {
      icon: FaHandshake,
      nombre: "Agente Coordinador",
      descripcion: "Coordina múltiples agentes para consultas complejas",
      descripcionLarga:
        "Este agente coordina y combina información de varios agentes especializados para responder consultas complejas que requieren análisis de inventario y ventas simultáneamente. Es ideal cuando necesitas una respuesta completa que combine datos de productos y análisis de rendimiento.",
      ejemplos: [
        "¿Qué productos tenemos con bajo stock y cómo están vendiendo?",
        "Dame un análisis completo de inventario y ventas",
        "¿Cuáles productos necesitan reposición y cuál es su rendimiento?",
      ],
      color: "green",
      componente: <ChatMCP />,
    },
    cliente: {
      icon: FaComments,
      nombre: "Agente Asistente",
      descripcion: "Asistente principal que enruta consultas inteligentemente",
      descripcionLarga:
        "Este es tu asistente principal que entiende tu pregunta y la dirige al agente especializado más adecuado. Puede ayudarte con consultas generales sobre productos, compras, disponibilidad y más. Es el punto de entrada ideal para cualquier consulta.",
      ejemplos: [
        "¿Qué productos tienen disponibles?",
        "Quiero comprar una camiseta",
        "Ayúdame a encontrar productos",
        "¿Cuánto cuesta el producto X?",
      ],
      color: "purple",
      componente: <ChatCliente />,
    },
  };

  const agentesUsuario = {
    cliente: {
      icon: FaComments,
      nombre: "Asistente Virtual",
      descripcion:
        "Tu asistente personal para consultas sobre productos y compras",
      color: "purple",
      componente: <ChatCliente />,
    },
  };

  // Seleccionar agentes según el rol
  const agentes = isAdmin ? agentesAdmin : agentesUsuario;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)",
      }}
    >
      {/* Header Moderno Mejorado */}
      <div
        className="text-white shadow-xl position-relative overflow-hidden"
        style={{
          background: "linear-gradient(to right, #2563eb, #4f46e5, #9333ea)",
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{
            top: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        ></div>
        <div
          className="container-fluid px-4 py-4 position-relative"
          style={{ zIndex: 10 }}
        >
          <div className="text-center">
            <div
              className="d-flex align-items-center justify-content-center mb-4"
              style={{ gap: "1rem" }}
            >
              <div
                className="rounded-3 shadow-lg d-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FaRobot
                  className="text-white"
                  style={{ fontSize: "2.5rem" }}
                />
              </div>
              <h1 className="text-4xl fw-bold mb-0">
                Sistema de Agentes Inteligentes
              </h1>
            </div>
            <p
              className="text-lg mb-0"
              style={{ color: "#bfdbfe", maxWidth: "800px", margin: "0 auto" }}
            >
              Sistema multi-agente con coordinación inteligente y respuestas
              naturales
            </p>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        {/* Overview Cards */}
        {agenteActivo === "overview" && (
          <div className="row g-4 mb-4">
            {Object.entries(agentes).map(([key, agente]) => {
              const IconComponent = agente.icon;
              const colorClasses = {
                blue: {
                  bg: "bg-[#E8F5E8]",
                  text: "text-[#002f19]",
                  border: "border-[#002f19]/30",
                  hoverBorder: "border-[#002f19]",
                  button: "bg-[#002f19] hover:bg-[#001a0e]",
                },
                indigo: {
                  bg: "bg-indigo-100",
                  text: "text-indigo-600",
                  border: "border-indigo-200",
                  hoverBorder: "border-indigo-500",
                  button: "bg-indigo-600 hover:bg-indigo-700",
                },
                green: {
                  bg: "bg-green-100",
                  text: "text-green-600",
                  border: "border-green-200",
                  hoverBorder: "border-green-500",
                  button: "bg-green-600 hover:bg-green-700",
                },
                purple: {
                  bg: "bg-purple-100",
                  text: "text-purple-600",
                  border: "border-purple-200",
                  hoverBorder: "border-purple-500",
                  button: "bg-purple-600 hover:bg-purple-700",
                },
              };
              const colors = colorClasses[agente.color] || colorClasses.blue;

              return (
                <div
                  key={key}
                  className={`col-12 ${
                    isAdmin ? "col-md-6 col-lg-3" : "col-md-6 col-lg-4"
                  }`}
                >
                  <div
                    onClick={() => setAgenteActivo(key)}
                    className={`bg-white rounded-3 shadow-lg p-4 cursor-pointer border-2 ${colors.border} hover:shadow-xl transition-all ${colors.hoverBorder}`}
                    style={{
                      minHeight: "320px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div className="d-flex justify-content-center mb-4">
                      <div
                        className={`rounded-3 d-flex align-items-center justify-content-center ${colors.bg} ${colors.text}`}
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <IconComponent style={{ fontSize: "2.5rem" }} />
                      </div>
                    </div>
                    <h3 className="text-xl fw-bold text-dark mb-3 text-center">
                      {agente.nombre}
                    </h3>
                    <p
                      className="text-muted text-center mb-4 flex-grow-1"
                      style={{ minHeight: "3rem" }}
                    >
                      {agente.descripcion}
                    </p>
                    <button
                      className={`w-100 text-white py-3 px-4 rounded-3 fw-semibold transition-all ${colors.button}`}
                      style={{ cursor: "pointer" }}
                    >
                      Usar Agente
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Agente Activo */}
        {agenteActivo !== "overview" && (
          <div className="mb-6">
            <button
              onClick={() => setAgenteActivo("overview")}
              className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              <FaArrowLeft />
              Volver a Agentes
            </button>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header del Agente */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-md ${
                      agentes[agenteActivo].color === "blue"
                        ? "bg-[#E8F5E8] text-[#002f19]"
                        : agentes[agenteActivo].color === "indigo"
                        ? "bg-indigo-100 text-indigo-600"
                        : agentes[agenteActivo].color === "green"
                        ? "bg-green-100 text-green-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {(() => {
                      const IconComponent = agentes[agenteActivo].icon;
                      return <IconComponent className="text-3xl" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                      {agentes[agenteActivo].nombre}
                    </h2>
                    <p className="text-gray-600 text-lg">
                      {agentes[agenteActivo].descripcion}
                    </p>
                  </div>
                </div>

                {/* Descripción detallada */}
                {agentes[agenteActivo].descripcionLarga && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3 mb-3">
                      <FaInfoCircle className="text-[#002f19] mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          ¿Para qué sirve este agente?
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {agentes[agenteActivo].descripcionLarga}
                        </p>
                      </div>
                    </div>

                    {/* Ejemplos de uso */}
                    {agentes[agenteActivo].ejemplos && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FaSearch className="text-gray-500" />
                          Ejemplos de preguntas que puedes hacer:
                        </h4>
                        <ul className="space-y-2">
                          {agentes[agenteActivo].ejemplos.map(
                            (ejemplo, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-gray-700"
                              >
                                <span className="text-[#002f19] mt-1">•</span>
                                <span className="flex-1">{ejemplo}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Componente del Chat */}
              <div className="p-6">{agentes[agenteActivo]?.componente}</div>
            </div>
          </div>
        )}

        {/* Información del Sistema - Solo para administradores */}
        {agenteActivo === "overview" && isAdmin && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FaInfoCircle className="text-[#002f19] text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">
                Arquitectura del Sistema
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaRobot className="text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Roles de Agentes
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <FaBox className="text-[#002f19] mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-[#002f19]">Inventario:</strong>{" "}
                      Consultas sobre productos, stock, tallas y disponibilidad
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaChartLine className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-indigo-600">Analista:</strong>{" "}
                      Análisis de ventas, rotación y rendimiento
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaHandshake className="text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-green-600">Coordinador:</strong>{" "}
                      Combina información de múltiples agentes para consultas
                      complejas
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaComments className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-purple-600">Asistente:</strong>{" "}
                      Punto de entrada principal que enruta consultas
                      inteligentemente
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaCheckCircle className="text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Características
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Respuestas mejoradas con OpenAI</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>
                      Coordinación entre múltiples agentes especializados
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Alertas automáticas a n8n</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Búsqueda inteligente por palabras clave</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Análisis de rotación y ventas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>Detección automática de stock bajo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Información para usuarios */}
        {agenteActivo === "overview" && !isAdmin && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8 mt-8 border border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
                <FaComments className="text-white text-3xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Tu Asistente Virtual
                </h2>
                <p className="text-gray-600 mt-1">
                  Tu asistente personal está listo para ayudarte
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Tu asistente virtual está aquí para ayudarte con todas tus
                consultas sobre productos, disponibilidad, precios y más.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaCheckCircle className="text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  ¿Qué puedes hacer?
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <FaSearch className="text-[#002f19] mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Buscar productos</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Encuentra productos disponibles en nuestro catálogo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <FaInfoCircle className="text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">
                      Consultar información
                    </strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Obtén detalles completos de cualquier producto
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <FaShoppingCart className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Ayuda con compras</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Recibe asistencia durante tu proceso de compra
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <FaComments className="text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Resolver dudas</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Responde todas tus preguntas sobre el catálogo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
