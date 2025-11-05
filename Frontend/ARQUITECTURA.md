# 🏗️ ARQUITECTURA DEL SISTEMA

## 📐 DISEÑO DE ARQUITECTURA

### Stack Tecnológico

#### Frontend
- **React 19** - Biblioteca UI con hooks y componentes funcionales
- **React Router DOM** - Enrutamiento y navegación SPA
- **Tailwind CSS 4** - Framework CSS utility-first
- **Bootstrap 5** - Componentes UI y grid system
- **Recharts** - Biblioteca de gráficos para React
- **React Icons** - Iconos SVG

#### Backend y Base de Datos
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL - Base de datos relacional
  - Supabase Auth - Autenticación y autorización
  - Row Level Security (RLS) - Seguridad a nivel de fila
  - API REST - Endpoints automáticos desde tablas
  - Realtime - Actualizaciones en tiempo real (opcional)

#### Visualización
- **Recharts** - Gráficos de barras, pastel, líneas
- **Chart.js** (alternativa) - Si se requiere más personalización

#### Despliegue
- **Vercel** - Frontend (recomendado para React)
- **Netlify** - Alternativa para frontend
- **Supabase Cloud** - Base de datos y backend

## 🔄 COMUNICACIÓN ENTRE COMPONENTES

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Pages   │  │Components│  │  Router  │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │                    │
│       └─────────────┼─────────────┘                    │
│                     │                                    │
│              ┌──────▼──────┐                            │
│              │  Services   │                            │
│              │  (Supabase) │                            │
│              └──────┬──────┘                            │
└─────────────────────┼───────────────────────────────────┘
                      │
                      │ HTTP/HTTPS
                      │ API REST
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    SUPABASE                             │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │  PostgreSQL  │  │     Auth     │                   │
│  │   Database   │  │              │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                          │
│  - products (tabla)                                     │
│  - sales (tabla)                                        │
│  - RLS Policies                                         │
│  - Views (products_with_stats)                          │
└──────────────────────────────────────────────────────────┘
```

## 📁 ESTRUCTURA DE CARPETAS DEL PROYECTO

```
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── images/          # Imágenes del proyecto
│   │   └── styles/           # Estilos globales adicionales
│   │       └── globals.css
│   ├── components/
│   │   ├── common/           # Componentes reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── charts/           # Componentes de gráficos
│   │   │   ├── BarChart.jsx
│   │   │   ├── PieChart.jsx
│   │   │   └── LineChart.jsx
│   │   ├── inventory/        # Componentes de inventario
│   │   │   ├── ProductTable.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   └── ProductCard.jsx
│   │   └── dashboard/        # Componentes de dashboard
│   │       ├── KPICard.jsx
│   │       ├── StatsCard.jsx
│   │       └── Recommendations.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx     # Página de login
│   │   ├── DashboardPage.jsx # Dashboard principal
│   │   ├── InventoryPage.jsx # Gestión de inventario
│   │   └── UploadPage.jsx    # Carga de datos CSV/Excel
│   ├── services/
│   │   ├── supabase.js       # Cliente de Supabase
│   │   ├── authService.js    # Servicios de autenticación
│   │   ├── productService.js # CRUD de productos
│   │   ├── salesService.js   # CRUD de ventas
│   │   └── analyticsService.js # Cálculo de KPIs
│   ├── utils/
│   │   ├── helpers.js        # Funciones auxiliares
│   │   ├── validators.js     # Validación de datos
│   │   ├── formatters.js     # Formato de datos
│   │   └── csvParser.js      # Parser de CSV/Excel
│   ├── hooks/
│   │   ├── useAuth.js        # Hook de autenticación
│   │   ├── useProducts.js    # Hook de productos
│   │   └── useAnalytics.js   # Hook de análisis
│   ├── context/
│   │   └── AuthContext.jsx   # Context de autenticación
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Punto de entrada
│   ├── Supabase.ts           # Configuración de Supabase
│   ├── index.css             # Estilos globales
│   └── App.css               # Estilos del App
├── .env.example              # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🔌 FLUJO DE DATOS

### 1. **Autenticación**
```
Usuario → LoginPage → authService → Supabase Auth → Token JWT
                                                      ↓
                                              Guardado en localStorage
                                                      ↓
                                              AuthContext actualizado
```

### 2. **Consulta de Productos**
```
InventoryPage → useProducts hook → productService → Supabase API
                                                      ↓
                                              PostgreSQL Query
                                                      ↓
                                              RLS Policy Check
                                                      ↓
                                              Datos devueltos
                                                      ↓
                                              Estado actualizado
                                                      ↓
                                              Renderizado en tabla
```

### 3. **Cálculo de KPIs**
```
DashboardPage → useAnalytics hook → analyticsService → Supabase API
                                                         ↓
                                              Query con agregaciones
                                                         ↓
                                              Cálculo de métricas
                                                         ↓
                                              Transformación de datos
                                                         ↓
                                              Recharts recibe datos
                                                         ↓
                                              Gráficos renderizados
```

### 4. **Carga de Datos CSV**
```
UploadPage → Usuario selecciona archivo → csvParser.js
                                              ↓
                                              Validación
                                              ↓
                                              Transformación
                                              ↓
                                              salesService → Supabase API
                                              ↓
                                              Inserción masiva
                                              ↓
                                              Feedback al usuario
```

## 🔐 SEGURIDAD

### Row Level Security (RLS)
- Todas las tablas tienen RLS habilitado
- Solo usuarios autenticados pueden leer/escribir
- Políticas definidas en Supabase

### Autenticación
- JWT tokens manejados por Supabase
- Tokens almacenados en localStorage (con consideraciones de seguridad)
- Refresh tokens automáticos

### Validación
- Validación en frontend (UX)
- Validación en backend (Seguridad)
- Sanitización de datos antes de insertar

## 🚀 OPTIMIZACIONES

### Rendimiento
- Lazy loading de rutas
- Memoización de componentes pesados
- Índices en base de datos para búsquedas rápidas
- Paginación en tablas grandes

### Caching
- React Query (opcional) para cache de datos
- LocalStorage para preferencias del usuario

### Escalabilidad
- Separación de concerns (services, components, pages)
- Hooks reutilizables
- Componentes modulares
- API RESTful estándar

