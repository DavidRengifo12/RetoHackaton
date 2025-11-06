import { useState } from "react"
import { MCPManager } from "../../mcp/mcpManager"

export default function ChatMCP() {
  const [pregunta, setPregunta] = useState("")
  const [respuesta, setRespuesta] = useState("")
  const [loading, setLoading] = useState(false)

  const consultar = async () => {
    if (!pregunta.trim()) return
    setLoading(true)
    const r = await MCPManager(pregunta)
    setRespuesta(r)
    setLoading(false)
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🤝 MCP Chat (Agent-to-Agent)</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ej: ¿Qué productos con stock bajo tuvieron buena rotación?"
          className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={consultar}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Pensando..." : "Preguntar"}
        </button>
      </div>
      {respuesta && (
        <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-line text-gray-800">
          {respuesta}
        </div>
      )}
    </div>
  )
}
