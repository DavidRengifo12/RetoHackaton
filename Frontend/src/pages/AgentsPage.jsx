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
      color: "blue",
      componente: <ChatInventario />,
    },
    analista: {
      icon: FaChartLine,
      nombre: "Agente Analista",
      descripcion: "Analiza ventas, rotación y rendimiento de productos",
      color: "indigo",
      componente: <ChatAnalista />,
    },
    mcp: {
      icon: FaHandshake,
      nombre: "MCP Manager (Agent-to-Agent)",
      descripcion: "Coordina múltiples agentes para consultas complejas",
      color: "green",
      componente: <ChatMCP />,
    },
    cliente: {
      icon: FaComments,
      nombre: "Agente Cliente",
      descripcion: "Asistente principal que enruta consultas inteligentemente",
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FaRobot className="text-4xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Sistema de Agentes Inteligentes
              </h1>
            </div>
            <p className="text-blue-100 text-xl max-w-3xl mx-auto">
              Sistema multi-agente con coordinación inteligente y respuestas
              naturales
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        {agenteActivo === "overview" && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-1"
            } gap-6 mb-8`}
          >
            {Object.entries(agentes).map(([key, agente]) => {
              const IconComponent = agente.icon;
              return (
                <div
                  key={key}
                  onClick={() => setAgenteActivo(key)}
                  className={`bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                    agente.color === "blue"
                      ? "hover:border-blue-500 border-blue-100"
                      : agente.color === "indigo"
                      ? "hover:border-indigo-500 border-indigo-100"
                      : agente.color === "green"
                      ? "hover:border-green-500 border-green-100"
                      : "hover:border-purple-500 border-purple-100"
                  }`}
                >
                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                        agente.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : agente.color === "indigo"
                          ? "bg-indigo-100 text-indigo-600"
                          : agente.color === "green"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <IconComponent className="text-4xl" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {agente.nombre}
                  </h3>
                  <p className="text-gray-600 text-center mb-6 min-h-[3rem]">
                    {agente.descripcion}
                  </p>
                  <button
                    className={`w-full text-white py-3 px-4 rounded-lg font-semibold transition-all active:scale-95 ${
                      agente.color === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : agente.color === "indigo"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : agente.color === "green"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    Usar Agente
                  </button>
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
              Volver a Overview
            </button>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                {agentes[agenteActivo] && (
                  <>
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        agentes[agenteActivo].color === "blue"
                          ? "bg-blue-100 text-blue-600"
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
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {agentes[agenteActivo].nombre}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {agentes[agenteActivo].descripcion}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {agentes[agenteActivo]?.componente}
            </div>
          </div>
        )}

        {/* Información del Sistema - Solo para administradores */}
        {agenteActivo === "overview" && isAdmin && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FaInfoCircle className="text-blue-600 text-2xl" />
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
                    <FaBox className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-600">Inventario:</strong>{" "}
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
                      <strong className="text-green-600">MCP:</strong>{" "}
                      Coordinación entre múltiples agentes
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaComments className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-purple-600">Cliente:</strong>{" "}
                      Punto de entrada principal que enruta consultas
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
                    <span>Coordinación Agent-to-Agent</span>
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
                  <FaSearch className="text-blue-600 mt-1 flex-shrink-0" />
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
