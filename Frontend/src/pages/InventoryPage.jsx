// Página de inventario
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency, formatPercentage, getRotationBadge } from '../utils/helpers';
import Loading from '../components/common/Loading';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);

  const filters = {
    search: searchTerm,
    category: categoryFilter,
    gender: genderFilter,
  };

  const { products, loading, error, refreshProducts } = useProducts(filters);

  useEffect(() => {
    // Extraer categorías y géneros únicos de los productos
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.categoria).filter(Boolean))];
      const uniqueGenders = [...new Set(products.map(p => p.genero).filter(Boolean))];
      setCategories(uniqueCategories);
      setGenders(uniqueGenders);
    }
  }, [products]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setGenderFilter('');
  };

  if (loading) return <Loading message="Cargando inventario..." />;
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error al cargar productos: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-4">📦 Gestión de Inventario</h1>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">Todos los géneros</option>
            {genders.map(gen => (
              <option key={gen} value={gen}>{gen}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={handleClearFilters}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-custom">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Talla</th>
                      <th>Género</th>
                      <th>Stock</th>
                      <th>Precio</th>
                      <th>Ventas</th>
                      <th>Rotación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-4">
                          No se encontraron productos
                        </td>
                      </tr>
                    ) : (
                      products.map(product => (
                        <tr key={product.id}>
                          <td>{product.nombre}</td>
                          <td>
                            <span className="badge bg-secondary">{product.categoria || 'N/A'}</span>
                          </td>
                          <td>{product.talla || 'N/A'}</td>
                          <td>{product.genero || 'N/A'}</td>
                          <td>
                            <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                              {product.stock || 0}
                            </span>
                          </td>
                          <td>{formatCurrency(product.precio || 0)}</td>
                          <td>{product.total_ventas || 0}</td>
                          <td>
                            <span className={`badge ${getRotationBadge(product.porcentaje_rotacion || 0)}`}>
                              {formatPercentage(product.porcentaje_rotacion || 0)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
