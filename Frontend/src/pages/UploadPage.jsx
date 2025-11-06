// Página de carga de datos CSV/Excel
import { useState } from "react";
import {
  parseCSV,
  validateSalesData,
  validateProductsData,
} from "../utils/csvParser";
import { salesService } from "../services/salesService";
import { productService } from "../services/productService";
import { toastService } from "../utils/toastService";
import Loading from "../components/common/Loading";
import {
  FaUpload,
  FaFileExcel,
  FaCheckCircle,
  FaBox,
  FaShoppingCart,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState(null);
  const [importType, setImportType] = useState("productos"); // "productos" o "ventas"

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toastService.error("Por favor selecciona un archivo");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setResults(null);

    try {
      toastService.info("Procesando archivo...");

      // Parsear archivo
      const parsedData = await parseCSV(file);

      toastService.info(
        `Archivo parseado: ${parsedData.length} registros encontrados`
      );

      if (importType === "productos") {
        // Validar datos de productos
        const validation = validateProductsData(parsedData);

        if (!validation.isValid) {
          const errorMessage = `Errores de validación:\n${validation.errors
            .slice(0, 5)
            .join("\n")}\n${
            validation.errors.length > 5
              ? `... y ${validation.errors.length - 5} más`
              : ""
          }`;
          toastService.error(errorMessage);
          setError(errorMessage);
          setResults({
            total: parsedData.length,
            valid: validation.valid.length,
            errors: validation.errors.length,
          });
          return;
        }

        toastService.info(
          `Validación exitosa: ${validation.valid.length} productos válidos`
        );

        // Usar el servicio de productos
        const { data, error: uploadError } =
          await productService.createBulkProducts(validation.valid);

        if (uploadError && !data) {
          throw new Error(
            Array.isArray(uploadError) ? uploadError.join(", ") : uploadError
          );
        }

        setSuccess(true);
        setResults({
          total: parsedData.length,
          valid: validation.valid.length,
          inserted: data?.inserted || 0,
          errors: validation.errors.length + (data?.errors?.length || 0),
        });

        // Limpiar archivo
        setFile(null);
      } else {
        // Validar datos de ventas
        const validation = validateSalesData(parsedData);

        if (!validation.isValid) {
          const errorMessage = `Errores de validación:\n${validation.errors
            .slice(0, 5)
            .join("\n")}\n${
            validation.errors.length > 5
              ? `... y ${validation.errors.length - 5} más`
              : ""
          }`;
          toastService.error(errorMessage);
          setError(errorMessage);
          setResults({
            total: parsedData.length,
            valid: validation.valid.length,
            errors: validation.errors.length,
          });
          return;
        }

        toastService.info(
          `Validación exitosa: ${validation.valid.length} registros válidos`
        );

        // Usar el servicio de ventas que ya tiene toasts integrados
        const { data, error: uploadError } = await salesService.createBulkSales(
          validation.valid
        );

        if (uploadError) {
          throw uploadError;
        }

        setSuccess(true);
        setResults({
          total: parsedData.length,
          valid: validation.valid.length,
          inserted: data?.length || 0,
          errors: validation.errors.length,
        });

        // Limpiar archivo
        setFile(null);
      }
    } catch (err) {
      const errorMessage = err.message || "Error al procesar el archivo";
      toastService.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
              <FaUpload className="text-white" style={{ fontSize: "2rem" }} />
            </div>
            <div>
              <h1 className="text-4xl fw-bold mb-1 d-flex align-items-center">
                Cargar Datos
              </h1>
              <p
                className="text-lg mb-0 d-flex align-items-center"
                style={{ color: "#bfdbfe", gap: "0.5rem" }}
              >
                <FaFileExcel style={{ fontSize: "0.875rem" }} />
                Importa tus datos desde archivos CSV o Excel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        <div className="row">
          <div className="col-12 col-md-10 col-lg-8 mx-auto">
            <div
              className="bg-white rounded-3 shadow-lg p-4 border"
              style={{ borderColor: "#f3f4f6" }}
            >
              {/* Selector de tipo de importación */}
              <div
                className="mb-4 p-3 rounded-3 border"
                style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
              >
                <label
                  className="form-label fw-semibold text-dark mb-3 d-flex align-items-center"
                  style={{ gap: "0.5rem" }}
                >
                  <FaInfoCircle className="text-primary" />
                  Tipo de Importación
                </label>
                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className={`btn flex-grow-1 rounded-3 fw-semibold d-flex align-items-center justify-content-center ${
                      importType === "productos"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    style={{ gap: "0.5rem", padding: "0.75rem" }}
                    onClick={() => setImportType("productos")}
                  >
                    <FaBox />
                    Productos
                  </button>
                  <button
                    type="button"
                    className={`btn flex-grow-1 rounded-3 fw-semibold d-flex align-items-center justify-content-center ${
                      importType === "ventas"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    style={{ gap: "0.5rem", padding: "0.75rem" }}
                    onClick={() => setImportType("ventas")}
                  >
                    <FaShoppingCart />
                    Ventas
                  </button>
                </div>
              </div>

              <h5
                className="text-2xl fw-bold text-dark mb-4 d-flex align-items-center"
                style={{ gap: "0.75rem" }}
              >
                <FaFileExcel className="text-primary" />
                Subir Archivo CSV/Excel
              </h5>

              {error && (
                <div
                  className="alert alert-danger rounded-3 border border-danger"
                  role="alert"
                >
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ gap: "0.5rem" }}
                  >
                    <FaExclamationTriangle />
                    <strong>Errores encontrados:</strong>
                  </div>
                  <pre
                    className="mb-0 small"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {error}
                  </pre>
                </div>
              )}

              {success && results && (
                <div
                  className="border-2 border-success rounded-3 p-4 mb-4"
                  style={{ backgroundColor: "#d1e7dd" }}
                  role="alert"
                >
                  <h6
                    className="text-success fw-bold d-flex align-items-center mb-3"
                    style={{ gap: "0.5rem" }}
                  >
                    <FaCheckCircle />
                    Archivo procesado exitosamente
                  </h6>
                  <ul className="mb-0 list-unstyled">
                    <li className="mb-2">
                      <strong>Total de registros:</strong> {results.total}
                    </li>
                    <li className="mb-2">
                      <strong>Registros válidos:</strong> {results.valid}
                    </li>
                    <li className="mb-2">
                      <strong>Registros insertados:</strong> {results.inserted}
                    </li>
                    {results.errors > 0 && (
                      <li className="mb-2 text-warning">
                        <strong>Errores:</strong> {results.errors}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="fileInput"
                  className="form-label fw-semibold text-dark mb-2 d-flex align-items-center"
                  style={{ gap: "0.5rem" }}
                >
                  <FaFileExcel className="text-primary" />
                  Seleccionar archivo (CSV o Excel)
                </label>
                <input
                  type="file"
                  className="form-control form-control-lg border-2 rounded-3"
                  style={{ borderColor: "#e5e7eb" }}
                  id="fileInput"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <small className="form-text text-muted d-block mt-2">
                  Formatos soportados: CSV, XLSX, XLS
                </small>
              </div>

              {file && (
                <div
                  className="mb-3 p-3 rounded-3 border"
                  style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
                >
                  <p className="mb-0 text-dark">
                    <strong>Archivo seleccionado:</strong> {file.name} (
                    {(file.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}

              <button
                className="btn btn-primary w-100 rounded-3 fw-semibold py-3 text-lg shadow-lg d-flex align-items-center justify-content-center"
                style={{ gap: "0.5rem" }}
                onClick={handleUpload}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Procesar y Cargar{" "}
                    {importType === "productos" ? "Productos" : "Ventas"}
                  </>
                )}
              </button>

              <div
                className="mt-4 pt-4 border-top"
                style={{ borderColor: "#e5e7eb" }}
              >
                <h6
                  className="text-lg fw-bold text-dark mb-3 d-flex align-items-center"
                  style={{ gap: "0.5rem" }}
                >
                  <FaInfoCircle className="text-primary" />
                  Formato esperado del archivo:
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered rounded-3 overflow-hidden">
                    <thead className="table-light">
                      {importType === "productos" ? (
                        <tr>
                          <th className="fw-semibold">Nombre *</th>
                          <th className="fw-semibold">SKU</th>
                          <th className="fw-semibold">Categoría</th>
                          <th className="fw-semibold">Talla</th>
                          <th className="fw-semibold">Género</th>
                          <th className="fw-semibold">Stock</th>
                          <th className="fw-semibold">Stock Mínimo</th>
                          <th className="fw-semibold">Precio</th>
                          <th className="fw-semibold">Precio Costo</th>
                          <th className="fw-semibold">Descripción</th>
                        </tr>
                      ) : (
                        <tr>
                          <th className="fw-semibold">Nombre Producto *</th>
                          <th className="fw-semibold">Cantidad *</th>
                          <th className="fw-semibold">Precio *</th>
                          <th className="fw-semibold">Fecha Venta</th>
                          <th className="fw-semibold">Cliente (opcional)</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {importType === "productos" ? (
                        <tr>
                          <td>Camiseta Básica Negra</td>
                          <td>CAM-001-NEG-M</td>
                          <td>Ropa</td>
                          <td>M</td>
                          <td>Hombre</td>
                          <td>50</td>
                          <td>10</td>
                          <td>29.99</td>
                          <td>15.00</td>
                          <td>Camiseta de algodón 100%</td>
                        </tr>
                      ) : (
                        <tr>
                          <td>Camiseta Básica</td>
                          <td>5</td>
                          <td>29.99</td>
                          <td>2025-01-15</td>
                          <td>Juan Pérez</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div
                  className="mt-3 p-3 rounded-3 border"
                  style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
                >
                  <small
                    className="text-muted d-flex align-items-center"
                    style={{ gap: "0.5rem" }}
                  >
                    <FaExclamationTriangle className="text-warning" />
                    <strong>Nota:</strong> El archivo debe tener encabezados en
                    la primera fila. Los campos marcados con * son obligatorios.
                    {importType === "productos" && (
                      <span className="d-block mt-1">
                        El SKU es opcional pero debe ser único si se
                        proporciona. Si no se especifica, se generará
                        automáticamente.
                      </span>
                    )}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
