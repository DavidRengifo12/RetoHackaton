// Parser de archivos CSV/Excel
import * as XLSX from 'xlsx';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
};

export const validateSalesData = (data) => {
  const errors = [];
  const validData = [];

  data.forEach((row, index) => {
    const rowNum = index + 2; // +2 porque index empieza en 0 y fila 1 es header
    
    // Validar campos requeridos (acepta nombres en español e inglés)
    const nombreProducto = row.nombre_producto || row['Nombre Producto'] || row['Producto'] || row.producto || row.product_name || row['Product Name'];
    const cantidad = row.cantidad || row['Cantidad'] || row.Quantity || row.quantity;
    const precio = row.precio || row['Precio'] || row.Price || row.price || row['Precio Unitario'] || row.unit_price;
    
    if (!nombreProducto) {
      errors.push(`Fila ${rowNum}: Falta el nombre del producto`);
      return;
    }

    if (!cantidad && cantidad !== 0) {
      errors.push(`Fila ${rowNum}: Falta la cantidad`);
      return;
    }

    if (!precio && precio !== 0) {
      errors.push(`Fila ${rowNum}: Falta el precio`);
      return;
    }

    // Normalizar nombres de columnas
    const normalizedRow = {
      nombre_producto: nombreProducto,
      cantidad: parseInt(cantidad) || 0,
      precio_unitario: parseFloat(precio) || 0,
      producto_id: row.producto_id || row['ID Producto'] || row['Product ID'] || null,
      nombre_cliente: row.nombre_cliente || row['Nombre Cliente'] || row['Cliente'] || row.Customer || row.customer || null,
      cliente_id: row.cliente_id || row['ID Cliente'] || null,
      fecha_venta: row.fecha_venta || row['Fecha Venta'] || row['Sale Date'] || row.sale_date || row.fecha || new Date().toISOString(),
      metodo_pago: row.metodo_pago || row['Método Pago'] || row['Payment Method'] || row.payment_method || null,
      descuento: row.descuento || row['Descuento'] || row.Discount || row.discount || 0,
      notas: row.notas || row['Notas'] || row.Notes || row.notes || null,
    };

    // Validar tipos de datos
    if (normalizedRow.cantidad <= 0) {
      errors.push(`Fila ${rowNum}: La cantidad debe ser mayor a 0`);
      return;
    }

    if (normalizedRow.precio_unitario <= 0) {
      errors.push(`Fila ${rowNum}: El precio debe ser mayor a 0`);
      return;
    }

    validData.push(normalizedRow);
  });

  return {
    valid: validData,
    errors,
    isValid: errors.length === 0,
  };
};

export const convertToSalesFormat = (parsedData) => {
  return parsedData.map(row => ({
    nombre_producto: row.nombre_producto,
    cantidad: parseInt(row.cantidad),
    precio_unitario: parseFloat(row.precio_unitario),
    producto_id: row.producto_id || null,
    nombre_cliente: row.nombre_cliente || null,
    cliente_id: row.cliente_id || null,
    fecha_venta: row.fecha_venta || new Date().toISOString(),
    metodo_pago: row.metodo_pago || null,
    descuento: row.descuento || 0,
    notas: row.notas || null,
  }));
};
