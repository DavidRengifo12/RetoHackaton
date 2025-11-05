// Hook personalizado para productos
import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.gender, filters.search]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      
      if (filters.search) {
        result = await productService.searchProducts(filters.search);
      } else if (filters.category) {
        result = await productService.filterByCategory(filters.category);
      } else if (filters.gender) {
        result = await productService.filterByGender(filters.gender);
      } else {
        result = await productService.getProductsWithStats();
      }

      if (result.error) throw result.error;
      setProducts(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refreshProducts,
  };
};

