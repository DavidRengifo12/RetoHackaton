// Componente de tarjeta KPI
const KPICard = ({ title, value, subtitle, icon, color = 'primary', trend = null }) => {
  const colorClasses = {
    primary: 'bg-primary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    danger: 'bg-danger text-white',
    info: 'bg-info text-white',
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className={`card-body ${colorClasses[color]}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="card-subtitle mb-2 text-white-50">{title}</h6>
            <h3 className="card-title mb-0">{value}</h3>
            {subtitle && <small className="text-white-50">{subtitle}</small>}
            {trend && (
              <div className="mt-2">
                <small className={`${trend > 0 ? 'text-success' : 'text-danger'}`}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
                </small>
              </div>
            )}
          </div>
          {icon && <div className="fs-1">{icon}</div>}
        </div>
      </div>
    </div>
  );
};

export default KPICard;

