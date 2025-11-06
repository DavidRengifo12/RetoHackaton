import { useState } from "react"
import { agenteAnalista } from "../../Agents/agenteAnalista"

export default function ChatAnalista() {
  const [pregunta, setPregunta] = useState("")
  const [respuesta, setRespuesta] = useState("")
  const [loading, setLoading] = useState(false)

  const consultar = async () => {
    if (!pregunta.trim()) return
    setLoading(true)
    const r = await agenteAnalista(pregunta)
    setRespuesta(r)
    setLoading(false)
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Agente Analista</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ej: ¿Cuáles son los productos más vendidos?"
          className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={consultar}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Analizando..." : "Analizar"}
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
