// Landing Page principal del sistema - Diseño moderno y espacioso
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  FaShoppingBag,
  FaChartLine,
  FaRobot,
  FaShoppingCart,
  FaMobileAlt,
  FaTools,
  FaChartBar,
  FaArrowRight,
  FaCheckCircle,
  FaTshirt,
  FaHome,
} from "react-icons/fa";

const LandingPage = () => {
  const { isAuthenticated } = useAuthContext();

  const servicios = [
    {
      icon: FaShoppingBag,
      title: "Gestión de Inventario",
      desc: "Control total de tu stock de ropa",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: FaChartLine,
      title: "Análisis de Ventas",
      desc: "Reportes detallados de rendimiento",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      icon: FaRobot,
      title: "Asistentes Inteligentes",
      desc: "IA para consultas rápidas",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: FaShoppingCart,
      title: "E-commerce Integrado",
      desc: "Ventas online conectadas",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      icon: FaMobileAlt,
      title: "App Móvil",
      desc: "Gestiona desde cualquier lugar",
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      icon: FaTools,
      title: "Soporte Técnico",
      desc: "Asistencia cuando la necesites",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const caracteristicas = [
    {
      icon: FaTshirt,
      title: "Catálogo de Productos",
      text: "Organiza tu colección de ropa fácilmente",
    },
    {
      icon: FaChartBar,
      title: "Reportes en Tiempo Real",
      text: "Visualiza tus ventas y tendencias",
    },
    {
      icon: FaRobot,
      title: "Asistentes IA",
      text: "Consulta información con lenguaje natural",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header del Landing Page */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 no-underline group">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                <FaChartLine className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">
                InventarioPro
              </span>
            </Link>

            {/* Navegación */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Tienda
              </Link>
              <Link
                to="/agents"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Asistentes IA
              </Link>
            </nav>

            {/* Botones de Acción */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/shop"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                  >
                    Ir a Tienda
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Ingresar
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Ocupa toda la pantalla, alineado a la izquierda */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
          <div className="max-w-7xl">
            {/* Badge de Bienvenida */}
            <div className="inline-block mb-8 px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200 shadow-sm">
              ✨ Bienvenido a Nuestro Sistema Inteligente
            </div>

            {/* Título Principal - Alineado a la izquierda */}
            <div className="space-y-6 mb-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-gray-900">
                <span className="block mb-3">Gestiona tu Tienda</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  con Inteligencia
                </span>
              </h1>

              {/* Descripción - Alineada a la izquierda */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-4xl leading-relaxed">
                Controla tu inventario, analiza tus ventas y toma decisiones
                inteligentes con nuestro sistema todo-en-uno diseñado para
                tiendas de moda.
              </p>
            </div>

            {/* Botones de Acción - Alineados a la izquierda */}
            <div className="flex flex-wrap gap-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                Comenzar Ahora
                <FaArrowRight className="ml-2" />
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FaHome className="mr-2" />
                  Ir al Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Alineado a la izquierda */}
      <section className="py-24 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl">
            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Todo lo que Necesitas para tu Tienda
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed">
                Un sistema completo diseñado específicamente para tiendas de
                moda y ropa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {caracteristicas.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-10 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Alineado a la izquierda */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl">
            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Funcionalidades Potentes
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed">
                Herramientas diseñadas para hacer crecer tu negocio de moda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {servicios.map((servicio, idx) => {
                const Icon = servicio.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div
                      className={`${servicio.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}
                    >
                      <Icon className={`text-3xl ${servicio.iconColor}`} />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                      {servicio.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {servicio.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Alineado a la izquierda */}
      <section className="py-24 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                    ¿Por Qué Elegirnos?
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
                    La solución perfecta para tiendas de moda que buscan
                    eficiencia y crecimiento.
                  </p>
                </div>
                <div className="space-y-5">
                  {[
                    "Control total de tu inventario",
                    "Análisis de ventas en tiempo real",
                    "Asistentes inteligentes con IA",
                    "Interfaz intuitiva y fácil de usar",
                    "Soporte técnico especializado",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <FaCheckCircle className="text-green-500 text-2xl mr-4 flex-shrink-0 mt-1" />
                      <span className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 lg:p-14 border border-blue-100 shadow-lg">
                <div className="grid grid-cols-2 gap-8 lg:gap-10">
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-3">
                      100%
                    </div>
                    <p className="text-gray-600 text-lg">Satisfacción</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-indigo-600 mb-3">
                      24/7
                    </div>
                    <p className="text-gray-600 text-lg">Disponible</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-3">
                      10+
                    </div>
                    <p className="text-gray-600 text-lg">Años de experiencia</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-pink-600 mb-3">
                      500+
                    </div>
                    <p className="text-gray-600 text-lg">Clientes felices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Alineado a la izquierda */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              ¿Listo para Transformar tu Negocio?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed">
              Comienza hoy mismo y lleva tu tienda de moda al siguiente nivel
            </p>
            <div className="pt-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex items-center px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
              >
                Empezar Gratis
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Alineado a la izquierda */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-12">
              <div>
                <h5 className="text-xl lg:text-2xl font-bold mb-6 flex items-center">
                  <FaTshirt className="mr-3 text-blue-400" />
                  Sistema de Inventario
                </h5>
                <p className="text-gray-400 text-lg leading-relaxed">
                  La solución completa para gestionar tu tienda de moda de
                  manera inteligente y eficiente.
                </p>
              </div>
              <div>
                <h5 className="text-xl lg:text-2xl font-bold mb-6">
                  Enlaces Rápidos
                </h5>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-400 hover:text-white transition-colors text-lg"
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/agents"
                      className="text-gray-400 hover:text-white transition-colors text-lg"
                    >
                      Asistentes IA
                    </Link>
                  </li>
                  {!isAuthenticated && (
                    <>
                      <li>
                        <Link
                          to="/login"
                          className="text-gray-400 hover:text-white transition-colors text-lg"
                        >
                          Iniciar Sesión
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register"
                          className="text-gray-400 hover:text-white transition-colors text-lg"
                        >
                          Registrarse
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h5 className="text-xl lg:text-2xl font-bold mb-6">
                  Características
                </h5>
                <ul className="space-y-3 text-gray-400 text-lg">
                  <li>Gestión de Inventario</li>
                  <li>Análisis de Ventas</li>
                  <li>Asistentes Inteligentes</li>
                  <li>Soporte 24/7</li>
                </ul>
              </div>
            </div>
            <hr className="border-gray-800 mb-8" />
            <div className="text-center text-gray-400 text-lg">
              <p>
                &copy; {new Date().getFullYear()} Sistema de Inventario. Todos
                los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
