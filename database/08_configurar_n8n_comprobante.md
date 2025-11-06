# 📧 Configuración de n8n para Envío de Comprobantes de Pago

## 📋 Descripción

Este documento explica cómo configurar un workflow en n8n para enviar comprobantes de pago por correo electrónico cuando se procesa un pago exitoso.

## 🔧 Configuración del Workflow en n8n

### Paso 1: Crear un nuevo workflow

1. Inicia sesión en tu instancia de n8n
2. Crea un nuevo workflow
3. Nómbralo "Comprobante de Pago"

### Paso 2: Configurar el Webhook

1. Agrega un nodo **Webhook**
2. Configura el método como **POST**
3. Configura la ruta como `/comprobante_pago` (o la que prefieras)
4. Activa el webhook (esto generará una URL)
5. Copia la URL del webhook (ejemplo: `https://alexjh230.app.n8n.cloud/webhook-test/comprobante_pago`)

### Paso 3: Configurar el Nodo de Email

1. Agrega un nodo **Email Send** (o el nodo de email que uses: Gmail, SendGrid, etc.)
2. Conecta el webhook al nodo de email

### Paso 4: Configurar el Template del Email

El payload que recibe el webhook tiene la siguiente estructura:

```json
{
  "tipo": "comprobante_pago",
  "email": "usuario@ejemplo.com",
  "asunto": "Comprobante de Pago - Venta #123",
  "datos": {
    "nombreUsuario": "Juan Pérez",
    "numeroVenta": "123",
    "fecha": "15 de enero de 2024, 10:30",
    "items": [
      {
        "numero": 1,
        "producto": "Camisa Azul",
        "cantidad": 2,
        "precioUnitario": 50000,
        "subtotal": 100000
      }
    ],
    "subtotal": 100000,
    "total": 100000,
    "metodoPago": "Nequi",
    "nuevoSaldo": 900000
  },
  "fecha": "2024-01-15T10:30:00.000Z"
}
```

### Paso 5: Configurar el Nodo de Email

En el nodo de email, configura:

- **To**: `{{ $json.email }}`
- **Subject**: `{{ $json.asunto }}`
- **Body** (HTML):

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        text-align: center;
        border-radius: 10px 10px 0 0;
      }
      .content {
        background: #f9f9f9;
        padding: 30px;
        border-radius: 0 0 10px 10px;
      }
      .info-box {
        background: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
      }
      .info-row:last-child {
        border-bottom: none;
      }
      .label {
        font-weight: bold;
        color: #666;
      }
      .value {
        color: #333;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: white;
        border-radius: 8px;
        overflow: hidden;
      }
      th {
        background: #667eea;
        color: white;
        padding: 12px;
        text-align: left;
      }
      td {
        padding: 12px;
        border-bottom: 1px solid #eee;
      }
      tr:last-child td {
        border-bottom: none;
      }
      .total {
        font-size: 1.2em;
        font-weight: bold;
        color: #667eea;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #666;
        font-size: 0.9em;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>✅ Comprobante de Pago</h1>
      <p>Gracias por tu compra</p>
    </div>

    <div class="content">
      <div class="info-box">
        <div class="info-row">
          <span class="label">Cliente:</span>
          <span class="value">{{ $json.datos.nombreUsuario }}</span>
        </div>
        <div class="info-row">
          <span class="label">Número de Venta:</span>
          <span class="value">#{{ $json.datos.numeroVenta }}</span>
        </div>
        <div class="info-row">
          <span class="label">Fecha:</span>
          <span class="value">{{ $json.datos.fecha }}</span>
        </div>
        <div class="info-row">
          <span class="label">Método de Pago:</span>
          <span class="value">{{ $json.datos.metodoPago }}</span>
        </div>
      </div>

      <h3>Detalle de la Compra</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {{#each $json.datos.items}}
          <tr>
            <td>{{ this.numero }}</td>
            <td>{{ this.producto }}</td>
            <td>{{ this.cantidad }}</td>
            <td>${{ formatNumber this.precioUnitario }}</td>
            <td>${{ formatNumber this.subtotal }}</td>
          </tr>
          {{/each}}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align: right; font-weight: bold;">
              Total:
            </td>
            <td class="total">${{ formatNumber $json.datos.total }}</td>
          </tr>
        </tfoot>
      </table>

      <div class="info-box">
        <div class="info-row">
          <span class="label">Saldo Restante:</span>
          <span class="value total"
            >${{ formatNumber $json.datos.nuevoSaldo }}</span
          >
        </div>
      </div>

      <div class="footer">
        <p>Este es un comprobante generado automáticamente.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      </div>
    </div>
  </body>
</html>
```

**Nota**: Si tu nodo de email no soporta Handlebars ({{ }}), puedes usar expresiones de n8n como:

- `{{ $json.email }}`
- `{{ $json.datos.nombreUsuario }}`
- `{{ $json.datos.total }}`

### Paso 6: Agregar Formateo de Números (Opcional)

Si necesitas formatear números con separadores de miles, puedes agregar un nodo **Code** antes del nodo de email:

```javascript
// Formatear números en los items
const items = $input.item.json.datos.items.map((item) => ({
  ...item,
  precioUnitarioFormateado: new Intl.NumberFormat("es-CO").format(
    item.precioUnitario
  ),
  subtotalFormateado: new Intl.NumberFormat("es-CO").format(item.subtotal),
}));

return {
  ...$input.item.json,
  datos: {
    ...$input.item.json.datos,
    items: items,
    totalFormateado: new Intl.NumberFormat("es-CO").format(
      $input.item.json.datos.total
    ),
    nuevoSaldoFormateado: new Intl.NumberFormat("es-CO").format(
      $input.item.json.datos.nuevoSaldo
    ),
  },
};
```

### Paso 7: Configurar Variables de Entorno (Opcional)

Si quieres usar una URL de webhook diferente, puedes configurarla en el archivo `.env` del frontend:

```env
VITE_N8N_WEBHOOK_COMPROBANTE=https://tu-instancia.app.n8n.cloud/webhook-test/comprobante_pago
```

### Paso 8: Activar el Workflow

1. Activa el workflow en n8n
2. Verifica que el webhook esté activo
3. Prueba el flujo haciendo una compra en la aplicación

## 🧪 Pruebas

Para probar el workflow, puedes usar curl:

```bash
curl -X POST https://tu-webhook-url/comprobante_pago \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "comprobante_pago",
    "email": "test@ejemplo.com",
    "asunto": "Comprobante de Pago - Venta #123",
    "datos": {
      "nombreUsuario": "Juan Pérez",
      "numeroVenta": "123",
      "fecha": "15 de enero de 2024, 10:30",
      "items": [
        {
          "numero": 1,
          "producto": "Camisa Azul",
          "cantidad": 2,
          "precioUnitario": 50000,
          "subtotal": 100000
        }
      ],
      "subtotal": 100000,
      "total": 100000,
      "metodoPago": "Nequi",
      "nuevoSaldo": 900000
    },
    "fecha": "2024-01-15T10:30:00.000Z"
  }'
```

## 📝 Notas

- Asegúrate de que el servicio de email (Gmail, SendGrid, etc.) esté correctamente configurado en n8n
- El webhook debe estar activo para recibir las solicitudes
- Si no se envía el email, verifica los logs de n8n para ver qué está fallando
- El envío del email no bloquea el proceso de pago; si falla, solo se registra en los logs

## 🔒 Seguridad

- Considera agregar autenticación al webhook (API key, token, etc.)
- Valida que el email del usuario sea válido antes de enviar
- Considera agregar rate limiting para evitar spam
