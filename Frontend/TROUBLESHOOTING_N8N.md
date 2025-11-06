# 🔧 Solución de Problemas: Envío de Comprobantes por Email (n8n)

## ❌ Problema: El comprobante dice que se envió pero no llega al correo

### Diagnóstico

Si ves este error en la consola:

```
[PaymentService] ⚠️ No se pudo enviar el comprobante: No se pudo enviar el comprobante. Verifica la configuración de n8n.
```

Esto significa que la aplicación no pudo comunicarse correctamente con n8n.

## 🔍 Pasos para Diagnosticar

### 1. Verificar los Logs en la Consola del Navegador

Abre la consola del navegador (F12) y busca estos mensajes:

#### ✅ Si ves esto, n8n recibió la solicitud:

```
[N8N] ✅ Solicitud enviada exitosamente a n8n
[N8N] 📥 Respuesta completa: {...}
```

**Solución**: El problema está en n8n, no en la aplicación. Verifica:

- Que el workflow de n8n esté activo
- Que el nodo de email esté configurado correctamente
- Revisa los logs de ejecución en n8n

#### ❌ Si ves esto, hay un error de conexión:

```
[N8N] ❌ Error HTTP al enviar a n8n
[N8N] ❌ Error de red al conectar con n8n
```

**Solución**: Verifica la configuración del webhook.

### 2. Verificar la URL del Webhook

La aplicación usa esta URL por defecto:

```
https://alexjh230.app.n8n.cloud/webhook-test/comprobante_pago
```

**Para cambiar la URL**, crea un archivo `.env` en la carpeta `Frontend/` con:

```env
VITE_N8N_WEBHOOK_COMPROBANTE=https://tu-instancia.app.n8n.cloud/webhook-test/comprobante_pago
```

**Importante**: Después de cambiar el `.env`, reinicia el servidor de desarrollo:

```bash
npm run dev
```

### 3. Verificar la Configuración en n8n

#### Paso 1: Verificar que el Workflow esté Activo

1. Ve a tu instancia de n8n
2. Abre el workflow "Comprobante de Pago"
3. Asegúrate de que el botón de activación esté en verde (ON)

#### Paso 2: Verificar el Webhook

1. Abre el nodo **Webhook**
2. Verifica que:
   - El método sea **POST**
   - La ruta sea `/comprobante_pago` (o la que configuraste)
   - El webhook esté **activado** (debe mostrar una URL)
3. Copia la URL del webhook y compárala con la que está en tu código

#### Paso 3: Verificar el Nodo de Email

1. Abre el nodo de **Email Send** (o Gmail, SendGrid, etc.)
2. Verifica que:
   - El servicio de email esté configurado correctamente
   - El campo **To** use: `{{ $json.email }}`
   - El campo **Subject** use: `{{ $json.asunto }}`
   - El campo **Body** tenga el template HTML correcto

#### Paso 4: Probar el Workflow Manualmente

1. En n8n, haz clic en "Execute Workflow" (o ejecuta manualmente)
2. Usa este payload de prueba:

```json
{
  "tipo": "comprobante_pago",
  "email": "tu-email@ejemplo.com",
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

3. Verifica que el email se envíe correctamente

### 4. Verificar CORS (si es necesario)

Si n8n está bloqueando las solicitudes por CORS, puedes:

1. **Opción 1**: Configurar CORS en n8n (si tienes acceso)
2. **Opción 2**: Usar un proxy o middleware
3. **Opción 3**: Verificar que el webhook de n8n permita solicitudes desde tu dominio

### 5. Verificar los Logs de n8n

1. Ve a la sección de "Executions" en n8n
2. Busca las ejecuciones recientes del workflow
3. Revisa si hay errores en algún nodo
4. Verifica especialmente el nodo de email

## 🐛 Errores Comunes

### Error: "Timeout: La solicitud tardó más de 30 segundos"

**Causa**: n8n está tardando demasiado en responder
**Solución**:

- Verifica que el workflow no tenga bucles infinitos
- Optimiza el workflow de n8n
- Verifica la conectividad de red

### Error: "Error HTTP 404"

**Causa**: La URL del webhook es incorrecta o el workflow no está activo
**Solución**:

- Verifica la URL del webhook en n8n
- Asegúrate de que el workflow esté activo
- Verifica que la ruta del webhook sea correcta

### Error: "Error HTTP 500"

**Causa**: Hay un error en el workflow de n8n
**Solución**:

- Revisa los logs de ejecución en n8n
- Verifica que todos los nodos estén configurados correctamente
- Prueba el workflow manualmente

### El webhook responde OK pero el email no llega

**Causa**: El problema está en el nodo de email de n8n
**Solución**:

- Verifica la configuración del servicio de email en n8n
- Revisa que las credenciales del servicio de email sean correctas
- Verifica que el email no esté en la carpeta de spam
- Revisa los logs de ejecución del nodo de email en n8n

## 📝 Checklist de Verificación

- [ ] El workflow de n8n está activo
- [ ] El webhook está activado y muestra una URL
- [ ] La URL del webhook coincide con la del código
- [ ] El nodo de email está configurado correctamente
- [ ] El servicio de email tiene credenciales válidas
- [ ] El workflow se ejecuta correctamente cuando se prueba manualmente
- [ ] Los logs de n8n no muestran errores
- [ ] La variable de entorno `VITE_N8N_WEBHOOK_COMPROBANTE` está configurada (si usas una URL personalizada)

## 💡 Consejos Adicionales

1. **Prueba el webhook directamente**: Puedes usar curl o Postman para probar el webhook:

```bash
curl -X POST https://alexjh230.app.n8n.cloud/webhook-test/comprobante_pago \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "comprobante_pago",
    "email": "tu-email@ejemplo.com",
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

2. **Revisa la carpeta de spam**: A veces los emails llegan pero van a spam

3. **Verifica el formato del email**: Asegúrate de que el email del usuario sea válido

4. **Usa un servicio de email confiable**: Gmail, SendGrid, Mailgun, etc.

## 📞 Soporte

Si después de seguir estos pasos el problema persiste:

1. Revisa los logs completos en la consola del navegador
2. Revisa los logs de ejecución en n8n
3. Verifica la documentación de n8n: https://docs.n8n.io/
