// Página de registro - Diseño moderno
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { toastService } from "../utils/toastService";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheck } from "react-icons/fa";
import supabase from "../services/supabase";

const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre || !email || !password) {
      toastService.error("Nombre, email y contraseña son requeridos");
      return;
    }

    if (password.length < 6) {
      toastService.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toastService.error("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);

    try {
      console.log("[RegisterPage] Iniciando registro para:", email.trim());

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            nombre: nombre.trim(),
            phone: phone.trim() || null,
            rol: "usuario",
          },
          emailRedirectTo: window.location.origin + "/login",
        },
      });

      if (error) {
        console.error("[RegisterPage] Error de Supabase:", error);
        toastService.error(
          error.message || "Error al registrarse. Verifica tus datos."
        );
        setLoading(false);
        return;
      }

      console.log("[RegisterPage] Respuesta de registro:", {
        user: data.user?.id,
        session: data.session?.user?.id,
        needsConfirmation: !data.session,
      });

      // Supabase puede requerir confirmación de email
      // Si no hay sesión, significa que el usuario necesita confirmar su email
      if (!data.session && data.user) {
        toastService.success(
          "¡Registro exitoso! Por favor revisa tu email para confirmar tu cuenta."
        );

        // Limpiar formulario
        setNombre("");
        setEmail("");
        setPassword("");
        setPhone("");

        setLoading(false);

        // Redirigir al login después de un momento
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }

      // Si hay sesión, el usuario está autenticado inmediatamente
      if (data.user) {
        console.log("[RegisterPage] Usuario creado, creando perfil...");

        // El trigger debería crear el usuario en la tabla usuarios automáticamente
        // Pero intentamos crear/actualizar el perfil manualmente como respaldo
        try {
          const { data: perfilData, error: perfilError } = await supabase
            .from("usuarios")
            .upsert(
              {
                id: data.user.id,
                nombre: nombre.trim(),
                rol: "usuario",
                activo: true,
              },
              {
                onConflict: "id",
              }
            )
            .select()
            .single();

          if (perfilError) {
            console.warn(
              "[RegisterPage] Error al crear perfil en usuarios:",
              perfilError
            );
            // No es crítico si el trigger ya lo creó
            // Solo mostramos un warning en consola
          } else {
            console.log(
              "[RegisterPage] Perfil creado/actualizado:",
              perfilData
            );
          }
        } catch (perfilErr) {
          console.warn("[RegisterPage] Excepción al crear perfil:", perfilErr);
          // Continuamos aunque haya error, el trigger puede haberlo creado
        }

        toastService.success("Registro exitoso. Redirigiendo al login...");

        // Limpiar formulario
        setNombre("");
        setEmail("");
        setPassword("");
        setPhone("");

        setLoading(false);

        // Redirigir al login después del registro
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        console.error("[RegisterPage] No se recibió usuario en la respuesta");
        toastService.error(
          "No se pudo completar el registro. Intenta nuevamente."
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("[RegisterPage] Excepción en registro:", error);
      toastService.error(
        error.message || "Error inesperado al registrarse. Intenta nuevamente."
      );
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Ya se redirige en el useEffect
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Imagen/Foto de Fondo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#002f19",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
        >
          {/* Overlay con gradiente */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0, 47, 25, 0.9)" }}
          ></div>

          {/* Contenido decorativo */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-white">
            <div className="max-w-md">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-2xl">
                  <FaUser className="text-white text-4xl" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                Únete a nosotros
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Crea tu cuenta y comienza a gestionar tu negocio de forma
                profesional
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Registro rápido y sencillo</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Acceso inmediato a todas las funciones</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Soporte 24/7 disponible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Elementos decorativos flotantes */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Lado Derecho - Formulario de Registro */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12"
        style={{
          background: "linear-gradient(to bottom right, #f5f7fa, #e8f5e8)",
        }}
      >
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
                style={{ backgroundColor: "#002f19" }}
              >
                <FaUser className="text-white text-2xl" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Crear Cuenta
              </h2>
              <p className="text-gray-600 text-lg">Regístrate para comenzar</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nombre y Apellidos
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all text-lg"
                    onFocus={(e) => {
                      e.target.style.borderColor = "#002f19";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(0, 47, 25, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "";
                      e.target.style.boxShadow = "";
                    }}
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-4">
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
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all text-lg"
                    onFocus={(e) => {
                      e.target.style.borderColor = "#002f19";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(0, 47, 25, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "";
                      e.target.style.boxShadow = "";
                    }}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="phone"
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all text-lg"
                    onFocus={(e) => {
                      e.target.style.borderColor = "#002f19";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(0, 47, 25, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "";
                      e.target.style.boxShadow = "";
                    }}
                    placeholder="Ej: 3001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all text-lg"
                    onFocus={(e) => {
                      e.target.style.borderColor = "#002f19";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(0, 47, 25, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "";
                      e.target.style.boxShadow = "";
                    }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                <small className="text-gray-500 text-sm mt-1">
                  Mínimo 6 caracteres
                </small>
              </div>

              <button
                type="submit"
                className="w-full text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:opacity-90"
                style={{ backgroundColor: "#002f19" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Registrarme</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/login"
                  className="font-semibold transition-colors underline"
                  style={{ color: "#002f19" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
