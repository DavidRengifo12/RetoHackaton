// Componente de navegación
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
} from "react-icons/fa";

const Navbar = () => {
  const { user, signOut, isAuthenticated, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Cerrar el menú cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      setIsOpen(false);
      navigate("/login");
    }
  };

  return (
    <nav
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
      ref={navbarRef}
    >
      <div className="container-fluid px-3 px-md-4">
        <div className="flex items-center justify-between w-full py-4">
          <Link
            className="flex items-center gap-2 text-white text-xl font-bold no-underline hover:text-blue-100 transition-colors"
            to="/"
            onClick={() => setIsOpen(false)}
          >
            <FaChartLine className="text-2xl" />
            Sistema de Inventario
          </Link>

          {/* Menú hamburguesa - Solo visible en móvil/tablet */}
          <button
            className="lg:hidden text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            {isOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>

          {/* Menú desplegable - Solo visible en móvil/tablet */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl lg:hidden z-50">
              <div className="px-4 py-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      className="flex items-center gap-3 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors no-underline"
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaChartLine />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          className="flex items-center gap-3 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors no-underline"
                          to="/inventory"
                          onClick={() => setIsOpen(false)}
                        >
                          <FaBox />
                          Inventario
                        </Link>
                        <Link
                          className="flex items-center gap-3 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors no-underline"
                          to="/upload"
                          onClick={() => setIsOpen(false)}
                        >
                          <FaUpload />
                          Cargar Datos
                        </Link>
                      </>
                    )}
                    <Link
                      className="flex items-center gap-3 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors no-underline"
                      to="/shop"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaShoppingBag />
                      Tienda
                    </Link>
                    <Link
                      className="flex items-center gap-3 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors no-underline"
                      to="/agents"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaRobot />
                      Agentes
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          className="flex items-center gap-3 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors no-underline"
                          to="/admin/users"
                          onClick={() => setIsOpen(false)}
                        >
                          <FaUsers />
                          Usuarios
                        </Link>
                        <Link
                          className="flex items-center gap-3 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors no-underline"
                          to="/products/add"
                          onClick={() => setIsOpen(false)}
                        >
                          <FaPlus />
                          Agregar Producto
                        </Link>
                      </>
                    )}
                    <div className="border-t border-white/20 my-3 pt-3">
                      <div className="flex items-center gap-3 text-white/80 py-2 px-4">
                        <FaUser />
                        <span className="text-sm">
                          {user?.nombre || user?.email}
                        </span>
                      </div>
                      <button
                        className="flex items-center gap-3 w-full text-white py-3 px-4 rounded-xl hover:bg-red-500/20 transition-colors border border-white/30 mt-2"
                        onClick={handleSignOut}
                      >
                        <FaSignOutAlt />
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    className="flex items-center gap-3 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors no-underline"
                    to="/login"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser />
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Barra de usuario - Solo visible en pantallas grandes */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                className="flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors no-underline text-sm font-medium"
                to="/dashboard"
              >
                <FaChartLine />
                Dashboard
              </Link>
              {isAdmin && (
                <>
                  <Link
                    className="flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors no-underline text-sm font-medium"
                    to="/inventory"
                  >
                    <FaBox />
                    Inventario
                  </Link>
                  <Link
                    className="flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors no-underline text-sm font-medium"
                    to="/upload"
                  >
                    <FaUpload />
                    Cargar Datos
                  </Link>
                </>
              )}
              <Link
                className="flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors no-underline text-sm font-medium"
                to="/shop"
              >
                <FaShoppingBag />
                Tienda
              </Link>
              <Link
                className="flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors no-underline text-sm font-medium"
                to="/agents"
              >
                <FaRobot />
                Agentes
              </Link>
              {isAdmin && (
                <>
                  <Link
                    className="flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors no-underline text-sm font-medium"
                    to="/admin/users"
                  >
                    <FaUsers />
                    Usuarios
                  </Link>
                  <Link
                    className="flex items-center gap-2 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors no-underline text-sm font-medium"
                    to="/products/add"
                  >
                    <FaPlus />
                    Producto
                  </Link>
                </>
              )}
              <div className="flex items-center gap-3 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaUser className="text-sm" />
                <span className="text-sm font-medium">
                  {user?.nombre || user?.email}
                </span>
              </div>
              <button
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors border border-white/30 text-sm font-medium"
                onClick={handleSignOut}
              >
                <FaSignOutAlt />
                Salir
              </button>
            </div>
          )}
          {!isAuthenticated && (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                className="text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors no-underline text-sm font-medium"
                to="/login"
              >
                Iniciar Sesión
              </Link>
              <Link
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors no-underline text-sm font-medium"
                to="/register"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
