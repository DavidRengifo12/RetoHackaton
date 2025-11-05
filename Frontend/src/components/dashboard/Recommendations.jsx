// Componente de recomendaciones automáticas
import { useState, useEffect } from 'react';
import { recommendationsService } from '../../services/recommendationsService';
import { toastService } from '../../utils/toastService';

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
        console.error('Error al cargar recomendaciones:', error);
        return;
      }

      setRecommendations(data || []);
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const { error } = await recommendationsService.markAsRead(id);
      if (!error) {
        // Actualizar estado local
        setRecommendations(prev => 
          prev.map(rec => rec.id === id ? { ...rec, leida: true } : rec)
        );
      }
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleMarkAsResolved = async (id) => {
    try {
      const { error } = await recommendationsService.markAsResolved(id);
      if (!error) {
        // Eliminar de la lista
        setRecommendations(prev => prev.filter(rec => rec.id !== id));
      }
    } catch (error) {
      console.error('Error al resolver:', error);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">💡 Recomendaciones</h5>
          <p className="text-muted">Cargando recomendaciones...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">💡 Recomendaciones</h5>
          <p className="text-muted">No hay recomendaciones en este momento.</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'danger';
      case 'media':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'descuento':
        return '💰';
      case 'reposicion':
        return '📦';
      case 'revision':
        return '🔍';
      case 'promocion':
        return '📢';
      default:
        return '💡';
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">💡 Recomendaciones Automáticas</h5>
        <div className="list-group">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`list-group-item list-group-item-action border-start border-${getPriorityColor(rec.prioridad)} border-3 ${rec.leida ? 'opacity-75' : ''}`}
            >
              <div className="d-flex w-100 justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1">
                    {getIcon(rec.tipo_recomendacion)} {rec.mensaje}
                  </h6>
                  {rec.productos && (
                    <small className="text-muted">
                      Producto: {rec.productos.nombre || rec.productos.name}
                    </small>
                  )}
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <span className={`badge bg-${getPriorityColor(rec.prioridad)}`}>
                    {rec.prioridad === 'alta' ? 'Alta' : rec.prioridad === 'media' ? 'Media' : 'Baja'}
                  </span>
                  {!rec.leida && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleMarkAsRead(rec.id)}
                    >
                      Marcar leída
                    </button>
                  )}
                  {!rec.resuelta && (
                    <button
                      className="btn btn-sm btn-outline-success"
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
