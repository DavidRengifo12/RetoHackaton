// Funciones de formateo de datos

export const formatProductForTable = (product) => {
  return {
    ...product,
    stock: product.stock || 0,
    precio: product.precio || 0,
    rotacion: product.porcentaje_rotacion || 0,
    totalSales: product.total_ventas || 0,
  };
};

export const formatSalesDataForChart = (salesData) => {
  return salesData.map(item => ({
    name: item.categoria || item.talla || item.genero || 'Otro',
    value: item.totalQuantity || 0,
    revenue: item.totalRevenue || 0,
  }));
};

export const formatTopProductsForChart = (products) => {
  return products.map(product => ({
    name: product.name || product.nombre,
    quantity: product.totalQuantity || 0,
    revenue: product.totalRevenue || 0,
  }));
};
