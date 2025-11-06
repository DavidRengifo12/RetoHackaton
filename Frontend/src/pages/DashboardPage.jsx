// Página de dashboard principal
import { Link, useNavigate } from "react-router-dom";
import { useAnalytics } from "../hooks/useAnalytics";
import { useAuthContext } from "../context/AuthContext";
import { formatCurrency, formatPercentage } from "../utils/helpers";
import KPICard from "../components/dashboard/KPICard";
import CustomBarChart from "../components/charts/BarChart";
import CustomPieChart from "../components/charts/PieChart";
import CustomLineChart from "../components/charts/LineChart";
import Recommendations from "../components/dashboard/Recommendations";
import Loading from "../components/common/Loading";
import {
  formatSalesDataForChart,
  formatTopProductsForChart,
} from "../utils/formatters";
import {
  FaChartLine,
  FaBox,
  FaUpload,
  FaSignOutAlt,
  FaCrown,
  FaUser,
} from "react-icons/fa";

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
      navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container-fluid px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <FaChartLine className="mr-3" />
                Dashboard Analítico
              </h1>
              <p className="text-blue-100 text-lg">
                Visión completa de tu negocio en tiempo real
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                <FaUser className="text-lg" />
                <span className="font-semibold">
                  {user?.nombre || user?.email || "Usuario"}
                </span>
              </div>
              <div
                className={`bg-${
                  isAdmin ? "red" : "blue"
                }-500 rounded-xl px-4 py-2 flex items-center gap-2`}
              >
                {isAdmin ? (
                  <FaCrown className="text-lg" />
                ) : (
                  <FaUser className="text-lg" />
                )}
                <span className="font-semibold">
                  {isAdmin ? "Administrador" : "Usuario"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-6">
        {/* Navegación Rápida - Solo visible en pantallas grandes */}
        <div className="row mb-6 d-none d-lg-block">
          <div className="col-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h5 className="text-xl font-bold text-gray-900 mb-4">
                Navegación Rápida
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link to="/inventory" className="text-decoration-none">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <FaBox className="text-4xl text-blue-600 mx-auto mb-3" />
                    <h6 className="font-bold text-gray-900 mb-1">Inventario</h6>
                    <p className="text-sm text-gray-600 mb-0">
                      Gestionar productos y stock
                    </p>
                  </div>
                </Link>
                <Link to="/upload" className="text-decoration-none">
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 text-center border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <FaUpload className="text-4xl text-green-600 mx-auto mb-3" />
                    <h6 className="font-bold text-gray-900 mb-1">
                      Cargar Datos
                    </h6>
                    <p className="text-sm text-gray-600 mb-0">
                      Importar datos históricos
                    </p>
                  </div>
                </Link>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center border-2 border-indigo-300">
                  <FaChartLine className="text-4xl text-indigo-600 mx-auto mb-3" />
                  <h6 className="font-bold text-gray-900 mb-1">Dashboard</h6>
                  <p className="text-sm text-gray-600 mb-0">Vista actual</p>
                </div>
                <div
                  className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 text-center border-2 border-red-200 hover:border-red-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt className="text-4xl text-red-600 mx-auto mb-3" />
                  <h6 className="font-bold text-red-600 mb-1">Cerrar Sesión</h6>
                  <p className="text-sm text-gray-600 mb-0">
                    Salir del sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="row mb-6 g-3">
          <div className="col-12 col-sm-6 col-md-3">
            <KPICard
              title="Promedio Ventas Mensual"
              value={
                monthlyAverage
                  ? formatCurrency(monthlyAverage.current)
                  : "$0.00"
              }
              subtitle={
                monthlyAverage
                  ? `vs. mes anterior: ${formatPercentage(
                      monthlyAverage.change
                    )}`
                  : "Sin datos"
              }
              icon="📈"
              color="primary"
              trend={monthlyAverage?.change}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <KPICard
              title="Rotación de Inventario"
              value={
                inventoryRotation
                  ? formatPercentage(inventoryRotation.average)
                  : "0%"
              }
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
        <div className="row mb-6 g-3">
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

        <div className="row mb-6 g-3">
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
    </div>
  );
};

export default DashboardPage;
