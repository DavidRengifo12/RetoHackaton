// Componente de tarjeta KPI mejorado
const KPICard = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  trend = null,
}) => {
  const colorConfig = {
    primary: {
      bg: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
      iconBg: "bg-gradient-to-br from-blue-100 to-blue-200",
      iconColor: "text-blue-700",
      border: "border-blue-200",
      glow: "shadow-blue-200",
    },
    success: {
      bg: "bg-gradient-to-br from-green-500 via-green-600 to-emerald-600",
      iconBg: "bg-gradient-to-br from-green-100 to-green-200",
      iconColor: "text-green-700",
      border: "border-green-200",
      glow: "shadow-green-200",
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600",
      iconBg: "bg-gradient-to-br from-amber-100 to-amber-200",
      iconColor: "text-amber-700",
      border: "border-amber-200",
      glow: "shadow-amber-200",
    },
    danger: {
      bg: "bg-gradient-to-br from-red-500 via-red-600 to-rose-600",
      iconBg: "bg-gradient-to-br from-red-100 to-red-200",
      iconColor: "text-red-700",
      border: "border-red-200",
      glow: "shadow-red-200",
    },
    info: {
      bg: "bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600",
      iconBg: "bg-gradient-to-br from-cyan-100 to-cyan-200",
      iconColor: "text-cyan-700",
      border: "border-cyan-200",
      glow: "shadow-cyan-200",
    },
  };

  const config = colorConfig[color] || colorConfig.primary;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group relative">
      {/* Efecto de brillo en hover */}
      <div
        className={`absolute inset-0 ${config.glow} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`}
      ></div>

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              {title}
            </p>
            <h3 className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">
              {value}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mb-3 font-medium">
                {subtitle}
              </p>
            )}
            {trend !== null && trend !== undefined && (
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`text-sm font-bold flex items-center gap-1 px-2 py-1 rounded-lg ${
                    trend > 0
                      ? "text-green-700 bg-green-50 border border-green-200"
                      : "text-red-700 bg-red-50 border border-red-200"
                  }`}
                >
                  {trend > 0 ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  )}
                  {Math.abs(trend).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  vs. mes anterior
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div
              className={`${config.iconBg} ${config.iconColor} p-4 rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
      <div
        className={`h-2 ${config.bg} group-hover:h-3 transition-all duration-300 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default KPICard;
