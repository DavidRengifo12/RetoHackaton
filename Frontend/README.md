# 📊 Sistema de Gestión de Inventario y Ventas
## Hackatón de Programación 2025

Sistema web moderno para la gestión inteligente de inventario y análisis de ventas, desarrollado con React, Supabase y tecnologías de visualización de datos.

---

## 🎯 Descripción del Proyecto

Este sistema permite a empresas de retail gestionar su inventario de manera eficiente, analizar patrones de venta y tomar decisiones basadas en datos. El sistema incluye:

- **Gestión de Inventario**: Visualización completa de productos con filtros y búsqueda avanzada
- **Dashboard Analítico**: KPIs automáticos y visualizaciones interactivas
- **Análisis de Ventas**: Gráficos de barras, pastel y líneas para identificar tendencias
- **Recomendaciones Automáticas**: Sistema inteligente que sugiere acciones basadas en datos
- **Carga Masiva de Datos**: Importación de datos históricos desde CSV/Excel

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca UI moderna
- **React Router DOM 7** - Enrutamiento SPA
- **Tailwind CSS 4** - Framework CSS utility-first
- **Bootstrap 5** - Componentes UI y grid system
- **Recharts 2** - Biblioteca de gráficos interactivos
- **React Icons** - Iconos SVG

### Backend y Base de Datos
- **Supabase** - Backend as a Service
  - PostgreSQL - Base de datos relacional
  - Supabase Auth - Autenticación y autorización
  - Row Level Security (RLS) - Seguridad a nivel de fila
  - API REST - Endpoints automáticos

### Herramientas
- **Vite** - Build tool y dev server
- **XLSX** - Parser de archivos Excel
- **ESLint** - Linter de código

---

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (gratuita)
- Git

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd RetoHackaton/Frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto `Frontend/` con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

**Obtén estas credenciales desde tu proyecto en Supabase:**
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia la URL y la Anon Key

### 4. Configurar la base de datos

Ejecuta el script SQL en Supabase:

1. Ve a SQL Editor en tu proyecto de Supabase
2. Copia y ejecuta el contenido de `database/01_tables_insertions.sql`
3. Esto creará las tablas, índices, políticas RLS y datos de ejemplo

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
Frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/            # Recursos (imágenes, estilos)
│   │   ├── images/
│   │   └── styles/
│   ├── components/        # Componentes reutilizables
│   │   ├── common/        # Navbar, Loading, ErrorBoundary
│   │   ├── charts/        # Componentes de gráficos
│   │   ├── dashboard/     # Componentes del dashboard
│   │   └── inventory/     # Componentes de inventario
│   ├── context/           # Context API (AuthContext)
│   ├── hooks/             # Custom hooks (useAuth, useProducts, useAnalytics)
│   ├── pages/             # Páginas principales
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── InventoryPage.jsx
│   │   └── UploadPage.jsx
│   ├── services/          # Servicios de API
│   │   ├── supabase.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── salesService.js
│   │   └── analyticsService.js
│   ├── utils/             # Utilidades
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── csvParser.js
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   ├── Supabase.ts        # Configuración de Supabase
│   └── index.css          # Estilos globales
├── database/              # Scripts SQL
│   └── 01_tables_insertions.sql
├── .env.example           # Ejemplo de variables de entorno
├── package.json
└── README.md
```

---

## 👥 Roles del Equipo

### Desarrollo Frontend
- Implementación de componentes React
- Integración con Supabase
- Diseño UI/UX con Tailwind y Bootstrap

### Desarrollo Backend
- Diseño de esquema de base de datos
- Configuración de Supabase y RLS
- Servicios de API y lógica de negocio

### Análisis y Visualización
- Implementación de gráficos con Recharts
- Cálculo de KPIs automáticos
- Sistema de recomendaciones

### Documentación
- README y documentación técnica
- Guion de presentación
- Manual de usuario

---

## 🎨 Funcionalidades Principales

### 1. Autenticación
- Login con email y contraseña
- Protección de rutas con autenticación
- Gestión de sesiones con Supabase Auth

### 2. Dashboard Analítico
- **KPIs Principales**:
  - Promedio de ventas mensual
  - Rotación de inventario
  - Top 5 productos más vendidos
  - Productos con baja rotación

- **Visualizaciones**:
  - Gráfico de barras: Top 5 productos más vendidos
  - Gráfico de barras: Ventas por categoría
  - Gráfico de pastel: Distribución de ventas por talla
  - Gráfico de líneas: Ventas por género

### 3. Gestión de Inventario
- Listado completo de productos
- Búsqueda por nombre
- Filtros por categoría y género
- Columnas: nombre, categoría, talla, stock, ventas, rotación

### 4. Carga de Datos
- Importación de archivos CSV/Excel
- Validación de datos antes de insertar
- Procesamiento masivo de ventas históricas
- Feedback de errores y éxito

### 5. Recomendaciones Automáticas
- Sugerencias de descuentos para productos con baja rotación
- Alertas de productos con stock bajo y alta rotación
- Recomendaciones de reposición de inventario

---

## 📊 Indicadores y KPIs

### KPIs Principales
1. **Top 5 Productos Más Vendidos** (mes actual)
2. **Promedio de Ventas Mensual** (comparativo mes anterior)
3. **Porcentaje de Rotación de Inventario** (general y por producto)
4. **Productos con Baja Rotación** (<20% - sugerir descuentos)

### Visualizaciones
- Gráfico de barras: Productos más vendidos por categoría
- Gráfico de pastel: Distribución de ventas por talla
- Gráfico de líneas: Comparativo de ventas por género
- Indicadores KPI: Porcentaje de rotación mensual

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Despliega:
```bash
cd Frontend
vercel
```

3. Configura variables de entorno en Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Netlify

1. Instala Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Despliega:
```bash
cd Frontend
netlify deploy --prod
```

3. Configura variables de entorno en Netlify Dashboard

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Crea build de producción
npm run preview      # Preview del build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 🔒 Seguridad

- **Row Level Security (RLS)**: Todas las tablas tienen RLS habilitado
- **Autenticación**: JWT tokens manejados por Supabase
- **Validación**: Validación en frontend y backend
- **Sanitización**: Datos sanitizados antes de insertar

---

## 🧪 Pruebas

Para ejecutar pruebas (cuando estén implementadas):

```bash
npm test
```

---

## 📚 Documentación Adicional

- [Documentación de React](https://react.dev)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Recharts](https://recharts.org)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Bootstrap](https://getbootstrap.com/docs)

---

## 🤝 Contribuciones

Este proyecto fue desarrollado para el Hackatón de Programación 2025. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto fue desarrollado para el Hackatón de Programación 2025.

---

## 👨‍💻 Autores

Equipo de desarrollo del Hackatón de Programación 2025

---

## 🔗 Enlaces

- **Repositorio**: [GitHub](https://github.com/tu-usuario/reto-hackaton)
- **Despliegue**: [Vercel/Netlify](https://tu-proyecto.vercel.app)
- **Documentación**: Ver archivos `CASO_RETO.md` y `ARQUITECTURA.md`

---

## 📞 Soporte

Para soporte, abre un issue en el repositorio o contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para el Hackatón de Programación 2025**
