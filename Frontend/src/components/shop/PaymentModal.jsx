// Modal de pago
import { useState } from "react";
import { paymentService } from "../../services/paymentService";
import { formatCurrency } from "../../utils/helpers";
import { toastService } from "../../utils/toastService";
import { FaTimes } from "react-icons/fa";

const PaymentModal = ({
  show,
  onHide,
  total,
  saldo,
  onPaymentSuccess,
  cartId,
  userId,
  userEmail,
  userName,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!show) return null;

  const handlePayment = async () => {
    if (!selectedMethod) {
      toastService.error("Por favor selecciona un método de pago");
      return;
    }

    if (saldo < total) {
      toastService.error("Saldo insuficiente");
      return;
    }

    setProcessing(true);

    try {
      const result = await paymentService.procesarPago(
        userId,
        total,
        selectedMethod,
        cartId,
        userEmail,
        userName
      );

      if (result.success) {
        await onPaymentSuccess();
      }
    } catch (error) {
      console.error("Error en el pago:", error);
    } finally {
      setProcessing(false);
    }
  };

  const saldoSuficiente = saldo >= total;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onHide}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">💳 Procesar Pago</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <h5>Resumen de Compra</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Total a pagar:</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Saldo disponible:</span>
                <span
                  className={saldoSuficiente ? "text-success" : "text-danger"}
                >
                  {formatCurrency(saldo)}
                </span>
              </div>
              {!saldoSuficiente && (
                <div className="alert alert-warning mt-3 mb-0">
                  Saldo insuficiente. Necesitas {formatCurrency(total - saldo)}{" "}
                  más.
                </div>
              )}
            </div>

            <div>
              <label className="fw-bold mb-3 d-block">Método de Pago</label>
              {paymentService.METODOS_PAGO.map((metodo) => (
                <div key={metodo.id} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={metodo.id}
                    name="metodoPago"
                    value={metodo.id}
                    checked={selectedMethod === metodo.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={metodo.id}>
                    {metodo.icon} {metodo.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
              disabled={processing}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePayment}
              disabled={!selectedMethod || !saldoSuficiente || processing}
            >
              {processing ? "Procesando..." : "Pagar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
