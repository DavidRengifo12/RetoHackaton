# 📋 CASO DEL RETO: HACKATÓN DE PROGRAMACIÓN 2025

## 🎯 PROBLEMA PRINCIPAL

Las empresas de retail y gestión de inventario enfrentan dificultades para:
- **Optimizar el inventario**: No tienen visibilidad clara de qué productos se venden más y cuáles tienen baja rotación
- **Tomar decisiones basadas en datos**: La información de ventas está dispersa y no se analiza de forma estructurada
- **Predecir demanda**: No pueden anticipar cuándo reponer stock o aplicar descuentos estratégicos
- **Gestionar múltiples categorías**: Productos por género, talla, categoría requieren análisis diferenciado

## 🎯 OBJETIVOS DEL SISTEMA

1. **Visualización de Inventario en Tiempo Real**
   - Mostrar estado actual de productos (stock, ventas, rotación)
   - Filtrar y buscar productos por múltiples criterios

2. **Análisis de Ventas**
   - Identificar productos más vendidos por categoría
   - Analizar tendencias de venta por talla, género y grupo de edad
   - Calcular porcentaje de rotación de inventario

3. **KPIs Automáticos**
   - Top 5 productos más vendidos del mes
   - Promedio de ventas mensual
   - Porcentaje de rotación de inventario
   - Alertas de productos con baja rotación (<20%)

4. **Recomendaciones Inteligentes**
   - Sugerir descuentos para productos con baja rotación
   - Alertar sobre productos con alta demanda para aumentar stock
   - Optimizar estrategias de venta basadas en datos históricos

5. **Carga Masiva de Datos**
   - Importar datos históricos desde CSV/Excel
   - Validar y procesar datos antes de guardarlos

## 📊 INDICADORES QUE SE DEBEN MOSTRAR

### KPIs Principales
- **Top 5 Productos Más Vendidos** (mes actual)
- **Promedio de Ventas Mensual** (mes actual vs. mes anterior)
- **Porcentaje de Rotación de Inventario** (general y por producto)
- **Productos con Baja Rotación** (<20% - sugerir descuentos)

### Visualizaciones
1. **Gráfico de Barras**: Productos más vendidos por categoría
2. **Gráfico de Pastel**: Distribución de ventas por talla
3. **Gráfico de Líneas**: Comparativo de ventas por género o grupo de edad
4. **Indicador KPI**: Porcentaje de rotación mensual

### Tabla de Inventario
- Nombre del producto
- Categoría
- Talla
- Stock actual
- Total de ventas
- Porcentaje de rotación (%)

## 🧩 MÓDULOS DEL SISTEMA

### 1. **Módulo de Autenticación**
   - Login con Supabase Auth
   - Protección de rutas
   - Gestión de sesiones

### 2. **Módulo de Inventario**
   - Listado de productos con filtros y búsqueda
   - Visualización de stock, ventas y rotación
   - Búsqueda por nombre
   - Filtros por categoría y género
   - Tabla interactiva con paginación

### 3. **Módulo de Dashboard**
   - Panel principal con KPIs
   - Gráficos interactivos (Chart.js/Recharts)
   - Resumen ejecutivo de métricas clave
   - Comparativos temporales

### 4. **Módulo de Carga de Datos**
   - Subida de archivos CSV/Excel
   - Validación de datos
   - Procesamiento y almacenamiento en Supabase
   - Feedback de carga exitosa/errores

### 5. **Módulo de Análisis**
   - Cálculo automático de KPIs
   - Análisis de tendencias
   - Reportes generados automáticamente

### 6. **Módulo de Recomendaciones**
   - Sistema de reglas lógicas / IA básica
   - Sugerencias de acciones (descuentos, reposición)
   - Alertas visuales
   - Notificaciones de productos críticos

## 🏗️ ARQUITECTURA TÉCNICA

### Frontend
- **React 19** - Framework principal
- **React Router** - Navegación
- **Tailwind CSS** - Estilos utilitarios
- **Bootstrap** - Componentes UI adicionales
- **Recharts** - Visualizaciones de datos

### Backend
- **Supabase** - Base de datos PostgreSQL
- **Supabase Auth** - Autenticación
- **Row Level Security (RLS)** - Seguridad de datos
- **API REST** - Comunicación con Supabase

### Despliegue
- **Vercel/Netlify** - Hosting frontend
- **Supabase Cloud** - Base de datos y backend

## 📈 VALOR AGREGADO

1. **Decisiones basadas en datos**: Análisis en tiempo real de inventario y ventas
2. **Automatización**: KPIs y recomendaciones calculados automáticamente
3. **Escalabilidad**: Arquitectura preparada para crecer
4. **UX Moderna**: Interfaz intuitiva con visualizaciones claras
5. **Integración futura**: Base para app móvil con React Native/Expo

