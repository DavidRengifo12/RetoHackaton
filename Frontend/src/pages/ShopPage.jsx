// Página de tienda para usuarios - con tarjetas de productos y carrito
import { useState, useEffect, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { useAuthContext } from "../context/AuthContext";
import { cartService } from "../services/cartService";
import { paymentService } from "../services/paymentService";
import { formatCurrency } from "../utils/helpers";

import CartModal from "../components/shop/CartModal";
import PaymentModal from "../components/shop/PaymentModal";
import Loading from "../components/common/Loading";
import { FaShoppingCart, FaSearch, FaWallet, FaBox } from "react-icons/fa";
import { toastService } from "../utils/toastService";

const ShopPage = () => {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [loadingSaldo, setLoadingSaldo] = useState(true);

  const { products: allProducts, loading, error } = useProducts({});

  // Cargar carrito y saldo al iniciar
  useEffect(() => {
    if (user?.id) {
      loadCart();
      loadSaldo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Cargar carrito
  const loadCart = async () => {
    if (!user?.id) return;

    const { data: cart, error: cartError } = await cartService.getOrCreateCart(
      user.id
    );

    if (cartError) {
      console.error("Error al cargar carrito:", cartError);
      return;
    }

    setCartId(cart.id);

    const { data: items, error: itemsError } = await cartService.getCartItems(
      cart.id
    );

    if (itemsError) {
      console.error("Error al cargar items:", itemsError);
      return;
    }

    setCartItems(items || []);
  };

  // Cargar saldo
  const loadSaldo = async () => {
    if (!user?.id) return;

    setLoadingSaldo(true);
    const { data, error } = await paymentService.getSaldoUsuario(user.id);

    if (error) {
      console.error("Error al cargar saldo:", error);
    } else {
      setSaldo(data || 0);
    }
    setLoadingSaldo(false);
  };

  // Extraer categorías únicas
  const categories = useMemo(() => {
    if (allProducts.length > 0) {
      return [
        ...new Set(allProducts.map((p) => p.categoria).filter(Boolean)),
      ].sort();
    }
    return [];
  }, [allProducts]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts].filter((p) => p.stock > 0 && p.activo);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        p.nombre?.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.categoria === categoryFilter);
    }

    if (genderFilter) {
      filtered = filtered.filter((p) => p.genero === genderFilter);
    }

    return filtered;
  }, [allProducts, searchTerm, categoryFilter, genderFilter]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, genderFilter]);

  // Agregar al carrito
  const handleAddToCart = async (product) => {
    if (!cartId) {
      toastService.error("Error: Carrito no disponible");
      return;
    }

    const { error } = await cartService.addToCart(cartId, product.id, 1);

    if (!error) {
      await loadCart();
      toastService.success(`${product.nombre} agregado al carrito`);
    }
  };

  // Calcular total del carrito
  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.precio_unitario * item.cantidad,
      0
    );
  }, [cartItems]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) return <Loading message="Cargando productos..." />;

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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container-fluid px-4 py-6">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🛍️ Tienda</h1>
              <p className="text-blue-100 text-lg">
                Explora nuestro catálogo de productos
              </p>
            </div>
            <div className="d-flex align-items-center gap-4">
              {!loadingSaldo && (
                <div className="bg-white/20 rounded-xl px-4 py-2 backdrop-blur-sm">
                  <div className="d-flex align-items-center gap-2">
                    <FaWallet />
                    <span className="font-semibold">
                      Saldo: {formatCurrency(saldo)}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowCart(true)}
                className="btn btn-light position-relative"
              >
                <FaShoppingCart className="me-2" />
                Carrito
                {cartItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-6">
        <div className="row">
          {/* Productos - Ocupan toda la pantalla */}
          <div className="col-12">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar productos..."
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
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
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
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Niño">Niño</option>
                    <option value="Niña">Niña</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("");
                      setGenderFilter("");
                      setCurrentPage(1);
                    }}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
              <div className="mt-3 text-muted">
                Mostrando {filteredProducts.length} producto(s)
              </div>
            </div>

            {/* Tarjetas de productos */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-5 text-center">
                <FaBox
                  className="text-muted mb-3"
                  style={{ fontSize: "4rem" }}
                />
                <h4 className="text-muted">No se encontraron productos</h4>
                <p className="text-muted">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            ) : (
              <>
                <div className="row g-4 mb-4">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="col-sm-6 col-md-4 col-lg-3 col-xl-2"
                    >
                      <div className="card h-100 shadow-sm border-0 product-card">
                        {/* Imagen del producto */}
                        <div
                          className="position-relative"
                          style={{
                            height: "250px",
                            overflow: "hidden",
                            backgroundColor: "#f8f9fa",
                            borderTopLeftRadius: "0.5rem",
                            borderTopRightRadius: "0.5rem",
                          }}
                        >
                          {product.imagen_url ? (
                            <>
                              <img
                                src={product.imagen_url}
                                alt={product.nombre}
                                className="w-100 h-100"
                                style={{
                                  objectFit: "cover",
                                  transition: "transform 0.3s ease",
                                }}
                                onError={(e) => {
                                  console.error(
                                    "Error al cargar imagen:",
                                    product.imagen_url
                                  );
                                  e.target.style.display = "none";
                                  const placeholder =
                                    e.target.parentElement.querySelector(
                                      ".image-placeholder"
                                    );
                                  if (placeholder) {
                                    placeholder.style.display = "flex";
                                  }
                                }}
                                onLoad={() => {
                                  console.log(
                                    "Imagen cargada exitosamente:",
                                    product.imombre
                                  );
                                }}
                              />
                              <div
                                className="image-placeholder w-100 h-100 d-flex align-items-center justify-content-center position-absolute top-0 start-0"
                                style={{
                                  display: "none",
                                  fontSize: "4rem",
                                  color: "#dee2e6",
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                <FaBox />
                              </div>
                            </>
                          ) : (
                            <div
                              className="w-100 h-100 d-flex align-items-center justify-content-center"
                              style={{
                                fontSize: "4rem",
                                color: "#dee2e6",
                              }}
                            >
                              <FaBox />
                            </div>
                          )}
                          {/* Badge de stock */}
                          <span
                            className={`position-absolute top-0 end-0 m-2 badge ${
                              product.stock > 10
                                ? "bg-success"
                                : product.stock > 0
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            Stock: {product.stock}
                          </span>
                        </div>

                        {/* Contenido de la tarjeta */}
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title mb-2">{product.nombre}</h5>
                          {product.descripcion && (
                            <p className="card-text text-muted small mb-2">
                              {product.descripcion.length > 80
                                ? `${product.descripcion.substring(0, 80)}...`
                                : product.descripcion}
                            </p>
                          )}

                          {/* Badges de información */}
                          <div className="mb-3 d-flex flex-wrap gap-2">
                            {product.categoria && (
                              <span className="badge bg-secondary">
                                {product.categoria}
                              </span>
                            )}
                            {product.talla && (
                              <span className="badge bg-info">
                                Talla: {product.talla}
                              </span>
                            )}
                            {product.genero && (
                              <span className="badge bg-primary">
                                {product.genero}
                              </span>
                            )}
                          </div>

                          {/* Precio y botón */}
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="h4 mb-0 text-primary fw-bold">
                                {formatCurrency(product.precio || 0)}
                              </span>
                            </div>
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                            >
                              <FaShoppingCart className="me-2" />
                              {product.stock === 0
                                ? "Sin Stock"
                                : "Agregar al Carrito"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <nav aria-label="Paginación de productos">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        // Mostrar solo algunas páginas alrededor de la actual
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </button>
                            </li>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <li key={page} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <CartModal
        show={showCart}
        onHide={() => setShowCart(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onUpdate={loadCart}
        onCheckout={() => {
          setShowCart(false);
          setShowPayment(true);
        }}
      />

      <PaymentModal
        show={showPayment}
        onHide={() => setShowPayment(false)}
        total={cartTotal}
        saldo={saldo}
        onPaymentSuccess={async () => {
          await loadCart();
          await loadSaldo();
          setShowPayment(false);
        }}
        cartId={cartId}
        userId={user?.id}
        userEmail={user?.email}
        userName={user?.nombre}
      />
    </div>
  );
};

export default ShopPage;
