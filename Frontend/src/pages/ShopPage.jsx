// Página de tienda para usuarios - con tarjetas de productos y carrito
import { useState, useEffect, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { useAuthContext } from "../context/AuthContext";
import { cartService } from "../services/cartService";
import { paymentService } from "../services/paymentService";
import { storageService } from "../services/storageService";
import { formatCurrency } from "../utils/helpers";

import CartModal from "../components/shop/CartModal";
import PaymentModal from "../components/shop/PaymentModal";
import Loading from "../components/common/Loading";
import {
  FaShoppingCart,
  FaSearch,
  FaWallet,
  FaBox,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingBag,
  FaTag,
  FaRuler,
  FaUser,
  FaStore,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
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

  // Escuchar búsqueda desde el header del Navbar
  useEffect(() => {
    const handleShopSearch = (event) => {
      setSearchTerm(event.detail);
    };

    window.addEventListener("shopSearch", handleShopSearch);

    // Leer parámetro de búsqueda de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    return () => {
      window.removeEventListener("shopSearch", handleShopSearch);
    };
  }, []);

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
  const itemsPerPage = 12; // Reducido de 18 a 12 para mejor visualización
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
    <div className="min-h-screen bg-gray-50">
      {/* Header moderno mejorado */}
      <div className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 border-b-2 border-blue-200 shadow-lg sticky z-20 lg:top-16 top-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6 min-h-[100px]">
            {/* Título y descripción */}
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                <FaShoppingBag className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
                  Tienda
                </h1>
                <p className="text-base sm:text-lg text-gray-600 font-medium hidden sm:block">
                  {filteredProducts.length} producto
                  {filteredProducts.length !== 1 ? "s" : ""} disponibles
                </p>
              </div>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center gap-4">
              {!loadingSaldo && (
                <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 rounded-xl shadow-md">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <FaWallet className="text-white text-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-green-600 font-medium uppercase tracking-wide">
                      Saldo
                    </span>
                    <span className="text-lg font-bold text-green-700">
                      {formatCurrency(saldo)}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowCart(true)}
                className="relative px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-3 font-semibold text-base"
                aria-label="Ver carrito"
              >
                <FaShoppingCart className="text-xl" />
                <span className="hidden sm:inline">Carrito</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[28px] h-7 bg-red-500 text-white text-sm font-bold rounded-full px-2 shadow-md border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de bienvenida */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <FaStore className="text-5xl" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold">
                ¡Bienvenido a nuestra Tienda!
              </h2>
            </div>
            <p className="text-xl sm:text-2xl text-blue-100 mb-4 font-semibold">
              Descubre nuestra amplia selección de productos de calidad
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Encuentra todo lo que necesitas con los mejores precios y la mejor
              experiencia de compra. Explora nuestro catálogo y encuentra
              productos increíbles para ti.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <FaCheckCircle className="text-green-300" />
                <span className="text-sm font-medium">
                  Productos de calidad
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <FaStar className="text-yellow-300" />
                <span className="text-sm font-medium">Mejores precios</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <FaShoppingBag className="text-blue-200" />
                <span className="text-sm font-medium">Envío rápido</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros modernos */}
        <div className="w-full bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <FaFilter className="text-blue-600 text-lg" />
            <span className="text-lg font-bold text-gray-900">
              Filtros de Búsqueda
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categoría */}
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
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

            {/* Género */}
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
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

            {/* Botón limpiar */}
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-gray-700 font-medium"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setGenderFilter("");
                setCurrentPage(1);
              }}
            >
              <FaTimes className="text-sm" />
              Limpiar
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              producto{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Tarjetas de productos */}
        {filteredProducts.length === 0 ? (
          <div className="w-full bg-white rounded-xl shadow-lg p-16 text-center border border-gray-100">
            <div className="flex justify-center mb-4">
              <FaBox className="text-gray-300 text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-blue-400 hover:-translate-y-2 group flex flex-col"
                >
                  {/* Imagen del producto */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {product.imagen_url ? (
                      <img
                        src={
                          storageService.getProductImageUrl(product) ||
                          product.imagen_url
                        }
                        alt={product.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error(
                            "Error al cargar imagen del producto:",
                            {
                              productId: product.id,
                              productName: product.nombre,
                              imagen_url: product.imagen_url,
                              generatedUrl:
                                storageService.getProductImageUrl(product),
                            }
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
                          console.log("Imagen cargada exitosamente:", {
                            productId: product.id,
                            productName: product.nombre,
                            url:
                              storageService.getProductImageUrl(product) ||
                              product.imagen_url,
                          });
                        }}
                      />
                    ) : null}
                    <div className="image-placeholder w-full h-full hidden items-center justify-center absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                      <FaBox className="text-gray-400 text-5xl" />
                    </div>

                    {/* Badge de stock */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-sm ${
                          product.stock > 10
                            ? "bg-green-500/90 text-white"
                            : product.stock > 0
                            ? "bg-yellow-500/90 text-white"
                            : "bg-red-500/90 text-white"
                        }`}
                      >
                        {product.stock} disponibles
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Nombre del producto */}
                    <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 min-h-[3.5rem] leading-tight">
                      {product.nombre}
                    </h3>

                    {/* Badges de información */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.categoria && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                          <FaTag className="text-xs" />
                          {product.categoria}
                        </span>
                      )}
                      {product.talla && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                          <FaRuler className="text-xs" />
                          {product.talla}
                        </span>
                      )}
                    </div>

                    {/* Género */}
                    {product.genero && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <FaUser className="text-sm" />
                        <span className="font-medium">{product.genero}</span>
                      </div>
                    )}

                    {/* Precio y botón */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {formatCurrency(product.precio || 0)}
                        </span>
                      </div>

                      {/* Botón agregar al carrito */}
                      <button
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <FaShoppingCart className="text-base" />
                        {product.stock === 0
                          ? "Sin Stock"
                          : "Agregar al Carrito"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación moderna mejorada */}
            {totalPages > 1 && (
              <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Información de paginación */}
                  <div className="text-sm text-gray-600">
                    Mostrando{" "}
                    <span className="font-semibold text-gray-900">
                      {startIndex + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-gray-900">
                      {Math.min(endIndex, filteredProducts.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredProducts.length}
                    </span>{" "}
                    productos
                  </div>

                  {/* Controles de paginación */}
                  <div className="flex items-center gap-3">
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaChevronLeft className="text-sm" />
                      <span className="hidden sm:inline">Anterior</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        // Mostrar solo algunas páginas alrededor de la actual
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              className={`px-4 py-2.5 min-w-[44px] rounded-xl transition-all font-semibold ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                  : "border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-400 text-gray-700"
                              }`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-gray-500 font-medium"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span className="hidden sm:inline">Siguiente</span>
                      <FaChevronRight className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
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
