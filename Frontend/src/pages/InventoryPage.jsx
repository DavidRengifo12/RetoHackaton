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
import {
  FaBox,
  FaSearch,
  FaBoxOpen,
  FaTag,
  FaRuler,
  FaUser,
  FaWarehouse,
  FaDollarSign,
  FaChartLine,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

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
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)",
      }}
    >
      {/* Header Moderno Mejorado */}
      <div
        className="text-white shadow-xl position-relative overflow-hidden"
        style={{
          background: "linear-gradient(to right, #2563eb, #4f46e5, #9333ea)",
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{
            top: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        ></div>
        <div
          className="container-fluid px-4 py-4 position-relative"
          style={{ zIndex: 10 }}
        >
          <div
            className="d-flex align-items-center mb-2"
            style={{ gap: "1rem" }}
          >
            <div
              className="rounded-3 shadow-lg d-flex align-items-center justify-content-center"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <FaWarehouse
                className="text-white"
                style={{ fontSize: "2rem" }}
              />
            </div>
            <div>
              <h1 className="text-4xl fw-bold mb-1 d-flex align-items-center">
                Gestión de Inventario
              </h1>
              <p
                className="text-lg d-flex align-items-center mb-0"
                style={{ color: "#bfdbfe", gap: "0.5rem" }}
              >
                <FaBox style={{ fontSize: "0.875rem" }} />
                Control total de tu stock de productos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-6">
        {/* Filtros y búsqueda mejorados */}
        <div
          className="bg-white rounded-3 shadow-lg p-4 mb-4 border"
          style={{ borderColor: "#f3f4f6" }}
        >
          <div
            className="d-flex align-items-center mb-3"
            style={{ gap: "0.5rem" }}
          >
            <FaFilter
              className="text-primary"
              style={{ fontSize: "1.125rem" }}
            />
            <h2 className="text-xl fw-semibold text-dark mb-0">
              Filtros de Búsqueda
            </h2>
          </div>
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-md-4">
              <label className="form-label text-sm fw-medium text-dark mb-2">
                Buscar Producto
              </label>
              <div
                className="rounded-3 shadow-sm border overflow-hidden"
                style={{
                  backgroundColor: "#f9fafb",
                  borderColor: "#e5e7eb",
                }}
              >
                <div className="input-group border-0">
                  <span
                    className="input-group-text border-0"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #dbeafe, #e0e7ff)",
                    }}
                  >
                    <FaSearch className="text-primary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <label
                className="form-label text-sm fw-medium text-dark mb-2 d-flex align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <FaTag
                  className="text-primary"
                  style={{ fontSize: "0.75rem" }}
                />
                Categoría
              </label>
              <select
                className="form-select border-2 rounded-3 shadow-sm"
                style={{ borderColor: "#e5e7eb" }}
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
              <label
                className="form-label text-sm fw-medium text-dark mb-2 d-flex align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <FaUser
                  className="text-primary"
                  style={{ fontSize: "0.75rem" }}
                />
                Género
              </label>
              <select
                className="form-select border-2 rounded-3 shadow-sm"
                style={{ borderColor: "#e5e7eb" }}
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
            <div className="col-12 col-sm-6 col-md-2 d-flex align-items-end">
              <button
                className="btn btn-outline-danger w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center"
                style={{ gap: "0.5rem" }}
                onClick={handleClearFilters}
              >
                <FaTimes style={{ fontSize: "0.875rem" }} />
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de productos mejorada */}
        <div className="row">
          <div className="col-12">
            <div
              className="bg-white rounded-3 shadow-lg overflow-hidden border"
              style={{ borderColor: "#f3f4f6" }}
            >
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3
                    className="text-xl fw-semibold text-dark mb-0 d-flex align-items-center"
                    style={{ gap: "0.5rem" }}
                  >
                    <FaBox className="text-primary" />
                    Productos ({filteredProducts.length})
                  </h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr
                        style={{
                          background:
                            "linear-gradient(to right, #f9fafb, #f3f4f6)",
                        }}
                      >
                        <th className="border-0 py-3 px-4 text-dark fw-semibold text-sm text-uppercase">
                          Producto
                        </th>
                        <th className="border-0 py-3 px-4 text-dark fw-semibold text-sm text-uppercase">
                          <FaTag className="d-inline me-1" />
                          Categoría
                        </th>
                        <th className="border-0 py-3 px-4 text-dark fw-semibold text-sm text-uppercase">
                          <FaRuler className="d-inline me-1" />
                          Talla
                        </th>
                        <th className="border-0 py-3 px-4 text-dark fw-semibold text-sm text-uppercase">
                          <FaUser className="d-inline me-1" />
                          Género
                        </th>
                        <th className="border-0 py-3 px-4 text-dark fw-semibold text-sm text-uppercase">
                          <FaWarehouse className="d-inline me-1" />
                          Stock
                        </th>
                        <th className="border-0 py-3 px-4 text-dark fw-semibold text-sm text-uppercase">
                          <FaDollarSign className="d-inline me-1" />
                          Precio
                        </th>
                        <th className="border-0 py-3 px-4 text-dark fw-semibold text-sm text-uppercase">
                          Ventas
                        </th>
                        <th className="border-0 py-3 px-4 text-dark fw-semibold text-sm text-uppercase">
                          <FaChartLine className="d-inline me-1" />
                          Rotación
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center text-muted py-5"
                          >
                            <div
                              className="d-flex flex-column align-items-center"
                              style={{ gap: "0.5rem" }}
                            >
                              <FaBoxOpen
                                style={{ fontSize: "3rem", color: "#d1d5db" }}
                              />
                              <span className="text-lg">
                                {loading
                                  ? "Cargando productos..."
                                  : "No se encontraron productos"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product, index) => (
                          <tr
                            key={product.id}
                            className="border-bottom"
                            style={{
                              borderColor: "#f3f4f6",
                              animation: `fadeIn 0.3s ease-in ${
                                index * 0.05
                              }s both`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#eff6ff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            <td className="py-3 px-4">
                              <div
                                className="d-flex align-items-center"
                                style={{ gap: "0.75rem" }}
                              >
                                {/* Imagen del producto mejorada */}
                                <div
                                  className="position-relative"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    flexShrink: 0,
                                    backgroundColor: "#f8f9fa",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid #e9ecef",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
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
                                        if (e.target.nextSibling) {
                                          e.target.nextSibling.style.display =
                                            "flex";
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                      display: product.imagen_url
                                        ? "none"
                                        : "flex",
                                      width: "100%",
                                      height: "100%",
                                      background:
                                        "linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)",
                                    }}
                                  >
                                    <FaBoxOpen
                                      className="text-secondary"
                                      style={{ fontSize: "24px" }}
                                    />
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fw-semibold text-dark mb-1">
                                    {product.nombre}
                                  </div>
                                  {product.descripcion && (
                                    <div
                                      className="text-muted small text-truncate"
                                      style={{ maxWidth: "200px" }}
                                    >
                                      {product.descripcion}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className="badge px-3 py-1 rounded-3 fw-medium d-inline-flex align-items-center border"
                                style={{
                                  background:
                                    "linear-gradient(to right, #e0e7ff, #f3e8ff)",
                                  color: "#4c1d95",
                                  borderColor: "#c4b5fd",
                                  gap: "0.25rem",
                                }}
                              >
                                <FaTag style={{ fontSize: "0.75rem" }} />
                                {product.categoria || "N/A"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className="badge px-3 py-1 rounded-3 fw-medium d-inline-flex align-items-center"
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  color: "#374151",
                                  gap: "0.25rem",
                                }}
                              >
                                <FaRuler style={{ fontSize: "0.75rem" }} />
                                {product.talla || "N/A"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className="badge px-3 py-1 rounded-3 fw-medium d-inline-flex align-items-center border"
                                style={{
                                  backgroundColor: "#dbeafe",
                                  color: "#1e40af",
                                  borderColor: "#93c5fd",
                                  gap: "0.25rem",
                                }}
                              >
                                <FaUser style={{ fontSize: "0.75rem" }} />
                                {product.genero || "N/A"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`badge px-3 py-1 rounded-3 fw-semibold d-inline-flex align-items-center ${
                                  product.stock > 10
                                    ? "bg-success text-white"
                                    : product.stock > 0
                                    ? "bg-warning text-dark"
                                    : "bg-danger text-white"
                                }`}
                                style={{ gap: "0.25rem" }}
                              >
                                <FaWarehouse style={{ fontSize: "0.75rem" }} />
                                {product.stock || 0}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className="fw-semibold text-dark d-inline-flex align-items-center"
                                style={{ gap: "0.25rem" }}
                              >
                                <FaDollarSign
                                  className="text-success"
                                  style={{ fontSize: "0.875rem" }}
                                />
                                {formatCurrency(product.precio || 0)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="badge bg-info text-white px-3 py-1 rounded-3 fw-medium">
                                {product.total_ventas || 0}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`badge px-3 py-1 rounded-3 fw-medium d-inline-flex align-items-center ${getRotationBadge(
                                  product.porcentaje_rotacion || 0
                                )}`}
                                style={{ gap: "0.25rem" }}
                              >
                                <FaChartLine style={{ fontSize: "0.75rem" }} />
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
