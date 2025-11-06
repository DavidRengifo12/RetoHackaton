import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import UploadPage from "./pages/UploadPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AddProductPage from "./pages/AddProductPage";
import LandingPage from "./pages/LandingPage";
import ShopPage from "./pages/ShopPage";
import ChatInventario from "./components/Chat/ChatInventario";
import ChatAnalista from "./components/Chat/ChatAnalista";
import ChatMCP from "./components/Chat/ChatMcp";
import ChatCliente from "./components/Chat/ChatCliente";
import AgentsPage from "./pages/AgentsPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

// Componente para rutas protegidas - debe estar dentro de AuthProvider
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Componente para rutas solo de administrador
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Componente principal con Router - debe estar dentro de AuthProvider
function AppRouter() {
  const { isAuthenticated } = useAuthContext();

  return (
    <Router>
      <ErrorBoundary>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <AdminRoute>
                <InventoryPage />
              </AdminRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <AdminRoute>
                <UploadPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <AgentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
