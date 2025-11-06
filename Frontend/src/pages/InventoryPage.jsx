// Página de inventario
import { useState, useEffect, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import {
  formatCurrency,
  formatPercentage,
  getRotationBadge,
} from "../utils/helpers";
import { storageService } from "../services/storageService";
import Loading from "../components/common/Loading";
import { FaBox, FaSearch } from "react-icons/fa";

// Lista completa de géneros disponibles
const AVAILABLE_GENDERS = ["Hombre", "Mujer", "Unisex", "Niño", "Niña"];

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Cargar todos los productos una sola vez (sin filtros)
  const { products: allProducts, loading, error } = useProducts({});

  // Extraer categorías únicas de los productos
  const categories = useMemo(() => {
    if (allProducts.length > 0) {
      return [
        ...new Set(allProducts.map((p) => p.categoria).filter(Boolean)),
      ].sort();
    }
    return [];
  }, [allProducts]);

  // Filtrar productos localmente basado en los filtros
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filtro por búsqueda (nombre)
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        p.nombre?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categoría
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.categoria === categoryFilter);
    }

    // Filtro por género
    if (genderFilter) {
      filtered = filtered.filter((p) => p.genero === genderFilter);
    }

    return filtered;
  }, [allProducts, debouncedSearchTerm, categoryFilter, genderFilter]);

  // Debounce para la búsqueda (esperar 300ms después de que el usuario deje de escribir)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCategoryFilter("");
    setGenderFilter("");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container-fluid px-4 py-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <FaBox className="mr-3" />
            Gestión de Inventario
          </h1>
          <p className="text-blue-100 text-lg">
            Control total de tu stock de productos
          </p>
        </div>
      </div>

      <div className="container-fluid px-4 py-6">
        {/* Filtros y búsqueda */}
        <div className="row mb-6 g-3">
          <div className="col-12 col-sm-6 col-md-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="input-group border-0">
                <span className="input-group-text bg-blue-50 border-0">
                  <FaSearch className="text-blue-600" />
                </span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <select
              className="form-select border-2 border-gray-200 rounded-xl shadow-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <select
              className="form-select border-2 border-gray-200 rounded-xl shadow-sm"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">Todos los géneros</option>
              {AVAILABLE_GENDERS.map((gen) => (
                <option key={gen} value={gen}>
                  {gen}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-2">
            <button
              className="btn btn-outline-secondary w-100 rounded-xl font-semibold"
              onClick={handleClearFilters}
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="row">
          <div className="col-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="table-responsive">
                  <table className="table table-hover table-custom">
                    <thead>
                      <tr>
                        <th style={{ width: "200px" }}>Nombre</th>
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
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center text-muted py-4"
                          >
                            {loading
                              ? "Cargando productos..."
                              : "No se encontraron productos"}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {/* Imagen del producto */}
                                <div
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    flexShrink: 0,
                                    backgroundColor: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {product.imagen_url ? (
                                    <img
                                      src={
                                        storageService.getProductImageUrl(
                                          product
                                        ) || product.imagen_url
                                      }
                                      alt={product.nombre}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                          "flex";
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    style={{
                                      display: product.imagen_url
                                        ? "none"
                                        : "flex",
                                      width: "100%",
                                      height: "100%",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#999",
                                      fontSize: "20px",
                                    }}
                                  >
                                    📦
                                  </div>
                                </div>
                                <span>{product.nombre}</span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-secondary">
                                {product.categoria || "N/A"}
                              </span>
                            </td>
                            <td>{product.talla || "N/A"}</td>
                            <td>{product.genero || "N/A"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  product.stock > 10
                                    ? "bg-success"
                                    : product.stock > 0
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}
                              >
                                {product.stock || 0}
                              </span>
                            </td>
                            <td>{formatCurrency(product.precio || 0)}</td>
                            <td>{product.total_ventas || 0}</td>
                            <td>
                              <span
                                className={`badge ${getRotationBadge(
                                  product.porcentaje_rotacion || 0
                                )}`}
                              >
                                {formatPercentage(
                                  product.porcentaje_rotacion || 0
                                )}
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
    </div>
  );
};

export default InventoryPage;
