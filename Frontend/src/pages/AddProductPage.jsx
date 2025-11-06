// Página para agregar productos individuales
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { storageService } from "../services/storageService";
import supabase from "../services/supabase";
import { toastService } from "../utils/toastService";
import {
  FaPlus,
  FaArrowLeft,
  FaUpload,
  FaTimes,
  FaImage,
  FaBox,
  FaTag,
  FaFolder,
  FaRuler,
  FaUser,
  FaWarehouse,
  FaExclamationTriangle,
  FaDollarSign,
  FaEdit,
  FaSave,
} from "react-icons/fa";

const AddProductPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar archivo
    const validation = storageService.validateImageFile(file);
    if (!validation.valid) {
      toastService.error(validation.error);
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Subir imagen
  const handleUploadImage = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    try {
      // Generar un ID temporal para el producto
      const tempId = `temp-${Date.now()}`;
      const result = await storageService.uploadProductImage(
        selectedFile,
        tempId
      );

      if (result.success) {
        // Guardar la ruta del archivo en lugar de la URL completa
        // Esto permite regenerar la URL correctamente cuando se necesite
        setFormData((prev) => ({ ...prev, imagen_url: result.path }));
        toastService.success("Imagen subida exitosamente");
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Eliminar imagen seleccionada
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, imagen_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

      // Crear el producto primero (sin imagen)
      const productDataWithoutImage = { ...formData };
      const imageUrlToSave = productDataWithoutImage.imagen_url;
      productDataWithoutImage.imagen_url = ""; // Temporalmente vacío

      const result = await productService.createProduct(
        productDataWithoutImage
      );

      // Si el producto se creó exitosamente y hay una imagen para subir
      if (!result.error && result.data && selectedFile) {
        try {
          // Subir la imagen con el ID real del producto
          const uploadResult = await storageService.uploadProductImage(
            selectedFile,
            result.data.id
          );

          if (uploadResult.success) {
            // Actualizar el producto con la ruta de la imagen
            await productService.updateProduct(result.data.id, {
              imagen_url: uploadResult.path,
            });
            toastService.success("Producto e imagen guardados exitosamente");
          } else {
            toastService.warning(
              "Producto creado pero hubo un error al subir la imagen"
            );
          }
        } catch (uploadError) {
          console.error(
            "Error al subir imagen después de crear producto:",
            uploadError
          );
          toastService.warning(
            "Producto creado pero hubo un error al subir la imagen"
          );
        }
      } else if (!result.error && result.data && imageUrlToSave) {
        // Si ya había una URL de imagen (subida previamente), actualizar el producto
        await productService.updateProduct(result.data.id, {
          imagen_url: imageUrlToSave,
        });
      }

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
        setSelectedFile(null);
        setPreviewImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

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
            className="d-flex align-items-center justify-content-between flex-wrap"
            style={{ gap: "1rem" }}
          >
            <div className="d-flex align-items-center" style={{ gap: "1rem" }}>
              <div
                className="rounded-3 shadow-lg d-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <FaPlus className="text-white" style={{ fontSize: "2rem" }} />
              </div>
              <div>
                <h1 className="text-4xl fw-bold mb-1 d-flex align-items-center">
                  Agregar Nuevo Producto
                </h1>
                <p
                  className="text-lg mb-0 d-flex align-items-center"
                  style={{ color: "#bfdbfe", gap: "0.5rem" }}
                >
                  <FaBox style={{ fontSize: "0.875rem" }} />
                  Registra un nuevo producto en tu inventario
                </p>
              </div>
            </div>
            <button
              className="btn btn-light d-flex align-items-center fw-semibold rounded-3 shadow-lg"
              style={{ gap: "0.5rem" }}
              onClick={() => navigate("/inventory")}
            >
              <FaArrowLeft />
              Volver al Inventario
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        <div className="row">
          <div className="col-12">
            <div
              className="bg-white rounded-3 shadow-lg p-4 border"
              style={{ borderColor: "#f3f4f6" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Nombre del Producto */}
                  <div className="col-md-12 mb-3">
                    <label
                      className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                      style={{ gap: "0.5rem" }}
                    >
                      <FaBox className="text-primary" />
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Camiseta Básica Negra"
                    />
                    <small className="text-muted d-block mt-1">
                      <FaTag className="me-1" />
                      El SKU se generará automáticamente al guardar el producto
                    </small>
                  </div>
                </div>

                <div className="row">
                  {/* Categoría */}
                  <div className="col-md-6 mb-3">
                    <label
                      className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                      style={{ gap: "0.5rem" }}
                    >
                      <FaFolder className="text-primary" />
                      Categoría
                    </label>
                    <select
                      className="form-select form-select-lg border-2 rounded-3 mb-2"
                      style={{ borderColor: "#e5e7eb" }}
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
                      className="form-control border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      placeholder="O escribir categoría manualmente"
                    />
                  </div>

                  {/* Talla */}
                  <div className="col-md-3 mb-3">
                    <label
                      className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                      style={{ gap: "0.5rem" }}
                    >
                      <FaRuler className="text-primary" />
                      Talla
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
                      name="talla"
                      value={formData.talla}
                      onChange={handleChange}
                      placeholder="Ej: M, L, 32, 34"
                    />
                  </div>

                  {/* Género */}
                  <div className="col-md-3 mb-3">
                    <label
                      className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                      style={{ gap: "0.5rem" }}
                    >
                      <FaUser className="text-primary" />
                      Género
                    </label>
                    <select
                      className="form-select form-select-lg border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
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
                    <label
                      className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                      style={{ gap: "0.5rem" }}
                    >
                      <FaWarehouse className="text-primary" />
                      Stock Inicial *
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-lg border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>

                  {/* Stock Mínimo */}
                  <div className="col-md-3 mb-3">
                    <label
                      className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                      style={{ gap: "0.5rem" }}
                    >
                      <FaExclamationTriangle className="text-warning" />
                      Stock Mínimo *
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-lg border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
                      name="stock_minimo"
                      value={formData.stock_minimo}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>

                  {/* Precio */}
                  <div className="col-md-3 mb-3">
                    <label
                      className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                      style={{ gap: "0.5rem" }}
                    >
                      <FaDollarSign className="text-success" />
                      Precio de Venta *
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-lg border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
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
                    <label
                      className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                      style={{ gap: "0.5rem" }}
                    >
                      <FaDollarSign className="text-info" />
                      Precio de Costo *
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-lg border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
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
                  <label
                    className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                    style={{ gap: "0.5rem" }}
                  >
                    <FaEdit className="text-primary" />
                    Descripción
                  </label>
                  <textarea
                    className="form-control border-2 rounded-3"
                    style={{ borderColor: "#e5e7eb", minHeight: "100px" }}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Descripción detallada del producto..."
                  />
                </div>

                {/* Imagen del Producto */}
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold text-dark d-flex align-items-center mb-2"
                    style={{ gap: "0.5rem" }}
                  >
                    <FaImage className="text-primary" />
                    Imagen del Producto
                  </label>

                  {/* Preview de imagen */}
                  {(previewImage || formData.imagen_url) && (
                    <div
                      className="mb-3 position-relative"
                      style={{ maxWidth: "400px" }}
                    >
                      <img
                        src={previewImage || formData.imagen_url}
                        alt="Preview"
                        className="rounded-3 shadow-sm border"
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                          borderColor: "#e5e7eb",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                        onClick={handleRemoveImage}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}

                  {/* Input de archivo */}
                  <div
                    className="d-flex align-items-end"
                    style={{ gap: "0.75rem" }}
                  >
                    <div className="flex-grow-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="form-control form-control-lg border-2 rounded-3"
                        style={{ borderColor: "#e5e7eb" }}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileSelect}
                        disabled={uploadingImage}
                      />
                      <small className="text-muted d-block mt-1">
                        Formatos permitidos: JPG, PNG, WEBP (máx. 5MB)
                      </small>
                    </div>
                    {selectedFile && !formData.imagen_url && (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center rounded-3"
                        style={{ gap: "0.5rem" }}
                        onClick={handleUploadImage}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                            ></span>
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <FaUpload />
                            Subir Imagen
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Opción alternativa: URL */}
                  <div className="mt-3">
                    <label className="form-label small text-muted fw-medium">
                      O ingresa una URL de imagen:
                    </label>
                    <input
                      type="url"
                      className="form-control border-2 rounded-3"
                      style={{ borderColor: "#e5e7eb" }}
                      name="imagen_url"
                      value={formData.imagen_url}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      disabled={!!selectedFile}
                    />
                  </div>
                </div>

                {/* Activo */}
                <div
                  className="mb-4 form-check p-3 rounded-3 border"
                  style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="activo"
                    id="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label fw-medium ms-2"
                    htmlFor="activo"
                    style={{ cursor: "pointer" }}
                  >
                    Producto activo (disponible para venta)
                  </label>
                </div>

                {/* Botones */}
                <div
                  className="d-flex gap-3 pt-3 border-top"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center rounded-3 fw-semibold px-4 py-2"
                    style={{
                      backgroundColor: "#002f19",
                      borderColor: "#002f19",
                      gap: "0.5rem",
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Guardar Producto
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center rounded-3 fw-semibold px-4 py-2"
                    onClick={() => navigate("/inventory")}
                  >
                    <FaTimes className="me-2" />
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
