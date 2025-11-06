import { useState } from "react"
import { agenteCliente } from "../../Agents/agenteCliente"

export default function ChatCliente() {
  const [pregunta, setPregunta] = useState("")
  const [respuesta, setRespuesta] = useState("")
  const [loading, setLoading] = useState(false)

  const enviar = async () => {
    if (!pregunta.trim()) return
    setLoading(true)
    const r = await agenteCliente(pregunta)
    setRespuesta(r)
    setLoading(false)
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Asistente Virtual del Sistema</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ej: ¿Tienen camisas mujer M? o ¿Cuánto se vendió este mes?"
          className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={enviar}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
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
