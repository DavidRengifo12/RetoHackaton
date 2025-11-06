// Página de carga de datos CSV/Excel
import { useState } from "react";
import { parseCSV, validateSalesData } from "../utils/csvParser";
import { salesService } from "../services/salesService";
import { toastService } from "../utils/toastService";
import Loading from "../components/common/Loading";
import { FaUpload, FaFileExcel, FaCheckCircle } from "react-icons/fa";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState(null);

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

      // Validar datos
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

      // El toast de éxito ya se muestra desde salesService

      // Limpiar archivo
      setFile(null);
    } catch (err) {
      const errorMessage = err.message || "Error al procesar el archivo";
      toastService.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container-fluid px-4 py-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <FaUpload className="mr-3" />
            Cargar Datos Históricos
          </h1>
          <p className="text-blue-100 text-lg">
            Importa tus datos desde archivos CSV o Excel
          </p>
        </div>
      </div>

      <div className="container-fluid px-4 py-6">
        <div className="row">
          <div className="col-12 col-md-10 col-lg-8 mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h5 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaFileExcel className="mr-3 text-blue-600" />
                Subir Archivo CSV/Excel
              </h5>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <pre className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {error}
                  </pre>
                </div>
              )}

              {success && results && (
                <div
                  className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4"
                  role="alert"
                >
                  <h6 className="text-green-800 font-bold flex items-center mb-3">
                    <FaCheckCircle className="mr-2" />
                    Archivo procesado exitosamente
                  </h6>
                  <ul className="mb-0">
                    <li>Total de registros: {results.total}</li>
                    <li>Registros válidos: {results.valid}</li>
                    <li>Registros insertados: {results.inserted}</li>
                    {results.errors > 0 && <li>Errores: {results.errors}</li>}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="fileInput"
                  className="form-label text-gray-700 font-semibold mb-2"
                >
                  Seleccionar archivo (CSV o Excel)
                </label>
                <input
                  type="file"
                  className="form-control border-2 border-gray-200 rounded-xl shadow-sm"
                  id="fileInput"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <small className="form-text text-gray-500 mt-2">
                  Formatos soportados: CSV, XLSX, XLS
                </small>
              </div>

              {file && (
                <div className="mb-3">
                  <p className="text-muted">
                    Archivo seleccionado: <strong>{file.name}</strong> (
                    {file.size} bytes)
                  </p>
                </div>
              )}

              <button
                className="btn btn-primary w-100 rounded-xl font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleUpload}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Procesando...
                  </>
                ) : (
                  "Procesar y Cargar Datos"
                )}
              </button>

              <div className="mt-6">
                <h6 className="text-lg font-bold text-gray-900 mb-3">
                  Formato esperado del archivo:
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered rounded-xl overflow-hidden">
                    <thead>
                      <tr>
                        <th>Nombre Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Fecha Venta</th>
                        <th>Cliente (opcional)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Camiseta Básica</td>
                        <td>5</td>
                        <td>29.99</td>
                        <td>2025-01-15</td>
                        <td>Juan Pérez</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <small className="text-muted">
                  Nota: El archivo debe tener encabezados en la primera fila.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
