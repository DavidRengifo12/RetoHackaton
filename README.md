# 🏪 Sistema de Gestión de Inventario Inteligente

Sistema completo de gestión de inventario y análisis de ventas con inteligencia artificial, desarrollado para el Hackatón de Programación 2025.

## 📋 Descripción

Sistema web moderno para la gestión integral de inventarios de tiendas de moda, con análisis de ventas en tiempo real, recomendaciones inteligentes y agentes de IA especializados. Permite gestionar productos, analizar ventas, calcular KPIs automáticamente y obtener insights mediante asistentes virtuales.

## 🚀 Características Principales

- ✅ **Gestión de Inventario**: Control completo de productos con filtros avanzados
- ✅ **Dashboard Analítico**: KPIs, gráficos y métricas en tiempo real
- ✅ **Agentes de IA**: Asistentes especializados para consultas inteligentes
- ✅ **E-commerce Integrado**: Tienda online con carrito de compras
- ✅ **Análisis de Ventas**: Reportes detallados por categoría, talla y género
- ✅ **Recomendaciones Automáticas**: Sugerencias de descuentos y reposición
- ✅ **Carga Masiva de Datos**: Importación desde CSV/Excel
- ✅ **Sistema de Pagos**: Integración con PSE, Nequi y tarjetas
- ✅ **Autenticación Segura**: Login y registro con roles (admin/usuario)
- ✅ **App Móvil**: QR para descarga de aplicación móvil

## 🛠️ Stack Tecnológico

### Frontend

- **React 19** - Framework UI con hooks y componentes funcionales
- **React Router DOM 7** - Enrutamiento y navegación SPA
- **Vite** - Build tool y dev server (rolldown-vite)
- **Tailwind CSS 4** - Framework CSS utility-first
- **Bootstrap 5** - Componentes UI y grid system
- **Recharts** - Biblioteca de gráficos interactivos
- **React Icons** - Iconos SVG
- **React Toastify** - Notificaciones toast
- **XLSX** - Parser de archivos Excel

### Backend y Base de Datos

- **Supabase** - Backend as a Service (BaaS)
  - **PostgreSQL** - Base de datos relacional
  - **Supabase Auth** - Autenticación y autorización
  - **Row Level Security (RLS)** - Seguridad a nivel de fila
  - **API REST** - Endpoints automáticos desde tablas
  - **Storage** - Almacenamiento de imágenes de productos

### Inteligencia Artificial

- **OpenAI GPT-4o** - Modelo de lenguaje para mejorar respuestas
- **Agentes Especializados**:
  - Agente de Inventario
  - Agente Analista
  - Agente Cliente
  - Agente Coordinador (MCP)

### Integraciones

- **n8n** - Automatización de workflows (envío de comprobantes por email)
- **Email Service** - Envío de comprobantes de pago

### Despliegue

- **Vercel/Netlify** - Hosting frontend
- **Supabase Cloud** - Base de datos y backend

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Pages    │  │ Components │  │   Router   │           │
│  │            │  │            │  │            │           │
│  │ Dashboard  │  │  Charts    │  │  Routes    │           │
│  │ Inventory  │  │  Chat      │  │  Guards    │           │
│  │ Shop       │  │  Common    │  │            │           │
│  │ Agents     │  │            │  │            │           │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘           │
│        │               │               │                    │
│        └───────────────┼───────────────┘                    │
│                        │                                    │
│                 ┌──────▼──────┐                              │
│                 │  Services  │                              │
│                 │            │                              │
│                 │ Supabase   │                              │
│                 │ OpenAI     │                              │
│                 │ n8n        │                              │
│                 │ Analytics  │                              │
│                 └──────┬──────┘                              │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │ API REST
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                    SUPABASE (Backend)                         │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │     Auth     │  │   Storage   │     │
│  │   Database   │  │              │  │             │     │
│  │              │  │  JWT Tokens  │  │  Images     │     │
│  │  - productos │  │  Sessions    │  │  Files      │     │
│  │  - ventas    │  │              │  │             │     │
│  │  - usuarios  │  │              │  │             │     │
│  │  - RLS       │  │              │  │             │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────────────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼─────────────────────────────────────┐
│              SERVICIOS EXTERNOS                               │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   OpenAI     │  │     n8n      │                        │
│  │              │  │              │                        │
│  │  GPT-4o      │  │  Workflows   │                        │
│  │  API         │  │  Email       │                        │
│  └──────────────┘  └──────────────┘                        │
└───────────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
RetoHackaton/
├── Frontend/                          # Aplicación React
│   ├── public/                        # Archivos estáticos
│   │   └── img/                        # Imágenes (logos, QR, etc.)
│   ├── src/
│   │   ├── Agents/                    # Agentes de IA
│   │   │   ├── agenteAnalista.js
│   │   │   ├── agenteCliente.js
│   │   │   └── agenteInventario.js
│   │   ├── components/                 # Componentes React
│   │   │   ├── charts/                 # Gráficos (Bar, Pie, Line)
│   │   │   ├── Chat/                   # Componentes de chat IA
│   │   │   ├── common/                 # Componentes comunes
│   │   │   ├── dashboard/              # Componentes del dashboard
│   │   │   └── shop/                   # Componentes de tienda
│   │   ├── context/                     # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/                      # Custom hooks
│   │   │   ├── useAnalytics.js
│   │   │   ├── useAuth.js
│   │   │   └── useProducts.js
│   │   ├── mcp/                        # Model Context Protocol
│   │   │   └── mcpManager.js
│   │   ├── pages/                      # Páginas principales
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── AgentsPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   └── ...
│   │   ├── services/                   # Servicios de API
│   │   │   ├── supabase.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── salesService.js
│   │   │   ├── openaiService.js
│   │   │   ├── n8n.js
│   │   │   └── ...
│   │   ├── utils/                      # Utilidades
│   │   │   ├── formatters.js
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   └── csvParser.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── database/                           # Scripts SQL
    ├── 01_tablas.sql                   # Estructura de tablas
    ├── 02_triggers.sql                 # Triggers automáticos
    ├── 03_policies.sql                 # Políticas RLS
    ├── 04_datos_ejemplo.sql           # Datos de ejemplo
    ├── 05_agregar_saldo_usuarios.sql   # Campo saldo
    ├── 06_crear_bucket_storage.sql     # Storage bucket
    └── 07_politicas_storage.sql        # Políticas storage
```

## 🔄 Flujo de Datos

### 1. Autenticación

```
Usuario → LoginPage → authService → Supabase Auth → JWT Token
                                                      ↓
                                              localStorage
                                                      ↓
                                              AuthContext
```

### 2. Consulta de Productos

```
InventoryPage → useProducts → productService → Supabase API
                                                    ↓
                                            PostgreSQL Query
                                                    ↓
                                            RLS Policy Check
                                                    ↓
                                            Datos → Estado React
```

### 3. Cálculo de KPIs

```
DashboardPage → useAnalytics → analyticsService → Supabase
                                                      ↓
                                            Agregaciones SQL
                                                      ↓
                                            Transformación
                                                      ↓
                                            Recharts → Gráficos
```

### 4. Agentes de IA

```
AgentsPage → Chat Component → Agent Service → OpenAI API
                                                    ↓
                                            GPT-4o Processing
                                                    ↓
                                            Respuesta Mejorada
                                                    ↓
                                            UI Update
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta de Supabase
- (Opcional) API Key de OpenAI
- (Opcional) Instancia de n8n

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd RetoHackaton
```

### 2. Configurar Base de Datos

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar scripts SQL en orden:
   ```sql
   -- En Supabase SQL Editor
   01_tablas.sql
   02_triggers.sql
   03_policies.sql
   04_datos_ejemplo.sql
   05_agregar_saldo_usuarios.sql (opcional)
   06_crear_bucket_storage.sql (opcional)
   07_politicas_storage.sql (opcional)
   ```

### 3. Configurar Frontend

```bash
cd Frontend
npm install
```

### 4. Variables de Entorno

Crear archivo `.env` en `Frontend/`:

```env
# Supabase (Obligatorio)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima

# OpenAI (Opcional - para agentes IA)
VITE_OPENAI_API_KEY=tu-api-key-openai
VITE_OPENAI_MODEL=gpt-4o

# n8n (Opcional - para envío de emails)
VITE_N8N_WEBHOOK_URL=https://tu-n8n.com/webhook/comprobante
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 6. Build para Producción

```bash
npm run build
```

Los archivos se generan en `dist/`

## 📖 Uso del Sistema

### Roles de Usuario

- **Administrador**: Acceso completo (inventario, usuarios, dashboard)
- **Usuario Común**: Acceso a tienda, dashboard personal y agentes

### Funcionalidades Principales

#### Dashboard

- Visualización de KPIs en tiempo real
- Gráficos de ventas por categoría, talla y género
- Top productos más vendidos
- Recomendaciones automáticas

#### Inventario

- Listado completo de productos
- Filtros por categoría, género, talla
- Búsqueda por nombre
- Visualización de stock y rotación

#### Tienda

- Catálogo de productos
- Carrito de compras
- Sistema de pagos (PSE, Nequi, Tarjetas)
- Comprobantes por email

#### Agentes de IA

- **Agente Inventario**: Consultas sobre productos y stock
- **Agente Analista**: Análisis de ventas y rendimiento
- **Agente Cliente**: Asistente general para compras
- **Agente Coordinador**: Consultas complejas combinadas

## 🔐 Seguridad

- **Row Level Security (RLS)**: Todas las tablas protegidas
- **Autenticación JWT**: Tokens seguros manejados por Supabase
- **Políticas de Acceso**: Control granular por rol
- **Validación de Datos**: Frontend y backend
- **Sanitización**: Datos limpiados antes de insertar

## 🎨 Diseño y UX

- **Paleta de Colores**: Verde (#002f19) como color principal
- **Responsive Design**: Adaptable a móviles, tablets y desktop
- **Componentes Modernos**: UI limpia y profesional
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Feedback Visual**: Toasts, loading states, errores claros

## 📊 KPIs y Métricas

- **Promedio de Ventas Mensual**: Comparativo mes actual vs anterior
- **Rotación de Inventario**: Porcentaje de rotación por producto
- **Top 5 Productos**: Más vendidos del mes
- **Productos Baja Rotación**: Alertas para productos < 20%
- **Ventas por Categoría**: Distribución de ingresos
- **Ventas por Talla/Género**: Análisis demográfico

## 🤖 Agentes de IA

### Agente de Inventario

- Consultas sobre productos disponibles
- Búsqueda por características (talla, color, categoría)
- Información de stock en tiempo real

### Agente Analista

- Análisis de ventas y tendencias
- Cálculo de rotación de productos
- Reportes de rendimiento

### Agente Cliente

- Asistente para compras
- Recomendaciones de productos
- Información general de la tienda

### Agente Coordinador (MCP)

- Consultas complejas que combinan inventario y análisis
- Respuestas integradas de múltiples fuentes
- Análisis completo de negocio

## 🔧 Tecnologías y Herramientas

### Desarrollo

- **Vite**: Build tool ultra-rápido
- **ESLint**: Linting de código
- **React DevTools**: Debugging

### Base de Datos

- **PostgreSQL**: Base de datos relacional
- **Triggers**: Automatización de tareas
- **Views**: Vistas optimizadas para consultas
- **Índices**: Optimización de búsquedas

### Integraciones

- **n8n**: Automatización de workflows
- **OpenAI**: Procesamiento de lenguaje natural
- **Email**: Envío de comprobantes

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción
npm run build        # Build de producción
npm run preview      # Preview del build

# Calidad
npm run lint         # Linting del código
```

## 🐛 Troubleshooting

### Error de conexión a Supabase

- Verificar variables de entorno
- Comprobar URL y API key
- Revisar políticas RLS

### Error de autenticación

- Verificar que el usuario existe en Supabase Auth
- Comprobar políticas de acceso
- Revisar tokens en localStorage

### Error al cargar datos CSV

- Verificar formato del archivo
- Comprobar columnas requeridas
- Revisar permisos de usuario

## 📚 Documentación Adicional

- `database/README.md` - Guía de base de datos
- `Frontend/ARQUITECTURA.md` - Arquitectura detallada
- `Frontend/CASO_RETO.md` - Caso de uso del reto

## 🤝 Contribución

Este proyecto fue desarrollado para el Hackatón de Programación 2025.

## 📄 Licencia

Este proyecto es parte de un hackatón y está disponible para fines educativos.

## 👥 Autores

Desarrollado para el Hackatón de Programación 2025.

---

**¡Gracias por usar nuestro Sistema de Gestión de Inventario Inteligente! 🚀**
