// Página de dashboard principal
import { Link, useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAuthContext } from '../context/AuthContext';
import { formatCurrency, formatPercentage } from '../utils/helpers';
import KPICard from '../components/dashboard/KPICard';
import CustomBarChart from '../components/charts/BarChart';
import CustomPieChart from '../components/charts/PieChart';
import CustomLineChart from '../components/charts/LineChart';
import Recommendations from '../components/dashboard/Recommendations';
import Loading from '../components/common/Loading';
import { formatSalesDataForChart, formatTopProductsForChart } from '../utils/formatters';

const DashboardPage = () => {
  const {
    topProducts,
    monthlyAverage,
    inventoryRotation,
    lowRotationProducts,
    salesByCategory,
    salesBySize,
    salesByGender,
    loading,
    error,
  } = useAnalytics();
  
  const { signOut, user, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/login');
    }
  };

  if (loading) return <Loading message="Cargando dashboard..." />;
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error al cargar datos: {error}
        </div>
      </div>
    );
  }

  const topProductsChartData = formatTopProductsForChart(topProducts || []);
  const categoryChartData = formatSalesDataForChart(salesByCategory || []);
  const sizeChartData = formatSalesDataForChart(salesBySize || []);
  const genderChartData = formatSalesDataForChart(salesByGender || []);

  return (
    <div className="container-fluid mt-4 px-3 px-md-4">
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h1 className="mb-0">📊 Dashboard Analítico</h1>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-secondary">
              {user?.nombre || user?.email || 'Usuario'}
            </span>
            <span className={`badge ${isAdmin ? 'bg-danger' : 'bg-info'}`}>
              {isAdmin ? '👑 Administrador' : '👤 Usuario'}
            </span>
          </div>
        </div>
      </div>

      {/* Navegación Rápida - Solo visible en pantallas grandes */}
      <div className="row mb-4 d-none d-lg-block">
        <div className="col-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Navegación Rápida</h5>
              <div className="row g-3">
                <div className="col-lg-3">
                  <Link to="/inventory" className="text-decoration-none">
                    <div className="card h-100 border-primary hover-card">
                      <div className="card-body text-center">
                        <div className="fs-1 mb-2">📦</div>
                        <h6 className="card-title">Inventario</h6>
                        <p className="card-text text-muted small mb-0">Gestionar productos y stock</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-3">
                  <Link to="/upload" className="text-decoration-none">
                    <div className="card h-100 border-success hover-card">
                      <div className="card-body text-center">
                        <div className="fs-1 mb-2">📤</div>
                        <h6 className="card-title">Cargar Datos</h6>
                        <p className="card-text text-muted small mb-0">Importar datos históricos</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-3">
                  <div className="card h-100 border-info bg-light">
                    <div className="card-body text-center">
                      <div className="fs-1 mb-2">📊</div>
                      <h6 className="card-title">Dashboard</h6>
                      <p className="card-text text-muted small mb-0">Vista actual</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card h-100 border-danger hover-card" style={{ cursor: 'pointer' }} onClick={handleSignOut}>
                    <div className="card-body text-center">
                      <div className="fs-1 mb-2">🚪</div>
                      <h6 className="card-title text-danger">Cerrar Sesión</h6>
                      <p className="card-text text-muted small mb-0">Salir del sistema</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="row mb-4 g-3">
        <div className="col-12 col-sm-6 col-md-3">
          <KPICard
            title="Promedio Ventas Mensual"
            value={monthlyAverage ? formatCurrency(monthlyAverage.current) : '$0.00'}
            subtitle={monthlyAverage ? `vs. mes anterior: ${formatPercentage(monthlyAverage.change)}` : 'Sin datos'}
            icon="📈"
            color="primary"
            trend={monthlyAverage?.change}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <KPICard
            title="Rotación de Inventario"
            value={inventoryRotation ? formatPercentage(inventoryRotation.average) : '0%'}
            subtitle="Promedio general"
            icon="🔄"
            color="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <KPICard
            title="Productos Top 5"
            value={topProducts?.length || 0}
            subtitle="Más vendidos del mes"
            icon="🏆"
            color="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <KPICard
            title="Baja Rotación"
            value={lowRotationProducts?.length || 0}
            subtitle="Productos < 20%"
            icon="⚠️"
            color="danger"
          />
        </div>
      </div>

      {/* Gráficos */}
      <div className="row mb-4 g-3">
        <div className="col-12 col-md-6">
          <CustomBarChart
            title="Top 5 Productos Más Vendidos"
            data={topProductsChartData}
            dataKey="quantity"
            nameKey="name"
          />
        </div>
        <div className="col-12 col-md-6">
          <CustomBarChart
            title="Ventas por Categoría"
            data={categoryChartData}
            dataKey="value"
            nameKey="name"
          />
        </div>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-12 col-md-6">
          <CustomPieChart
            title="Distribución de Ventas por Talla"
            data={sizeChartData}
            dataKey="value"
            nameKey="name"
          />
        </div>
        <div className="col-12 col-md-6">
          <CustomLineChart
            title="Ventas por Género"
            data={genderChartData}
            dataKey="value"
            nameKey="name"
            multipleLines={false}
          />
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="row">
        <div className="col-12">
          <Recommendations />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

