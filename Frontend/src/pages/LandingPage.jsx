// Landing Page principal del sistema - Diseño para tienda de ropa
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  FaShoppingBag,
  FaChartLine,
  FaRobot,
  FaShoppingCart,
  FaMobileAlt,
  FaTools,
  FaLaptopCode,
  FaCloud,
  FaChartBar,
  FaArrowRight,
  FaCheckCircle,
  FaTshirt,
  FaUsers,
  FaStar,
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div>
                <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  ✨ Sistema Inteligente de Moda
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Gestiona tu Tienda de Ropa con{" "}
                  <span className="text-blue-600">Inteligencia</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Controla tu inventario, analiza tus ventas y toma decisiones
                  inteligentes con nuestro sistema todo-en-uno diseñado para
                  tiendas de moda.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Comenzar Ahora
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/agents"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200"
                  >
                    Ver Demo
                  </Link>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <FaShoppingBag className="text-4xl text-blue-600 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-700">
                        Inventario
                      </p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-6 text-center">
                      <FaChartLine className="text-4xl text-indigo-600 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-700">
                        Ventas
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-6 text-center">
                      <FaRobot className="text-4xl text-purple-600 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-700">IA</p>
                    </div>
                    <div className="bg-pink-50 rounded-xl p-6 text-center">
                      <FaShoppingCart className="text-4xl text-pink-600 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-700">
                        E-commerce
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Todo lo que Necesitas para tu Tienda
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Un sistema completo diseñado específicamente para tiendas de
                moda y ropa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {caracteristicas.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Funcionalidades Potentes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Herramientas diseñadas para hacer crecer tu negocio de moda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicios.map((servicio, idx) => {
                const Icon = servicio.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div
                      className={`${servicio.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}
                    >
                      <Icon className={`text-3xl ${servicio.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {servicio.title}
                    </h3>
                    <p className="text-gray-600">{servicio.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  ¿Por Qué Elegirnos?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  La solución perfecta para tiendas de moda que buscan
                  eficiencia y crecimiento.
                </p>
                <div className="space-y-4">
                  {[
                    "Control total de tu inventario",
                    "Análisis de ventas en tiempo real",
                    "Asistentes inteligentes con IA",
                    "Interfaz intuitiva y fácil de usar",
                    "Soporte técnico especializado",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <FaCheckCircle className="text-green-500 text-xl mr-4 flex-shrink-0" />
                      <span className="text-lg text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 border border-blue-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      100%
                    </div>
                    <p className="text-gray-600">Satisfacción</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      24/7
                    </div>
                    <p className="text-gray-600">Disponible</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      10+
                    </div>
                    <p className="text-gray-600">Años de experiencia</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-600 mb-2">
                      500+
                    </div>
                    <p className="text-gray-600">Clientes felices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para Transformar tu Negocio?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Comienza hoy mismo y lleva tu tienda de moda al siguiente nivel
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Empezar Gratis
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h5 className="text-xl font-bold mb-4 flex items-center">
                  <FaTshirt className="mr-2 text-blue-400" />
                  Sistema de Inventario
                </h5>
                <p className="text-gray-400">
                  La solución completa para gestionar tu tienda de moda de
                  manera inteligente y eficiente.
                </p>
              </div>
              <div>
                <h5 className="text-xl font-bold mb-4">Enlaces Rápidos</h5>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/agents"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Asistentes IA
                    </Link>
                  </li>
                  {!isAuthenticated && (
                    <>
                      <li>
                        <Link
                          to="/login"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          Iniciar Sesión
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          Registrarse
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h5 className="text-xl font-bold mb-4">Características</h5>
                <ul className="space-y-2 text-gray-400">
                  <li>Gestión de Inventario</li>
                  <li>Análisis de Ventas</li>
                  <li>Asistentes Inteligentes</li>
                  <li>Soporte 24/7</li>
                </ul>
              </div>
            </div>
            <hr className="border-gray-800 mb-8" />
            <div className="text-center text-gray-400">
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
