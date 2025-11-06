// Funciones auxiliares generales

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getRotationColor = (percentage) => {
  if (percentage >= 50) return "text-success";
  if (percentage >= 20) return "text-warning";
  return "text-danger";
};

export const getRotationBadge = (percentage) => {
  if (percentage >= 50) return "bg-success";
  if (percentage >= 20) return "bg-warning";
  return "bg-danger";
};

// Helper para obtener URL de imagen de producto
export const getProductImageUrl = (product) => {
  if (!product || !product.imagen_url) return null;

  // Si ya es una URL completa, retornarla
  if (
    product.imagen_url.startsWith("http://") ||
    product.imagen_url.startsWith("https://")
  ) {
    return product.imagen_url;
  }

  // Si es una ruta del bucket, necesitamos importar el servicio
  // Por ahora retornamos null y se procesará en el componente
  return product.imagen_url;
};
