// Utilidad de debugging para autenticación
export const debugAuth = {
  log: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH DEBUG] ${message}`, data || '');
    }
  },
  
  error: (message, error) => {
    console.error(`[AUTH ERROR] ${message}`, error);
  },
  
  warn: (message, data = null) => {
    console.warn(`[AUTH WARN] ${message}`, data || '');
  }
};

