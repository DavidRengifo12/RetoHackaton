# 🔧 Diagnóstico de Problemas con n8n

## 🚨 Problema: n8n está prendido pero no funciona

### Pasos Rápidos para Diagnosticar

#### 1. Probar la Conexión desde la Consola del Navegador

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Importar la función de prueba
import { probarConexionN8N } from "./src/services/n8n.js";

// Probar conexión para alertas de stock
probarConexionN8N("alerta_stock").then((result) => {
  console.log("Resultado:", result);
});

// Probar conexión para comprobantes de pago
probarConexionN8N("comprobante_pago").then((result) => {
  console.log("Resultado:", result);
});
```

#### 2. Verificar los Logs en la Consola

Busca estos mensajes en la consola:

- ✅ `[N8N] ✅ Conexión exitosa!` - La conexión funciona
- ❌ `[N8N] ❌ Error de conexión` - Hay un problema
- ⏱️ `[N8N] ⏱️ Timeout` - El webhook no responde

#### 3. Verificar en n8n

1. **Workflow Activo**:

   - Ve a n8n
   - Abre el workflow
   - Verifica que el botón de activación esté en verde (ON)
   - Si está pausado (gris), actívalo

2. **Webhook Activado**:

   - Abre el nodo Webhook
   - Verifica que muestre una URL
   - Copia la URL y compárala con la del código

3. **Logs de Ejecución**:
   - Ve a "Executions" en n8n
   - Busca ejecuciones recientes
   - Revisa si hay errores en algún nodo

### Problemas Comunes y Soluciones

#### ❌ Error: "Timeout: El webhook no respondió"

**Causa**: El workflow está pausado o el webhook no está activo

**Solución**:

1. Ve a n8n
2. Activa el workflow (botón verde)
3. Verifica que el webhook esté activado
4. Prueba de nuevo

#### ❌ Error: "Error HTTP 404"

**Causa**: La URL del webhook es incorrecta

**Solución**:

1. Copia la URL exacta del webhook en n8n
2. Verifica que coincida con la del código
3. Si usas variables de entorno, verifica el archivo `.env`

#### ❌ Error: "Error HTTP 500"

**Causa**: Hay un error en el workflow de n8n

**Solución**:

1. Revisa los logs de ejecución en n8n
2. Verifica que todos los nodos estén configurados
3. Prueba el workflow manualmente en n8n

#### ⚠️ El webhook responde OK pero no envía emails

**Causa**: El problema está en el nodo de email

**Solución**:

1. Verifica la configuración del servicio de email en n8n
2. Revisa las credenciales del servicio de email
3. Prueba enviar un email manualmente desde n8n
4. Revisa la carpeta de spam

### Verificar URLs de Webhooks

Las URLs por defecto son:

- **Alertas de Stock**: `https://alexjh230.app.n8n.cloud/webhook-test/alerta_stock`
- **Comprobantes de Pago**: `https://alexjh230.app.n8n.cloud/webhook-test/comprobante_pago`

Para usar URLs personalizadas, crea un archivo `.env` en `Frontend/`:

```env
VITE_N8N_WEBHOOK_ALERTA=https://tu-instancia.app.n8n.cloud/webhook-test/alerta_stock
VITE_N8N_WEBHOOK_COMPROBANTE=https://tu-instancia.app.n8n.cloud/webhook-test/comprobante_pago
```

**Importante**: Después de cambiar el `.env`, reinicia el servidor de desarrollo.

### Probar el Webhook Directamente

Puedes probar el webhook usando curl o Postman:

```bash
# Probar alerta de stock
curl -X POST https://alexjh230.app.n8n.cloud/webhook-test/alerta_stock \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "stock_alert",
    "test": true,
    "mensaje": "Prueba de conexión",
    "fecha": "2024-01-15T10:30:00.000Z"
  }'

# Probar comprobante de pago
curl -X POST https://alexjh230.app.n8n.cloud/webhook-test/comprobante_pago \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "comprobante_pago",
    "email": "test@ejemplo.com",
    "asunto": "Test",
    "datos": {
      "nombreUsuario": "Test",
      "numeroVenta": "123",
      "fecha": "2024-01-15",
      "items": [],
      "subtotal": 0,
      "total": 0,
      "metodoPago": "Nequi",
      "nuevoSaldo": 0
    },
    "fecha": "2024-01-15T10:30:00.000Z"
  }'
```

### Checklist de Verificación

- [ ] El workflow de n8n está ACTIVO (no pausado)
- [ ] El webhook está ACTIVADO y muestra una URL
- [ ] La URL del webhook coincide con la del código
- [ ] El nodo de email está configurado correctamente
- [ ] El servicio de email tiene credenciales válidas
- [ ] El workflow se ejecuta correctamente cuando se prueba manualmente
- [ ] Los logs de n8n no muestran errores
- [ ] La función `probarConexionN8N()` retorna `success: true`

### Contacto

Si después de seguir estos pasos el problema persiste:

1. Revisa los logs completos en la consola del navegador
2. Revisa los logs de ejecución en n8n
3. Verifica la documentación de n8n: https://docs.n8n.io/
