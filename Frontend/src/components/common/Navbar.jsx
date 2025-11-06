// Componente de navegación
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      setIsOpen(false);
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary" ref={navbarRef}>
      <div className="container-fluid px-3 px-md-4">
        <Link className="navbar-brand fw-bold" to="/" onClick={() => setIsOpen(false)}>
          📊 Sistema de Inventario
        </Link>
        
        {/* Menú hamburguesa - Solo visible en móvil/tablet */}
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Menú desplegable - Solo visible en móvil/tablet */}
        <div className={`collapse navbar-collapse d-lg-none ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link py-2" 
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link py-2" 
                    to="/inventory"
                    onClick={() => setIsOpen(false)}
                  >
                    📦 Inventario
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link py-2" 
                    to="/upload"
                    onClick={() => setIsOpen(false)}
                  >
                    📤 Cargar Datos
                  </Link>
                </li>
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link 
                        className="nav-link py-2" 
                        to="/admin/users"
                        onClick={() => setIsOpen(false)}
                      >
                        👥 Usuarios
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className="nav-link py-2" 
                        to="/products/add"
                        onClick={() => setIsOpen(false)}
                      >
                        ➕ Agregar Producto
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <span className="nav-link text-white-50 py-2">
                    <small>{user?.nombre || user?.email}</small>
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm w-100 mt-2"
                    onClick={handleSignOut}
                  >
                    🚪 Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Barra de usuario - Solo visible en pantallas grandes */}
        {isAuthenticated && (
          <div className="d-none d-lg-flex align-items-center ms-auto">
            <Link className="nav-link text-white me-2" to="/dashboard">
              📊 Dashboard
            </Link>
            <Link className="nav-link text-white me-2" to="/inventory">
              📦 Inventario
            </Link>
            <Link className="nav-link text-white me-2" to="/upload">
              📤 Cargar Datos
            </Link>
            {isAdmin && (
              <>
                <Link className="nav-link text-white me-2" to="/admin/users">
                  👥 Usuarios
                </Link>
                <Link className="nav-link text-white me-2" to="/products/add">
                  ➕ Producto
                </Link>
              </>
            )}
            <span className="nav-link text-white-50 mb-0 me-3">
              {user?.nombre || user?.email}
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleSignOut}
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

