// Página para agregar productos individuales
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import supabase from "../services/supabase";
import { toastService } from "../utils/toastService";
import { FaPlus, FaArrowLeft } from "react-icons/fa";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    sku: "",
    categoria_id: "",
    categoria: "",
    talla: "",
    genero: "",
    stock: 0,
    stock_minimo: 10,
    precio: 0,
    precio_costo: 0,
    descripcion: "",
    imagen_url: "",
    activo: true,
  });

  // Cargar categorías disponibles
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("activa", true)
        .order("nombre", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toastService.error(`Error al cargar categorías: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones básicas
      if (!formData.nombre) {
        toastService.error("El nombre del producto es requerido");
        setLoading(false);
        return;
      }

      if (formData.stock < 0) {
        toastService.error("El stock no puede ser negativo");
        setLoading(false);
        return;
      }

      if (formData.precio < 0 || formData.precio_costo < 0) {
        toastService.error("Los precios no pueden ser negativos");
        setLoading(false);
        return;
      }

      // Si se seleccionó una categoría por ID, usarla
      if (formData.categoria_id && !formData.categoria) {
        const selectedCategory = categories.find(
          (c) => c.id === formData.categoria_id
        );
        if (selectedCategory) {
          formData.categoria = selectedCategory.nombre;
        }
      }

      // Generar SKU automático si no se proporciona
      if (!formData.sku) {
        const prefix = formData.nombre
          .substring(0, 3)
          .toUpperCase()
          .replace(/\s/g, "");
        const random = Math.floor(Math.random() * 1000);
        formData.sku = `${prefix}-${random}`;
      }

      const result = await productService.createProduct(formData);

      if (!result.error) {
        // Resetear formulario
        setFormData({
          nombre: "",
          sku: "",
          categoria_id: "",
          categoria: "",
          talla: "",
          genero: "",
          stock: 0,
          stock_minimo: 10,
          precio: 0,
          precio_costo: 0,
          descripcion: "",
          imagen_url: "",
          activo: true,
        });

        // Opción: redirigir a inventario o mostrar mensaje
        setTimeout(() => {
          navigate("/inventory");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container-fluid px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <FaPlus className="mr-3" />
                Agregar Nuevo Producto
              </h1>
              <p className="text-blue-100 text-lg">
                Registra un nuevo producto en tu inventario
              </p>
            </div>
            <button
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={() => navigate("/inventory")}
            >
              <FaArrowLeft />
              Volver al Inventario
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-6">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Nombre del Producto */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <span className="me-2">📦</span>
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Camiseta Básica Negra"
                    />
                  </div>

                  {/* SKU */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <span className="me-2">🏷️</span>
                      SKU (Código Único)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Se generará automáticamente si se deja vacío"
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Categoría */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <span className="me-2">📂</span>
                      Categoría
                    </label>
                    <select
                      className="form-select"
                      name="categoria_id"
                      value={formData.categoria_id}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar categoría...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control mt-2"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      placeholder="O escribir categoría manualmente"
                    />
                  </div>

                  {/* Talla */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      <span className="me-2">📏</span>
                      Talla
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="talla"
                      value={formData.talla}
                      onChange={handleChange}
                      placeholder="Ej: M, L, 32, 34"
                    />
                  </div>

                  {/* Género */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      <span className="me-2">👔</span>
                      Género
                    </label>
                    <select
                      className="form-select"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Niño">Niño</option>
                      <option value="Niña">Niña</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  {/* Stock */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      <span className="me-2">📊</span>
                      Stock Inicial *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>

                  {/* Stock Mínimo */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      <span className="me-2">⚠️</span>
                      Stock Mínimo *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock_minimo"
                      value={formData.stock_minimo}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>

                  {/* Precio */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      <span className="me-2">💰</span>
                      Precio de Venta *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Precio de Costo */}
                  <div className="col-md-3 mb-3">
                    <label className="form-label">
                      <span className="me-2">💵</span>
                      Precio de Costo *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio_costo"
                      value={formData.precio_costo}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-3">
                  <label className="form-label">
                    <span className="me-2">📝</span>
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Descripción detallada del producto..."
                  />
                </div>

                {/* URL de Imagen */}
                <div className="mb-3">
                  <label className="form-label">
                    <span className="me-2">🖼️</span>
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="imagen_url"
                    value={formData.imagen_url}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                {/* Activo */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="activo"
                    id="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="activo">
                    Producto activo (disponible para venta)
                  </label>
                </div>

                {/* Botones */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{
                      backgroundColor: "#002f19",
                      borderColor: "#002f19",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <span className="me-2">✅</span>
                        Guardar Producto
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/inventory")}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
