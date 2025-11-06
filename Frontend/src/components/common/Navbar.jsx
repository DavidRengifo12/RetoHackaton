// Componente de navegación moderno inspirado en Mercado Libre
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import {
  FaChartLine,
  FaBox,
  FaUpload,
  FaRobot,
  FaUsers,
  FaPlus,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaShoppingCart,
  FaSearch,
  FaCrown,
} from "react-icons/fa";

const Navbar = () => {
  const { user, signOut, isAuthenticated, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sidebarRef = useRef(null);

  // Cerrar el sidebar cuando cambia la ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Cerrar el sidebar cuando se hace click fuera o presiona ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("[data-sidebar-toggle]")
      ) {
        setSidebarOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      setSidebarOpen(false);
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Si estamos en la tienda, solo actualizamos el estado local
      // Si estamos en otra página, navegamos a la tienda con el término de búsqueda
      if (location.pathname === "/shop") {
        // Emitir evento personalizado para que ShopPage lo escuche
        window.dispatchEvent(
          new CustomEvent("shopSearch", { detail: searchTerm.trim() })
        );
      } else {
        navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  // Leer parámetro de búsqueda de la URL cuando se carga la página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam && location.pathname === "/shop") {
      setSearchTerm(searchParam);
      window.dispatchEvent(
        new CustomEvent("shopSearch", { detail: searchParam })
      );
    }
  }, [location.pathname]);

  const menuItems = isAuthenticated
    ? [
        {
          icon: FaChartLine,
          label: "Dashboard",
          path: "/dashboard",
          adminOnly: false,
        },
        {
          icon: FaShoppingBag,
          label: "Tienda",
          path: "/shop",
          adminOnly: false,
        },
        {
          icon: FaBox,
          label: "Inventario",
          path: "/inventory",
          adminOnly: true,
        },
        {
          icon: FaUpload,
          label: "Cargar Datos",
          path: "/upload",
          adminOnly: true,
        },
        {
          icon: FaUsers,
          label: "Usuarios",
          path: "/admin/users",
          adminOnly: true,
        },
        {
          icon: FaPlus,
          label: "Agregar Producto",
          path: "/products/add",
          adminOnly: true,
        },
      ].filter((item) => !item.adminOnly || isAdmin)
    : [];

  return (
    <>
      {/* Header para pantallas pequeñas */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo y botón menú */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                data-sidebar-toggle
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-700 active:scale-95"
                style={{ color: "#002f19" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#002f19")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#002f19")}
                aria-label="Abrir menú"
              >
                <FaBars className="text-xl" />
              </button>
              <Link
                to={isAuthenticated ? "/dashboard" : "/"}
                className="flex items-center gap-2 no-underline group"
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md group-hover:shadow-lg transition-all group-hover:scale-105"
                  style={{ backgroundColor: "#002f19" }}
                >
                  <FaChartLine className="text-white text-lg" />
                </div>
                <span
                  className="text-lg font-bold hidden sm:block transition-all"
                  style={{ color: "#002f19" }}
                >
                  InventarioPro
                </span>
              </Link>
            </div>

            {/* Búsqueda en móvil */}
            {isAuthenticated && (
              <form onSubmit={handleSearch} className="flex-1 max-w-xs mx-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-all"
                    style={{ "--tw-ring-color": "#002f19" } || {}}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#002f19";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(0, 47, 25, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "";
                      e.target.style.boxShadow = "";
                    }}
                  />
                </div>
              </form>
            )}

            {/* Acciones del header */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  {/* Badge de rol en móvil */}
                  {isAdmin && (
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 border border-amber-300">
                      <span className="text-xs font-semibold text-amber-700">
                        ADMIN
                      </span>
                    </div>
                  )}
                  {/* Usuario - solo icono en móvil */}
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#002f19" }}
                    >
                      <FaUser className="text-white text-xs" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate hidden sm:inline">
                      {user?.nombre || user?.email?.split("@")[0] || "Usuario"}
                    </span>
                  </div>
                  {/* Botón salir - solo icono en móvil */}
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Cerrar sesión"
                  >
                    <FaSignOutAlt />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors"
                    style={{ color: "#002f19" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.8")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Ingresar
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm hover:opacity-90"
                    style={{ backgroundColor: "#002f19" }}
                  >
                    Crear cuenta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Header para pantallas grandes - con búsqueda y más contenido */}
      {isAuthenticated && (
        <header className="hidden lg:block fixed top-0 left-80 right-0 h-16 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            {/* Búsqueda principal */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar productos en la tienda..."
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg transition-all bg-gray-50 hover:bg-white"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#002f19";
                    e.target.style.boxShadow = "0 0 0 2px rgba(0, 47, 25, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "";
                    e.target.style.boxShadow = "";
                  }}
                />
              </div>
            </form>

            {/* Acciones del header - Mejorado con más elementos */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Badge de rol */}
              {isAdmin && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm hover:shadow-md transition-all">
                  <FaCrown className="text-amber-600 text-xs" />
                  <span className="text-xs font-semibold text-amber-700">
                    ADMIN
                  </span>
                </div>
              )}
              {/* Botón Tienda rápida */}
              <Link
                to="/shop"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all hover:scale-105 active:scale-95 group hover:bg-gray-50"
                style={{ color: "#002f19" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#002f19";
                  e.currentTarget.style.backgroundColor = "#e8f5e8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#002f19";
                  e.currentTarget.style.backgroundColor = "";
                }}
                title="Ir a la tienda"
              >
                <FaShoppingBag className="group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Tienda</span>
              </Link>
              {/* Botón Dashboard */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all hover:scale-105 active:scale-95 group hover:bg-gray-50"
                style={{ color: "#002f19" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#002f19";
                  e.currentTarget.style.backgroundColor = "#e8f5e8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#002f19";
                  e.currentTarget.style.backgroundColor = "";
                }}
                title="Panel de control"
              >
                <FaChartLine className="group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Panel</span>
              </Link>
              {/* Usuario - Compacto */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 transition-all cursor-pointer group border border-gray-200 hover:border-[#002f19]"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e8f5e8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-110"
                  style={{ backgroundColor: "#002f19" }}
                >
                  <FaUser className="text-white text-xs" />
                </div>
                <span
                  className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden xl:inline transition-colors"
                  style={{ color: "#002f19" }}
                >
                  {user?.nombre || user?.email?.split("@")[0] || "Usuario"}
                </span>
              </div>
              {/* Botón salir */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-105 active:scale-95 group border border-transparent hover:border-red-200"
                title="Cerrar sesión"
              >
                <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Salir</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Overlay oscuro cuando el sidebar está abierto (solo móvil) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: Fijo en pantallas grandes, deslizable en pequeñas */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          // En pantallas grandes siempre visible, en pequeñas solo cuando está abierto
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header del sidebar - Mejorado con más información */}
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200"
          style={{ backgroundColor: "#002f19" }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <FaUser className="text-white text-lg" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-white font-semibold text-sm truncate">
                {isAuthenticated
                  ? user?.nombre || user?.email?.split("@")[0] || "Usuario"
                  : "Invitado"}
              </span>
              {isAuthenticated && user?.email && (
                <span className="text-white/80 text-xs truncate">
                  {user.email}
                </span>
              )}
              {isAuthenticated && isAdmin && (
                <span className="text-white/90 text-xs font-medium mt-1 px-2 py-0.5 bg-white/20 rounded-full inline-block w-fit">
                  Administrador
                </span>
              )}
            </div>
          </div>
          {/* Botón cerrar solo visible en móvil */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-all text-white active:scale-95 flex-shrink-0"
            aria-label="Cerrar menú"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Contenido del sidebar */}
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto sidebar-scroll">
          {isAuthenticated ? (
            <>
              {/* Menú de navegación */}
              <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all no-underline group active:scale-95 ${
                        active
                          ? "text-white shadow-lg scale-[1.02]"
                          : "text-gray-700 hover:bg-gray-100 hover:scale-[1.01]"
                      }`}
                      style={
                        active
                          ? { backgroundColor: "#002f19" }
                          : { color: "#002f19" }
                      }
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.color = "#002f19";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.color = "#002f19";
                        }
                      }}
                    >
                      <Icon
                        className={`text-lg ${active ? "text-white" : ""}`}
                        style={active ? {} : { color: "#002f19" }}
                      />
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer del sidebar */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Bienvenido
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Inicia sesión para acceder a todas las funcionalidades
                </p>
              </div>
              <Link
                to="/login"
                onClick={() => setSidebarOpen(false)}
                className="w-full px-4 py-3 text-white rounded-xl font-medium text-center transition-all shadow-sm no-underline hover:opacity-90"
                style={{ backgroundColor: "#002f19" }}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setSidebarOpen(false)}
                className="w-full px-4 py-3 border-2 rounded-xl font-medium text-center transition-all no-underline hover:bg-gray-50"
                style={{ borderColor: "#002f19", color: "#002f19" }}
              >
                Crear Cuenta
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
