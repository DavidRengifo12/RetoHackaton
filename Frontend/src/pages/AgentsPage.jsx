import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import ChatInventario from "../components/Chat/ChatInventario";
import ChatAnalista from "../components/Chat/ChatAnalista";
import ChatMCP from "../components/Chat/ChatMcp";
import ChatCliente from "../components/Chat/ChatCliente";
import { FaRobot } from "react-icons/fa";

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
      icon: "🧠",
      nombre: "Agente de Inventario",
      descripcion: "Consulta productos, stock, tallas y precios",
      color: "blue",
      componente: <ChatInventario />,
    },
    analista: {
      icon: "📊",
      nombre: "Agente Analista",
      descripcion: "Analiza ventas, rotación y rendimiento de productos",
      color: "indigo",
      componente: <ChatAnalista />,
    },
    mcp: {
      icon: "🤝",
      nombre: "MCP Manager (Agent-to-Agent)",
      descripcion: "Coordina múltiples agentes para consultas complejas",
      color: "green",
      componente: <ChatMCP />,
    },
    cliente: {
      icon: "💬",
      nombre: "Agente Cliente",
      descripcion: "Asistente principal que enruta consultas inteligentemente",
      color: "purple",
      componente: <ChatCliente />,
    },
  };

  const agentesUsuario = {
    cliente: {
      icon: "💬",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center">
              <FaRobot className="mr-3" />
              Sistema de Agentes Inteligentes
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Sistema multi-agente con coordinación inteligente y respuestas
              naturales
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        {agenteActivo === "overview" && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-1"
            } gap-6 mb-8`}
          >
            {Object.entries(agentes).map(([key, agente]) => (
              <div
                key={key}
                onClick={() => setAgenteActivo(key)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  agente.color === "blue"
                    ? "hover:border-blue-500"
                    : agente.color === "indigo"
                    ? "hover:border-indigo-500"
                    : agente.color === "green"
                    ? "hover:border-green-500"
                    : "hover:border-purple-500"
                }`}
              >
                <div className="text-5xl mb-4 text-center">{agente.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {agente.nombre}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {agente.descripcion}
                </p>
                <button
                  className={`w-full text-white py-2 px-4 rounded-lg font-semibold transition-colors ${
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
            ))}
          </div>
        )}

        {/* Agente Activo */}
        {agenteActivo !== "overview" && (
          <div className="mb-6">
            <button
              onClick={() => setAgenteActivo("overview")}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="mr-2">←</span> Volver a Overview
            </button>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">
                  {agentes[agenteActivo]?.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {agentes[agenteActivo]?.nombre}
                  </h2>
                  <p className="text-gray-600">
                    {agentes[agenteActivo]?.descripcion}
                  </p>
                </div>
              </div>
              {agentes[agenteActivo]?.componente}
            </div>
          </div>
        )}

        {/* Información del Sistema - Solo para administradores */}
        {agenteActivo === "overview" && isAdmin && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📋 Arquitectura del Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  🎯 Roles de Agentes
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <strong className="text-blue-600">🧠 Inventario:</strong>{" "}
                    Consultas sobre productos, stock, tallas y disponibilidad
                  </li>
                  <li>
                    <strong className="text-indigo-600">📊 Analista:</strong>{" "}
                    Análisis de ventas, rotación y rendimiento
                  </li>
                  <li>
                    <strong className="text-green-600">🤝 MCP:</strong>{" "}
                    Coordinación entre múltiples agentes
                  </li>
                  <li>
                    <strong className="text-purple-600">💬 Cliente:</strong>{" "}
                    Punto de entrada principal que enruta consultas
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  ✨ Características
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✅ Respuestas mejoradas con OpenAI</li>
                  <li>✅ Coordinación Agent-to-Agent</li>
                  <li>✅ Alertas automáticas a n8n</li>
                  <li>✅ Búsqueda inteligente por palabras clave</li>
                  <li>✅ Análisis de rotación y ventas</li>
                  <li>✅ Detección automática de stock bajo</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Información para usuarios */}
        {agenteActivo === "overview" && !isAdmin && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💬 Tu Asistente Virtual
            </h2>
            <div className="text-gray-600">
              <p className="mb-4">
                Tu asistente virtual está aquí para ayudarte con todas tus
                consultas sobre productos, disponibilidad, precios y más.
              </p>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                ✨ ¿Qué puedes hacer?
              </h3>
              <ul className="space-y-2">
                <li>✅ Buscar productos disponibles</li>
                <li>✅ Consultar información de productos</li>
                <li>✅ Obtener ayuda con tus compras</li>
                <li>✅ Resolver dudas sobre el catálogo</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
