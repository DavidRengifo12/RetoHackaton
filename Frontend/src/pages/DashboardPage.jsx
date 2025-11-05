// Página de dashboard principal
import { useAnalytics } from '../hooks/useAnalytics';
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
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-4">📊 Dashboard Analítico</h1>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="row mb-4">
        <div className="col-md-3">
          <KPICard
            title="Promedio Ventas Mensual"
            value={monthlyAverage ? formatCurrency(monthlyAverage.current) : '$0.00'}
            subtitle={monthlyAverage ? `vs. mes anterior: ${formatPercentage(monthlyAverage.change)}` : 'Sin datos'}
            icon="📈"
            color="primary"
            trend={monthlyAverage?.change}
          />
        </div>
        <div className="col-md-3">
          <KPICard
            title="Rotación de Inventario"
            value={inventoryRotation ? formatPercentage(inventoryRotation.average) : '0%'}
            subtitle="Promedio general"
            icon="🔄"
            color="success"
          />
        </div>
        <div className="col-md-3">
          <KPICard
            title="Productos Top 5"
            value={topProducts?.length || 0}
            subtitle="Más vendidos del mes"
            icon="🏆"
            color="warning"
          />
        </div>
        <div className="col-md-3">
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
      <div className="row mb-4">
        <div className="col-md-6">
          <CustomBarChart
            title="Top 5 Productos Más Vendidos"
            data={topProductsChartData}
            dataKey="quantity"
            nameKey="name"
          />
        </div>
        <div className="col-md-6">
          <CustomBarChart
            title="Ventas por Categoría"
            data={categoryChartData}
            dataKey="value"
            nameKey="name"
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <CustomPieChart
            title="Distribución de Ventas por Talla"
            data={sizeChartData}
            dataKey="value"
            nameKey="name"
          />
        </div>
        <div className="col-md-6">
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

