// Hook personalizado para análisis y KPIs
import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [monthlyAverage, setMonthlyAverage] = useState(null);
  const [inventoryRotation, setInventoryRotation] = useState(null);
  const [lowRotationProducts, setLowRotationProducts] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesBySize, setSalesBySize] = useState([]);
  const [salesByGender, setSalesByGender] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        topProductsResult,
        monthlyAvgResult,
        rotationResult,
        lowRotationResult,
        categoryResult,
        sizeResult,
        genderResult,
      ] = await Promise.all([
        analyticsService.getTopProductsThisMonth(5),
        analyticsService.getMonthlyAverageSales(),
        analyticsService.getInventoryRotation(),
        analyticsService.getLowRotationProducts(20),
        analyticsService.getSalesByCategory(),
        analyticsService.getSalesBySize(),
        analyticsService.getSalesByGender(),
      ]);

      if (topProductsResult.error) throw topProductsResult.error;
      if (monthlyAvgResult.error) throw monthlyAvgResult.error;
      if (rotationResult.error) throw rotationResult.error;
      if (lowRotationResult.error) throw lowRotationResult.error;
      if (categoryResult.error) throw categoryResult.error;
      if (sizeResult.error) throw sizeResult.error;
      if (genderResult.error) throw genderResult.error;

      setTopProducts(topProductsResult.data || []);
      setMonthlyAverage(monthlyAvgResult.data || null);
      setInventoryRotation(rotationResult.data || null);
      setLowRotationProducts(lowRotationResult.data || []);
      setSalesByCategory(categoryResult.data || []);
      setSalesBySize(sizeResult.data || []);
      setSalesByGender(genderResult.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = () => {
    fetchAllAnalytics();
  };

  return {
    topProducts,
    monthlyAverage,
    inventoryRotation,
    lowRotationProducts,
    salesByCategory,
    salesBySize,
    salesByGender,
    loading,
    error,
    refreshAnalytics,
  };
};

