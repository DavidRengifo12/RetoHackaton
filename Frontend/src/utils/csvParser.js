// Parser de archivos CSV/Excel
import * as XLSX from "xlsx";

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
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
    const nombreProducto =
      row.nombre_producto ||
      row["Nombre Producto"] ||
      row["Producto"] ||
      row.producto ||
      row.product_name ||
      row["Product Name"];
    const cantidad =
      row.cantidad || row["Cantidad"] || row.Quantity || row.quantity;
    const precio =
      row.precio ||
      row["Precio"] ||
      row.Price ||
      row.price ||
      row["Precio Unitario"] ||
      row.unit_price;

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
      producto_id:
        row.producto_id || row["ID Producto"] || row["Product ID"] || null,
      nombre_cliente:
        row.nombre_cliente ||
        row["Nombre Cliente"] ||
        row["Cliente"] ||
        row.Customer ||
        row.customer ||
        null,
      cliente_id: row.cliente_id || row["ID Cliente"] || null,
      fecha_venta:
        row.fecha_venta ||
        row["Fecha Venta"] ||
        row["Sale Date"] ||
        row.sale_date ||
        row.fecha ||
        new Date().toISOString(),
      metodo_pago:
        row.metodo_pago ||
        row["Método Pago"] ||
        row["Payment Method"] ||
        row.payment_method ||
        null,
      descuento:
        row.descuento || row["Descuento"] || row.Discount || row.discount || 0,
      notas: row.notas || row["Notas"] || row.Notes || row.notes || null,
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
  return parsedData.map((row) => ({
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

// Validar datos de productos para importación
export const validateProductsData = (data) => {
  const errors = [];
  const validData = [];

  data.forEach((row, index) => {
    const rowNum = index + 2; // +2 porque index empieza en 0 y fila 1 es header

    // Validar campos requeridos (acepta nombres en español e inglés)
    const nombre =
      row.nombre ||
      row["Nombre"] ||
      row["Nombre Producto"] ||
      row.nombre_producto ||
      row.product_name ||
      row["Product Name"] ||
      row.Product;
    const sku =
      row.sku || row["SKU"] || row["Código"] || row.codigo || row.code || null;
    const categoria =
      row.categoria ||
      row["Categoría"] ||
      row["Category"] ||
      row.category ||
      null;
    const talla = row.talla || row["Talla"] || row["Size"] || row.size || null;
    const genero =
      row.genero || row["Género"] || row["Gender"] || row.gender || null;
    const stock =
      row.stock || row["Stock"] || row["Cantidad"] || row.cantidad || 0;
    const stockMinimo =
      row.stock_minimo ||
      row["Stock Mínimo"] ||
      row["Stock Minimo"] ||
      row["Min Stock"] ||
      row.min_stock ||
      10;
    const precio =
      row.precio ||
      row["Precio"] ||
      row["Precio Venta"] ||
      row["Price"] ||
      row.price ||
      row["Sale Price"] ||
      0;
    const precioCosto =
      row.precio_costo ||
      row["Precio Costo"] ||
      row["Costo"] ||
      row["Cost Price"] ||
      row.cost_price ||
      row.costo ||
      0;
    const descripcion =
      row.descripcion ||
      row["Descripción"] ||
      row["Description"] ||
      row.description ||
      null;
    const imagenUrl =
      row.imagen_url ||
      row["Imagen URL"] ||
      row["Image URL"] ||
      row.image_url ||
      row.imagen ||
      null;
    const activo =
      row.activo !== undefined
        ? row.activo === true ||
          row.activo === "true" ||
          row.activo === "TRUE" ||
          row.activo === 1 ||
          row.activo === "1" ||
          row["Activo"] === true ||
          row["Activo"] === "true" ||
          row["Activo"] === "TRUE" ||
          row["Activo"] === 1 ||
          row["Activo"] === "1"
        : true;

    // Validar nombre (requerido)
    if (!nombre || nombre.trim() === "") {
      errors.push(`Fila ${rowNum}: Falta el nombre del producto`);
      return;
    }

    // Normalizar datos
    const normalizedRow = {
      nombre: nombre.trim(),
      sku: sku ? sku.toString().trim() : null,
      categoria: categoria ? categoria.trim() : null,
      talla: talla ? talla.toString().trim() : null,
      genero: genero ? genero.trim() : null,
      stock: parseInt(stock) || 0,
      stock_minimo: parseInt(stockMinimo) || 10,
      precio: parseFloat(precio) || 0,
      precio_costo: parseFloat(precioCosto) || 0,
      descripcion: descripcion ? descripcion.trim() : null,
      imagen_url: imagenUrl ? imagenUrl.trim() : null,
      activo: activo,
    };

    // Validar tipos de datos
    if (normalizedRow.stock < 0) {
      errors.push(`Fila ${rowNum}: El stock no puede ser negativo`);
      return;
    }

    if (normalizedRow.stock_minimo < 0) {
      errors.push(`Fila ${rowNum}: El stock mínimo no puede ser negativo`);
      return;
    }

    if (normalizedRow.precio < 0) {
      errors.push(`Fila ${rowNum}: El precio no puede ser negativo`);
      return;
    }

    if (normalizedRow.precio_costo < 0) {
      errors.push(`Fila ${rowNum}: El precio de costo no puede ser negativo`);
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
