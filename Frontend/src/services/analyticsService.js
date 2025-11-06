// Servicios para análisis y KPIs
import supabase from './supabase';
import { salesService } from './salesService';
import { productService } from './productService';

export const analyticsService = {
  // Top 5 productos más vendidos del mes
  async getTopProductsThisMonth(limit = 5) {
    const { data: sales, error } = await salesService.getCurrentMonthSales();
    if (error) return { data: null, error };
    if (!sales || !Array.isArray(sales)) return { data: [], error: null };

    // Agrupar por producto y sumar cantidades
    const productSales = {};
    sales.forEach(sale => {
      const productName = sale.nombre_producto;
      if (!productSales[productName]) {
        productSales[productName] = {
          name: productName,
          producto_id: sale.producto_id,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      productSales[productName].totalQuantity += sale.cantidad;
      productSales[productName].totalRevenue += sale.precio_unitario * sale.cantidad;
    });

    // Ordenar y tomar top N
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);

    return { data: topProducts, error: null };
  },

  // Promedio de ventas mensual
  async getMonthlyAverageSales() {
    const { data: currentMonthSales, error: currentError } = await salesService.getCurrentMonthSales();
    if (currentError) return { data: null, error: currentError };
    if (!currentMonthSales || !Array.isArray(currentMonthSales)) return { data: null, error: new Error('Datos de ventas inválidos') };

    // Calcular mes anterior
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const startLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const endLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59);

    const { data: lastMonthSales, error: lastError } = await salesService.getSalesByDateRange(
      startLastMonth.toISOString(),
      endLastMonth.toISOString()
    );
    if (lastError) return { data: null, error: lastError };
    if (!lastMonthSales || !Array.isArray(lastMonthSales)) return { data: null, error: new Error('Datos de ventas inválidos') };

    const currentTotal = (currentMonthSales || []).reduce((sum, sale) => sum + (sale.precio_total || 0), 0);
    const lastTotal = (lastMonthSales || []).reduce((sum, sale) => sum + (sale.precio_total || 0), 0);

    const currentDays = new Date().getDate();
    const lastDays = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).getDate();

    const currentAvg = currentTotal / currentDays;
    const lastAvg = lastTotal / lastDays;

    return {
      data: {
        current: currentAvg,
        last: lastAvg,
        change: ((currentAvg - lastAvg) / lastAvg) * 100,
      },
      error: null,
    };
  },

  // Porcentaje de rotación de inventario
  async getInventoryRotation() {
    const { data: products, error } = await productService.getProductsWithStats();
    if (error) return { data: null, error };
    if (!products || !Array.isArray(products)) return { data: { average: 0, products: [] }, error: null };

    const totalRotation = products.reduce((sum, p) => sum + (p.porcentaje_rotacion || 0), 0);
    const averageRotation = products.length > 0 ? totalRotation / products.length : 0;

    return {
      data: {
        average: averageRotation,
        products: products.map(p => ({
          id: p.id,
          nombre: p.nombre,
          rotacion: p.porcentaje_rotacion || 0,
        })),
      },
      error: null,
    };
  },

  // Productos con baja rotación (<20%)
  async getLowRotationProducts(threshold = 20) {
    const { data: products, error } = await productService.getProductsWithStats();
    if (error) return { data: null, error };
    if (!products || !Array.isArray(products)) return { data: [], error: null };

    const lowRotation = products.filter(p => (p.porcentaje_rotacion || 0) < threshold);

    return {
      data: lowRotation,
      error: null,
    };
  },

  // Ventas por categoría
  async getSalesByCategory() {
    const { data: sales, error } = await salesService.getCurrentMonthSales();
    if (error) return { data: null, error };
    if (!sales || !Array.isArray(sales)) return { data: [], error: null };

    // Obtener categorías de productos
    const { data: products } = await productService.getAllProducts();
    const productCategories = {};
    if (products && Array.isArray(products)) {
      products.forEach(p => {
        productCategories[p.id] = p.categoria;
      });
    }

    // Agrupar ventas por categoría
    const categorySales = {};
    sales.forEach(sale => {
      const category = productCategories[sale.producto_id] || 'Sin categoría';
      if (!categorySales[category]) {
        categorySales[category] = { categoria: category, totalQuantity: 0, totalRevenue: 0 };
      }
      categorySales[category].totalQuantity += sale.cantidad;
      categorySales[category].totalRevenue += sale.precio_total || 0;
    });

    return {
      data: Object.values(categorySales),
      error: null,
    };
  },

  // Ventas por talla
  async getSalesBySize() {
    const { data: sales, error } = await salesService.getCurrentMonthSales();
    if (error) return { data: null, error };
    if (!sales || !Array.isArray(sales)) return { data: [], error: null };

    // Obtener tallas de productos
    const { data: products } = await productService.getAllProducts();
    const productSizes = {};
    if (products && Array.isArray(products)) {
      products.forEach(p => {
        productSizes[p.id] = p.talla;
      });
    }

    // Agrupar ventas por talla
    const sizeSales = {};
    sales.forEach(sale => {
      const size = productSizes[sale.producto_id] || 'Sin talla';
      if (!sizeSales[size]) {
        sizeSales[size] = { talla: size, totalQuantity: 0 };
      }
      sizeSales[size].totalQuantity += sale.cantidad;
    });

    return {
      data: Object.values(sizeSales),
      error: null,
    };
  },

  // Ventas por género
  async getSalesByGender() {
    const { data: sales, error } = await salesService.getCurrentMonthSales();
    if (error) return { data: null, error };
    if (!sales || !Array.isArray(sales)) return { data: [], error: null };

    // Obtener géneros de productos
    const { data: products } = await productService.getAllProducts();
    const productGenders = {};
    if (products && Array.isArray(products)) {
      products.forEach(p => {
        productGenders[p.id] = p.genero;
      });
    }

    // Agrupar ventas por género
    const genderSales = {};
    sales.forEach(sale => {
      const gender = productGenders[sale.producto_id] || 'Sin género';
      if (!genderSales[gender]) {
        genderSales[gender] = { genero: gender, totalQuantity: 0, totalRevenue: 0 };
      }
      genderSales[gender].totalQuantity += sale.cantidad;
      genderSales[gender].totalRevenue += sale.precio_total || 0;
    });

    return {
      data: Object.values(genderSales),
      error: null,
    };
  },
};
