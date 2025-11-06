// Landing Page principal del sistema
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <div style={{ backgroundColor: '#002f19', minHeight: '100vh' }}>
      {/* Header/Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#002f19' }}>
        <div className="container">
          <Link className="navbar-brand text-white fw-bold" to="/" style={{ fontSize: '1.5rem' }}>
            📊 Sistema de Inventario
          </Link>
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn text-white me-2">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn text-white me-2">
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="btn text-white"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderRadius: '8px'
                  }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5" style={{ backgroundColor: '#002f19', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="mb-3">
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  Empoderando Posibilidades Digitales
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-4">
                Soluciones Innovadoras de IT Adaptadas para Empresas Modernas
              </h1>
              <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Sistema completo de gestión de inventario y análisis de ventas diseñado para optimizar tus operaciones y maximizar tus resultados.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="btn btn-lg text-white"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderRadius: '8px'
                  }}
                >
                  Obtener Sesión Estratégica Gratuita
                </Link>
                <button 
                  className="btn btn-lg text-white"
                  style={{ 
                    backgroundColor: 'transparent', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '8px'
                  }}
                >
                  ▶ Ver Cómo Funciona
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div 
                className="rounded"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '2rem',
                  borderRadius: '12px'
                }}
              >
                <div className="text-center" style={{ fontSize: '8rem' }}>
                  📊
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-5" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="text-center mb-5">
            <small className="text-uppercase text-muted">SOBRE NOSOTROS</small>
            <h2 className="display-5 fw-bold mt-2" style={{ color: '#002f19' }}>
              Impulsados por la Tecnología, Enfocados en Resultados
            </h2>
            <p className="lead text-muted">
              Un enfoque visionario para transformar la gestión de inventario y ventas
            </p>
          </div>

          <div className="row g-4 mt-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>💻</div>
                  <h5 className="fw-bold" style={{ color: '#002f19' }}>
                    Desarrollo de Software Personalizado
                  </h5>
                  <p className="text-muted">
                    Soluciones adaptadas a las necesidades específicas de tu negocio
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>☁️</div>
                  <h5 className="fw-bold" style={{ color: '#002f19' }}>
                    Integración en la Nube y Seguridad
                  </h5>
                  <p className="text-muted">
                    Infraestructura segura y escalable para tus datos
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>📈</div>
                  <h5 className="fw-bold" style={{ color: '#002f19' }}>
                    Soluciones de Software Sin Fricciones
                  </h5>
                  <p className="text-muted">
                    Procesos optimizados con un 85% de eficiencia
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="btn btn-lg text-white"
              style={{ 
                backgroundColor: '#002f19', 
                borderColor: '#002f19',
                borderRadius: '8px'
              }}
            >
              Explorar Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5" style={{ backgroundColor: '#002f19', color: 'white' }}>
        <div className="container">
          <h2 className="text-center display-5 fw-bold mb-5">
            Servicios Digitales Poderosos que Generan Resultados
          </h2>
          <div className="row g-4">
            {[
              { icon: '📦', title: 'Gestión de Inventario', desc: '10+' },
              { icon: '📊', title: 'Análisis de Datos', desc: '10+' },
              { icon: '🤖', title: 'IA y Machine Learning', desc: '10+' },
              { icon: '💳', title: 'Soluciones E-commerce', desc: '10+' },
              { icon: '📱', title: 'Desarrollo IoT', desc: '10+' },
              { icon: '🛠️', title: 'Soporte Técnico', desc: '10+' },
            ].map((service, idx) => (
              <div key={idx} className="col-md-4">
                <div 
                  className="p-4 rounded"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    height: '100%'
                  }}
                >
                  <div className="mb-3" style={{ fontSize: '2.5rem' }}>{service.icon}</div>
                  <h5 className="fw-bold">{service.title}</h5>
                  <p className="text-muted mb-0">{service.desc} proyectos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-5" style={{ backgroundColor: 'rgba(0,47,25,0.95)' }}>
        <div className="container text-center text-white">
          <small className="text-uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Los Desafíos que Abrazamos
          </small>
          <h2 className="display-4 fw-bold mt-3 mb-4">
            Convirtiendo Obstáculos en Innovación
          </h2>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Transformamos los desafíos más complejos en oportunidades de crecimiento y mejora continua
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ backgroundColor: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4" style={{ color: '#002f19' }}>
            No Dudes en Colaborar con Nosotros
          </h2>
          <p className="lead text-muted mb-4">
            Comienza a optimizar tu gestión de inventario hoy mismo
          </p>
          <Link 
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="btn btn-lg text-white"
            style={{ 
              backgroundColor: '#002f19', 
              borderColor: '#002f19',
              borderRadius: '8px',
              padding: '1rem 2rem'
            }}
          >
            Contactarnos
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4" style={{ backgroundColor: '#002f19', color: 'white' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
              <h5 className="fw-bold mb-3">Sistema de Inventario</h5>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Somos una Agencia Tecnológica Global Construyendo Marcas Digitales Primero
              </p>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <h5 className="fw-bold mb-3">Compañía</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white text-decoration-none">Inicio</Link></li>
                <li><Link to="/login" className="text-white text-decoration-none">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="text-white text-decoration-none">Registrarse</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold mb-3">Industrias</h5>
              <ul className="list-unstyled">
                <li><span style={{ color: 'rgba(255,255,255,0.8)' }}>Retail</span></li>
                <li><span style={{ color: 'rgba(255,255,255,0.8)' }}>Finanzas</span></li>
                <li><span style={{ color: 'rgba(255,255,255,0.8)' }}>Salud</span></li>
                <li><span style={{ color: 'rgba(255,255,255,0.8)' }}>Manufactura</span></li>
              </ul>
            </div>
          </div>
          <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
          <div className="text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <p className="mb-0">&copy; {new Date().getFullYear()} Sistema de Inventario. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

