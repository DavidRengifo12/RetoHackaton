# 📱 API de Pagos - Documentación para Móvil

## Endpoint: Crear Venta (POST)

### URL Base

```
Supabase REST API: https://[TU_PROYECTO].supabase.co/rest/v1/ventas
```

### Headers Requeridos

```json
{
  "apikey": "TU_API_KEY",
  "Authorization": "Bearer TU_ACCESS_TOKEN",
  "Content-Type": "application/json",
  "Prefer": "return=representation"
}
```

---

## 📋 Estructura de Datos para POST

### Datos Mínimos Requeridos

```json
{
  "nombre_producto": "Camiseta Básica Negra",
  "cantidad": 2,
  "precio_unitario": 29.99,
  "metodo_pago": "nequi",
  "usuario_id": "uuid-del-usuario"
}
```

### Datos Completos (Opcionales)

```json
{
  "producto_id": "uuid-del-producto",
  "nombre_producto": "Camiseta Básica Negra",
  "cliente_id": "uuid-del-cliente",
  "nombre_cliente": "Juan Pérez",
  "cantidad": 2,
  "precio_unitario": 29.99,
  "descuento": 0,
  "metodo_pago": "nequi",
  "notas": "Venta desde app móvil",
  "usuario_id": "uuid-del-usuario",
  "fecha_venta": "2025-01-15T10:30:00Z"
}
```

---

## 📝 Descripción de Campos

### Campos Requeridos

| Campo             | Tipo    | Descripción                              | Ejemplo                                  |
| ----------------- | ------- | ---------------------------------------- | ---------------------------------------- |
| `nombre_producto` | String  | Nombre del producto (máx 255 caracteres) | `"Camiseta Básica Negra"`                |
| `cantidad`        | Integer | Cantidad de productos (debe ser > 0)     | `2`                                      |
| `precio_unitario` | Decimal | Precio por unidad (debe ser >= 0)        | `29.99`                                  |
| `usuario_id`      | UUID    | ID del usuario que realiza la venta      | `"123e4567-e89b-12d3-a456-426614174000"` |

### Campos Opcionales

| Campo            | Tipo      | Descripción                                    | Ejemplo                                          |
| ---------------- | --------- | ---------------------------------------------- | ------------------------------------------------ |
| `producto_id`    | UUID      | ID del producto en la tabla productos          | `"123e4567-e89b-12d3-a456-426614174000"`         |
| `cliente_id`     | UUID      | ID del cliente en la tabla clientes            | `"123e4567-e89b-12d3-a456-426614174000"`         |
| `nombre_cliente` | String    | Nombre del cliente (máx 255 caracteres)        | `"Juan Pérez"`                                   |
| `descuento`      | Decimal   | Descuento aplicado (default: 0, debe ser >= 0) | `5.00`                                           |
| `metodo_pago`    | String    | Método de pago (máx 50 caracteres)             | `"nequi"`, `"mastercard"`, `"pse"`, `"efectivo"` |
| `notas`          | Text      | Notas adicionales sobre la venta               | `"Venta desde app móvil"`                        |
| `fecha_venta`    | Timestamp | Fecha y hora de la venta (ISO 8601)            | `"2025-01-15T10:30:00Z"`                         |

### Campos Generados Automáticamente

| Campo          | Tipo    | Descripción                                                  |
| -------------- | ------- | ------------------------------------------------------------ |
| `id`           | UUID    | ID único de la venta (generado automáticamente)              |
| `numero_venta` | String  | Número de venta único (generado por trigger)                 |
| `precio_total` | Decimal | Total calculado automáticamente (cantidad × precio_unitario) |

---

## 💳 Métodos de Pago Disponibles

```javascript
const METODOS_PAGO = [
  "nequi",
  "mastercard",
  "pse",
  "tarjeta_debito",
  "tarjeta_credito",
  "efectivo",
];
```

---

## 📤 Ejemplo de Request (cURL)

```bash
curl -X POST 'https://[TU_PROYECTO].supabase.co/rest/v1/ventas' \
  -H "apikey: TU_API_KEY" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "nombre_producto": "Camiseta Básica Negra",
    "cantidad": 2,
    "precio_unitario": 29.99,
    "metodo_pago": "nequi",
    "usuario_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

---

## 📤 Ejemplo de Request (JavaScript/Fetch)

```javascript
const crearVenta = async (ventaData) => {
  const response = await fetch(
    "https://[TU_PROYECTO].supabase.co/rest/v1/ventas",
    {
      method: "POST",
      headers: {
        apikey: "TU_API_KEY",
        Authorization: "Bearer TU_ACCESS_TOKEN",
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(ventaData),
    }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

// Uso
const ventaData = {
  nombre_producto: "Camiseta Básica Negra",
  cantidad: 2,
  precio_unitario: 29.99,
  metodo_pago: "nequi",
  usuario_id: "123e4567-e89b-12d3-a456-426614174000",
};

const resultado = await crearVenta(ventaData);
console.log("Venta creada:", resultado);
```

---

## 📤 Ejemplo de Request (React Native/Axios)

```javascript
import axios from "axios";

const crearVenta = async (ventaData) => {
  try {
    const response = await axios.post(
      "https://[TU_PROYECTO].supabase.co/rest/v1/ventas",
      ventaData,
      {
        headers: {
          apikey: "TU_API_KEY",
          Authorization: "Bearer TU_ACCESS_TOKEN",
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear venta:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Uso
const ventaData = {
  nombre_producto: "Camiseta Básica Negra",
  cantidad: 2,
  precio_unitario: 29.99,
  metodo_pago: "nequi",
  usuario_id: "123e4567-e89b-12d3-a456-426614174000",
};

const resultado = await crearVenta(ventaData);
console.log("Venta creada:", resultado);
```

---

## ✅ Respuesta Exitosa

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "numero_venta": "VENT-2025-001234",
  "producto_id": "123e4567-e89b-12d3-a456-426614174000",
  "nombre_producto": "Camiseta Básica Negra",
  "cliente_id": null,
  "nombre_cliente": null,
  "cantidad": 2,
  "precio_unitario": 29.99,
  "precio_total": 59.98,
  "descuento": 0,
  "metodo_pago": "nequi",
  "notas": null,
  "usuario_id": "123e4567-e89b-12d3-a456-426614174000",
  "fecha_venta": "2025-01-15T10:30:00Z"
}
```

---

## ❌ Respuesta de Error

```json
{
  "message": "new row violates row-level security policy",
  "code": "42501",
  "details": null,
  "hint": null
}
```

---

## 🔄 Comportamiento Automático

Al crear una venta, los triggers de la base de datos automáticamente:

1. **Generan el número de venta** único (formato: `VENT-YYYY-NNNNNN`)
2. **Actualizan el stock** del producto (reduce la cantidad)
3. **Registran el movimiento** en la tabla `movimientos_inventario`
4. **Calculan el precio_total** (cantidad × precio_unitario)

---

## 📱 Ejemplo Completo para Móvil

```javascript
// Función completa para crear venta desde móvil
const procesarPagoMovil = async (
  userId,
  items, // Array de productos
  metodoPago,
  clienteNombre = null
) => {
  const ventas = [];

  for (const item of items) {
    const ventaData = {
      producto_id: item.producto_id || null,
      nombre_producto: item.nombre,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
      metodo_pago: metodoPago,
      nombre_cliente: clienteNombre,
      usuario_id: userId,
      fecha_venta: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "https://[TU_PROYECTO].supabase.co/rest/v1/ventas",
        {
          method: "POST",
          headers: {
            apikey: "TU_API_KEY",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(ventaData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const venta = await response.json();
      ventas.push(venta);
    } catch (error) {
      console.error("Error al crear venta:", error);
      throw error;
    }
  }

  return ventas;
};

// Uso
const items = [
  {
    producto_id: "123e4567-e89b-12d3-a456-426614174000",
    nombre: "Camiseta Básica Negra",
    cantidad: 2,
    precio: 29.99,
  },
  {
    producto_id: "223e4567-e89b-12d3-a456-426614174000",
    nombre: "Pantalón Vaquero",
    cantidad: 1,
    precio: 59.99,
  },
];

const ventas = await procesarPagoMovil(
  "userId-123",
  items,
  "nequi",
  "Juan Pérez"
);
```

---

## 🔐 Notas de Seguridad

1. **Nunca expongas tu API key** en el código del cliente
2. **Usa Row Level Security (RLS)** en Supabase para proteger los datos
3. **Valida los datos** antes de enviarlos al servidor
4. **Usa tokens de autenticación** con expiración
5. **Implementa rate limiting** para prevenir abusos

---

## 📚 Referencias

- [Supabase REST API Documentation](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
