// Página de carga de datos CSV/Excel
import { useState } from 'react';
import { parseCSV, validateSalesData } from '../utils/csvParser';
import { salesService } from '../services/salesService';
import { toastService } from '../utils/toastService';
import Loading from '../components/common/Loading';

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
      toastService.error('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setResults(null);

    try {
      toastService.info('Procesando archivo...');
      
      // Parsear archivo
      const parsedData = await parseCSV(file);
      
      toastService.info(`Archivo parseado: ${parsedData.length} registros encontrados`);
      
      // Validar datos
      const validation = validateSalesData(parsedData);
      
      if (!validation.isValid) {
        const errorMessage = `Errores de validación:\n${validation.errors.slice(0, 5).join('\n')}\n${validation.errors.length > 5 ? `... y ${validation.errors.length - 5} más` : ''}`;
        toastService.error(errorMessage);
        setError(errorMessage);
        setResults({
          total: parsedData.length,
          valid: validation.valid.length,
          errors: validation.errors.length,
        });
        return;
      }

      toastService.info(`Validación exitosa: ${validation.valid.length} registros válidos`);
      
      // Usar el servicio de ventas que ya tiene toasts integrados
      const { data, error: uploadError } = await salesService.createBulkSales(validation.valid);
      
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
      const errorMessage = err.message || 'Error al procesar el archivo';
      toastService.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-4">📤 Cargar Datos Históricos</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Subir Archivo CSV/Excel</h5>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
                </div>
              )}

              {success && results && (
                <div className="alert alert-success" role="alert">
                  <h6>✅ Archivo procesado exitosamente</h6>
                  <ul className="mb-0">
                    <li>Total de registros: {results.total}</li>
                    <li>Registros válidos: {results.valid}</li>
                    <li>Registros insertados: {results.inserted}</li>
                    {results.errors > 0 && <li>Errores: {results.errors}</li>}
                  </ul>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="fileInput" className="form-label">
                  Seleccionar archivo (CSV o Excel)
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="fileInput"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <small className="form-text text-muted">
                  Formatos soportados: CSV, XLSX, XLS
                </small>
              </div>

              {file && (
                <div className="mb-3">
                  <p className="text-muted">
                    Archivo seleccionado: <strong>{file.name}</strong> ({file.size} bytes)
                  </p>
                </div>
              )}

              <button
                className="btn btn-primary w-100"
                onClick={handleUpload}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </>
                ) : (
                  'Procesar y Cargar Datos'
                )}
              </button>

              <div className="mt-4">
                <h6>Formato esperado del archivo:</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
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
