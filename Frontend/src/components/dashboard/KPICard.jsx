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
      bg: "#002f19",
      iconBg: "#e8f5e8",
      iconColor: "#002f19",
      border: "#002f19",
      glow: "rgba(0, 47, 25, 0.3)",
    },
    success: {
      bg: "#002f19",
      iconBg: "#e8f5e8",
      iconColor: "#002f19",
      border: "#002f19",
      glow: "rgba(0, 47, 25, 0.3)",
    },
    warning: {
      bg: "#002f19",
      iconBg: "#e8f5e8",
      iconColor: "#002f19",
      border: "#002f19",
      glow: "rgba(0, 47, 25, 0.3)",
    },
    danger: {
      bg: "#002f19",
      iconBg: "#e8f5e8",
      iconColor: "#002f19",
      border: "#002f19",
      glow: "rgba(0, 47, 25, 0.3)",
    },
    info: {
      bg: "#002f19",
      iconBg: "#e8f5e8",
      iconColor: "#002f19",
      border: "#002f19",
      glow: "rgba(0, 47, 25, 0.3)",
    },
  };

  const config = colorConfig[color] || colorConfig.primary;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group relative">
      {/* Efecto de brillo en hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"
        style={{ backgroundColor: config.glow }}
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
              className="p-4 rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
              style={{
                backgroundColor: config.iconBg,
                color: config.iconColor,
              }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
      <div
        className="h-2 group-hover:h-3 transition-all duration-300 relative overflow-hidden"
        style={{ backgroundColor: config.bg }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default KPICard;
