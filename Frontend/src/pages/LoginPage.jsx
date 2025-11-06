// Página de login
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { toastService } from '../utils/toastService';
import { FaLock, FaEnvelope, FaRocket } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, signIn } = useAuthContext();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usar signIn del contexto para mantener sincronización
      const result = await signIn(email, password);
      if (result.success) {
        // El toast ya se muestra desde authService
        // Esperar un momento para que el estado se actualice completamente
        setTimeout(() => {
          navigate('/dashboard');
        }, 200);
      } else {
        setLoading(false);
      }
    } catch (err) {
      toastService.error(err.message || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="mb-3 d-flex justify-content-center">
              <FaLock size={48} style={{ color: '#002f19' }} />
            </div>
            <h2 className="card-title mb-0">Iniciar Sesión</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label d-flex align-items-center">
                <FaEnvelope className="me-2" style={{ color: '#002f19' }} />
                Correo Electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="tu@email.com"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label d-flex align-items-center">
                <FaLock className="me-2" style={{ color: '#002f19' }} />
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-center"
              disabled={loading}
              style={{ backgroundColor: '#002f19', borderColor: '#002f19' }}
            >
              {loading ? (
                <span className="d-flex align-items-center">
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span>Iniciando sesión...</span>
                </span>
              ) : (
                <span className="d-flex align-items-center">
                  <FaRocket className="me-2" />
                  <span>Iniciar Sesión</span>
                </span>
              )}
            </button>

            <div className="text-center">
              <p className="mb-0">
                ¿No tienes cuenta?{' '}
                <Link to="/register" style={{ color: '#002f19' }}>
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
