// Página de login - Diseño moderno
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { toastService } from "../utils/toastService";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import supabase from "../services/supabase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false); // Protección contra doble submit

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevenir propagación del evento

    // Protección contra doble submit (también funciona con StrictMode)
    if (loading || isSubmittingRef.current) {
      console.log("[LoginPage] Login ya en proceso, ignorando...");
      return;
    }

    const emailTrim = email.trim().toLowerCase();
    const passwordVal = password;

    if (!emailTrim || !passwordVal) {
      toastService.error("Email y contraseña son requeridos");
      return;
    }

    // Marcar como en proceso
    isSubmittingRef.current = true;
    setLoading(true);

    try {
      console.log("[LoginPage] Iniciando login para:", emailTrim);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailTrim,
        password: passwordVal,
      });

      if (error) {
        console.error("[LoginPage] Error de login:", error);
        toastService.error(
          error.message || "Datos inválidos del email o contraseña"
        );
        isSubmittingRef.current = false;
        setLoading(false);
        return;
      }

      if (data?.user && data?.session) {
        console.log("[LoginPage] Login exitoso, usuario:", data.user.id);

        // Navegar inmediatamente - el AuthContext se actualizará automáticamente
        toastService.success("Inicio de sesión exitoso");

        // Navegar sin esperar - el AuthContext manejará la carga del perfil
        navigate("/dashboard");

        // No resetear isSubmittingRef aquí - se reseteará cuando el componente se desmonte
        // Esto evita que se pueda hacer doble click antes de navegar
      } else {
        console.error("[LoginPage] No se recibió usuario o sesión");
        toastService.error("No se pudo iniciar sesión. Intenta nuevamente.");
        isSubmittingRef.current = false;
        setLoading(false);
      }
    } catch (error) {
      console.error("[LoginPage] Excepción en login:", error);
      toastService.error("Error inesperado al iniciar sesión");
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  // Resetear el ref cuando el componente se desmonte o cuando se desautentique
  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
    };
  }, []);

  if (isAuthenticated) {
    return null; // Ya se redirige en el useEffect
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Imagen/Foto de Fondo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
        >
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90"></div>

          {/* Contenido decorativo */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-white">
            <div className="max-w-md">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-2xl">
                  <FaLock className="text-white text-4xl" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                Bienvenido de nuevo
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Accede a tu cuenta y gestiona tu negocio de manera eficiente
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Gestión completa de inventario</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Análisis de ventas en tiempo real</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Panel de control intuitivo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Elementos decorativos flotantes */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Lado Derecho - Formulario de Inicio de Sesión */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <FaLock className="text-white text-2xl" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600 text-lg">
                Accede a tu cuenta para continuar
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} noValidate>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <FaArrowRight className="text-sm" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors underline"
                >
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
