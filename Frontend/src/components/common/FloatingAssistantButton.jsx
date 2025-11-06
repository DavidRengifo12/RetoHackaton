// Botón flotante del asistente IA
import { useNavigate, useLocation } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";

const FloatingAssistantButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();

  // No mostrar si no está autenticado o si ya está en la página de agentes
  if (!isAuthenticated || location.pathname === "/agents") {
    return null;
  }

  const handleClick = () => {
    navigate("/agents");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 w-20 h-20 bg-gradient-to-br from-[#002f19] via-[#004529] to-[#001a0e] text-white rounded-2xl shadow-2xl hover:shadow-[#002f19]/50 transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center group overflow-hidden"
      aria-label="Abrir asistente IA"
      title="Asistente IA"
    >
      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

      {/* Efecto de pulso animado */}
      <span className="absolute inset-0 rounded-2xl bg-purple-400 animate-ping opacity-20 group-hover:opacity-40"></span>

      {/* Efecto de ondas */}
      <span className="absolute inset-0 rounded-2xl bg-indigo-400 animate-pulse opacity-10"></span>

      {/* Icono principal */}
      <div className="relative z-10 flex flex-col items-center">
        <FaRobot className="text-3xl group-hover:animate-bounce mb-1" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <FaRobot className="text-yellow-900 text-[8px]" />
        </div>
      </div>

      {/* Tooltip mejorado */}
      <div className="absolute right-full mr-6 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border-2 border-purple-500/30">
        <div className="flex items-center gap-2">
          <FaRobot className="text-purple-400" />
          <span>Asistente IA</span>
        </div>
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900"></div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full opacity-60 animate-ping"
          style={{ animationDelay: "0s", animationDuration: "2s" }}
        ></div>
        <div
          className="absolute bottom-2 right-2 w-1 h-1 bg-white rounded-full opacity-60 animate-ping"
          style={{ animationDelay: "1s", animationDuration: "2s" }}
        ></div>
      </div>
    </button>
  );
};

export default FloatingAssistantButton;
