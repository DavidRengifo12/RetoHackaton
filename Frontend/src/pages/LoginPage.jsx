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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(to bottom right, #f9fafb, #eff6ff, #eef2ff)",
      }}
    >
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
              <FaLock className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">Accede a tu cuenta para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
