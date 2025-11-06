// Página de dashboard principal
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
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
  FaRobot,
  FaArrowRight,
  FaLightbulb,
} from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { salesService } from "../services/salesService";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
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

  const [userStats, setUserStats] = useState({
    totalSales: 0,
    monthlySales: 0,
    averageOrder: 0,
    totalOrders: 0,
  });

  const loadUserStats = useCallback(async () => {
    if (!user) return;

    try {
      // Obtener todas las ventas del usuario
      const { data: allSales } = await salesService.getAllSales();
      const userSales =
        allSales?.filter((sale) => sale.usuario_id === user.id) || [];

      // Obtener ventas del mes actual
      const { data: currentMonthSales } =
        await salesService.getCurrentMonthSales();
      const userMonthlySales =
        currentMonthSales?.filter((sale) => sale.usuario_id === user.id) || [];

      const totalSales = userSales.reduce(
        (sum, sale) => sum + (sale.precio_total || 0),
        0
      );
      const monthlySales = userMonthlySales.reduce(
        (sum, sale) => sum + (sale.precio_total || 0),
        0
      );
      const totalOrders = userSales.length;
      const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

      setUserStats({
        totalSales,
        monthlySales,
        averageOrder,
        totalOrders,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas del usuario:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user, loadUserStats]);

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

  const isAdmin = user?.rol === "administrador";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Mejorado */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="relative w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/30">
              <FaChartLine className="text-4xl sm:text-5xl" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
                Panel de Control
              </h1>
              <p className="text-blue-100 text-base sm:text-lg lg:text-xl">
                {isAdmin
                  ? "Métricas y análisis completo de tu negocio en tiempo real"
                  : "Bienvenido, aquí puedes ver tus estadísticas y métricas"}
              </p>
              {user && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    👤 {user.nombre || user.email}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {isAdmin ? "🔑 Administrador" : "👥 Usuario"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de Recordatorio sobre Agentes - Solo para Administradores */}
        {isAdmin && (
          <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl border-2 border-blue-400/50">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Icono */}
                <div className="flex-shrink-0">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg border-2 border-white/30 animate-pulse">
                    <FaRobot className="text-4xl sm:text-5xl text-white" />
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaLightbulb className="text-yellow-300 text-xl sm:text-2xl" />
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                      ¡Aprovecha al máximo la aplicación!
                    </h3>
                  </div>
                  <p className="text-blue-100 text-base sm:text-lg mb-4 leading-relaxed">
                    Utiliza nuestros{" "}
                    <strong className="text-white">Agentes Inteligentes</strong>{" "}
                    para consultar productos, analizar ventas, gestionar
                    inventario y obtener respuestas rápidas a tus preguntas. Los
                    agentes te ayudan a trabajar de manera más eficiente y
                    aprovechar todas las funcionalidades de la plataforma.
                  </p>

                  {/* Características rápidas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <FaBoxOpen className="text-blue-200" />
                        <span>Consultar Inventario</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <FaChartLine className="text-indigo-200" />
                        <span>Analizar Ventas</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <FaRobot className="text-purple-200" />
                        <span>Consultas Inteligentes</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <FaLightbulb className="text-yellow-200" />
                        <span>Respuestas Rápidas</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <button
                    onClick={() => navigate("/agents")}
                    className="group inline-flex items-center gap-3 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-blue-50"
                  >
                    <span>Explorar Agentes</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección: Indicadores Clave (KPIs) - Mejorado */}
        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
              Indicadores Clave de Rendimiento
            </h2>
            <p className="text-gray-600 text-lg ml-4">
              {isAdmin
                ? "Métricas principales de tu negocio"
                : "Tus estadísticas personales y del negocio"}
            </p>
          </div>

          {/* KPIs para Usuarios Normales */}
          {!isAdmin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
              <KPICard
                title="Promedio Ventas Mensual"
                value={
                  monthlyAverage
                    ? formatCurrency(monthlyAverage.current)
                    : "$0.00"
                }
                subtitle={
                  monthlyAverage
                    ? `Promedio diario del mes actual`
                    : "Sin datos disponibles"
                }
                icon="📈"
                color="primary"
                trend={monthlyAverage?.change}
              />
              <KPICard
                title="Mis Ventas del Mes"
                value={formatCurrency(userStats.monthlySales)}
                subtitle="Total de tus ventas este mes"
                icon="💰"
                color="success"
              />
              <KPICard
                title="Total de Pedidos"
                value={userStats.totalOrders}
                subtitle="Pedidos realizados en total"
                icon="🛒"
                color="info"
              />
              <KPICard
                title="Ticket Promedio"
                value={formatCurrency(userStats.averageOrder)}
                subtitle="Promedio por pedido"
                icon="💳"
                color="warning"
              />
            </div>
          )}

          {/* KPIs para Administradores */}
          {isAdmin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
              <KPICard
                title="Promedio Ventas Mensual"
                value={
                  monthlyAverage
                    ? formatCurrency(monthlyAverage.current)
                    : "$0.00"
                }
                subtitle={
                  monthlyAverage
                    ? `Promedio diario del mes actual`
                    : "Sin datos disponibles"
                }
                icon="📈"
                color="primary"
                trend={monthlyAverage?.change}
              />
              <KPICard
                title="Rotación de Inventario"
                value={
                  inventoryRotation
                    ? formatPercentage(inventoryRotation.average)
                    : "0%"
                }
                subtitle="Promedio general de rotación"
                icon="🔄"
                color="success"
              />
              <KPICard
                title="Productos Top 5"
                value={topProducts?.length || 0}
                subtitle="Productos más vendidos"
                icon="🏆"
                color="warning"
              />
              <KPICard
                title="Baja Rotación"
                value={lowRotationProducts?.length || 0}
                subtitle="Productos con rotación < 20%"
                icon="⚠️"
                color="danger"
              />
            </div>
          )}

          {/* KPIs Adicionales para Todos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            <KPICard
              title="Productos Más Vendidos"
              value={topProducts?.length || 0}
              subtitle="Top productos del mes"
              icon="⭐"
              color="info"
            />
            <KPICard
              title="Categorías Activas"
              value={salesByCategory?.length || 0}
              subtitle="Categorías con ventas"
              icon="📦"
              color="primary"
            />
            <KPICard
              title="Total Ventas del Mes"
              value={
                salesByCategory?.reduce(
                  (sum, cat) => sum + (cat.totalRevenue || 0),
                  0
                )
                  ? formatCurrency(
                      salesByCategory.reduce(
                        (sum, cat) => sum + (cat.totalRevenue || 0),
                        0
                      )
                    )
                  : "$0.00"
              }
              subtitle="Ingresos totales del mes"
              icon="💵"
              color="success"
            />
          </div>
        </div>

        {/* Sección: Análisis de Ventas - Mejorado */}
        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              Análisis de Ventas
            </h2>
            <p className="text-gray-600 text-lg ml-4">
              Desglose detallado de tus ventas por diferentes categorías
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <CustomBarChart
                title="Top 5 Productos Más Vendidos"
                data={topProductsChartData}
                dataKey="quantity"
                nameKey="name"
                color="#3b82f6"
              />
            </div>
            <div className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <CustomBarChart
                title="Ventas por Categoría"
                data={categoryChartData}
                dataKey="value"
                nameKey="name"
                color="#10b981"
              />
            </div>
          </div>
        </div>

        {/* Sección: Distribución de Ventas - Mejorado */}
        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              Distribución de Ventas
            </h2>
            <p className="text-gray-600 text-lg ml-4">
              Análisis detallado por talla y género
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <CustomPieChart
                title="Distribución de Ventas por Talla"
                data={sizeChartData}
                dataKey="value"
                nameKey="name"
              />
            </div>
            <div className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <CustomLineChart
                title="Ventas por Género"
                data={genderChartData}
                dataKey="value"
                nameKey="name"
                multipleLines={false}
              />
            </div>
          </div>
        </div>

        {/* Sección: Métodos de Pago - Mejorado */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-gray-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  Métodos de Pago Disponibles
                </h2>
                <p className="text-gray-600 text-lg ml-4">
                  Aceptamos múltiples formas de pago para tu comodidad
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
                <div className="flex flex-col items-center gap-3 group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 group-hover:border-blue-400 group-hover:scale-110 group-hover:-translate-y-2">
                    <img
                      src="/img/master.jpeg"
                      alt="Mastercard"
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <span className="text-base font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    Mastercard
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3 group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 group-hover:border-green-400 group-hover:scale-110 group-hover:-translate-y-2">
                    <img
                      src="/img/pse-logo.jpeg"
                      alt="PSE"
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <span className="text-base font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                    PSE
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3 group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 group-hover:border-purple-400 group-hover:scale-110 group-hover:-translate-y-2">
                    <img
                      src="/img/nequi-logo.png"
                      alt="Nequi"
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <span className="text-base font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                    Nequi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Recomendaciones */}
        <div className="mb-8">
          <Recommendations />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
