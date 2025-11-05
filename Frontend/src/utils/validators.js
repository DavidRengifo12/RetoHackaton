// Funciones de validación

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 6 caracteres
  return password.length >= 6;
};

export const validateProduct = (product) => {
  const errors = {};

  if (!product.name || product.name.trim().length === 0) {
    errors.name = 'El nombre es requerido';
  }

  if (product.stock !== undefined && (isNaN(product.stock) || product.stock < 0)) {
    errors.stock = 'El stock debe ser un número mayor o igual a 0';
  }

  if (product.price !== undefined && (isNaN(product.price) || product.price < 0)) {
    errors.price = 'El precio debe ser un número mayor o igual a 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSale = (sale) => {
  const errors = {};

  if (!sale.product_name || sale.product_name.trim().length === 0) {
    errors.product_name = 'El nombre del producto es requerido';
  }

  if (!sale.quantity || isNaN(sale.quantity) || sale.quantity <= 0) {
    errors.quantity = 'La cantidad debe ser un número mayor a 0';
  }

  if (!sale.price || isNaN(sale.price) || sale.price <= 0) {
    errors.price = 'El precio debe ser un número mayor a 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

