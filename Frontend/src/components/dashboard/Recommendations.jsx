// Componente de recomendaciones automáticas
import { useState, useEffect } from "react";
import { recommendationsService } from "../../services/recommendationsService";
import { toastService } from "../../utils/toastService";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await recommendationsService.getRecommendations();

      if (error) {
        console.error("Error al cargar recomendaciones:", error);
        return;
      }

      setRecommendations(data || []);
    } catch (error) {
      console.error("Error al cargar recomendaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const { error } = await recommendationsService.markAsRead(id);
      if (!error) {
        // Actualizar estado local
        setRecommendations((prev) =>
          prev.map((rec) => (rec.id === id ? { ...rec, leida: true } : rec))
        );
      }
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const handleMarkAsResolved = async (id) => {
    try {
      const { error } = await recommendationsService.markAsResolved(id);
      if (!error) {
        // Eliminar de la lista
        setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
      }
    } catch (error) {
      console.error("Error al resolver:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl text-2xl">
              💡
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Recomendaciones Automáticas
              </h3>
              <p className="text-sm text-gray-500">
                Cargando recomendaciones...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl text-2xl">
              💡
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Recomendaciones Automáticas
              </h3>
              <p className="text-sm text-gray-500">
                No hay recomendaciones en este momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "danger";
      case "media":
        return "warning";
      default:
        return "info";
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case "descuento":
        return "💰";
      case "reposicion":
        return "📦";
      case "revision":
        return "🔍";
      case "promocion":
        return "📢";
      default:
        return "💡";
    }
  };

  const getPriorityBadgeColor = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "media":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl text-2xl">
              💡
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Recomendaciones Automáticas
              </h3>
              <p className="text-sm text-gray-500">
                Sugerencias basadas en el análisis de tus datos
              </p>
            </div>
          </div>
          <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`bg-gray-50 rounded-lg p-4 border-l-4 transition-all duration-200 hover:shadow-md ${
                rec.prioridad === "alta"
                  ? "border-red-500"
                  : rec.prioridad === "media"
                  ? "border-amber-500"
                  : "border-blue-500"
              } ${rec.leida ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="text-2xl mt-1">
                      {getIcon(rec.tipo_recomendacion)}
                    </div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-gray-900 mb-1">
                        {rec.mensaje}
                      </h6>
                      {rec.productos && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Producto:</span>{" "}
                          {rec.productos.nombre || rec.productos.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBadgeColor(
                        rec.prioridad
                      )}`}
                    >
                      {rec.prioridad === "alta"
                        ? "Alta Prioridad"
                        : rec.prioridad === "media"
                        ? "Media Prioridad"
                        : "Baja Prioridad"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {!rec.leida && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 whitespace-nowrap"
                      onClick={() => handleMarkAsRead(rec.id)}
                    >
                      Marcar leída
                    </button>
                  )}
                  {!rec.resuelta && (
                    <button
                      className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors duration-200 whitespace-nowrap"
                      onClick={() => handleMarkAsResolved(rec.id)}
                    >
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
