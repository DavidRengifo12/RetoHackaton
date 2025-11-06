// Página de registro
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toastService } from '../utils/toastService';
import { FaUser, FaUserTie, FaEnvelope, FaLock, FaCheck } from 'react-icons/fa';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar contraseñas
    if (password !== confirmPassword) {
      toastService.error('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toastService.error('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.signUp(email, password, nombreCompleto);
      if (!result.error) {
        // El toast ya se muestra desde authService
        // Redirigir al login después del registro
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      // El error ya se maneja con toast desde authService
    } catch (err) {
      toastService.error(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="mb-3 d-flex justify-content-center">
              <FaUser size={48} style={{ color: '#002f19' }} />
            </div>
            <h2 className="card-title mb-0">Registro de Usuario</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombreCompleto" className="form-label d-flex align-items-center">
                <FaUserTie className="me-2" style={{ color: '#002f19' }} />
                Nombre Completo
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreCompleto"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                disabled={loading}
                placeholder="Juan Pérez"
              />
            </div>

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
                minLength={6}
                disabled={loading}
                placeholder="••••••••"
              />
              <small className="form-text text-muted">
                Mínimo 6 caracteres
              </small>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label d-flex align-items-center">
                <FaLock className="me-2" style={{ color: '#002f19' }} />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span>Registrando...</span>
                </span>
              ) : (
                <span className="d-flex align-items-center">
                  <FaCheck className="me-2" />
                  <span>Registrarse</span>
                </span>
              )}
            </button>

            <div className="text-center">
              <p className="mb-0">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" style={{ color: '#002f19' }}>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

