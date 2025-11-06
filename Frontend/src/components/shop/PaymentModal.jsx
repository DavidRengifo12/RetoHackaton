// Modal de pago moderno
import { useState } from "react";
import { paymentService } from "../../services/paymentService";
import { formatCurrency } from "../../utils/helpers";
import { toastService } from "../../utils/toastService";
import {
  FaTimes,
  FaCreditCard,
  FaWallet,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

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
  const [imagenesError, setImagenesError] = useState({});

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
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onHide}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <FaCreditCard className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Procesar Pago</h2>
          </div>
          <button
            onClick={onHide}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
            disabled={processing}
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Resumen de compra */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen de Compra
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                <div className="flex items-center gap-2">
                  <FaWallet className="text-gray-500" />
                  <span className="text-gray-600">Saldo disponible:</span>
                </div>
                <span
                  className={`text-lg font-semibold ${
                    saldoSuficiente ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(saldo)}
                </span>
              </div>
            </div>
            {!saldoSuficiente && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <FaExclamationTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Saldo insuficiente
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Necesitas {formatCurrency(total - saldo)} más para completar
                    la compra
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Métodos de pago */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Selecciona un método de pago
            </label>
            <div className="space-y-3">
              {paymentService.METODOS_PAGO.map((metodo) => {
                const isSelected = selectedMethod === metodo.id;
                return (
                  <div
                    key={metodo.id}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedMethod(metodo.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <FaCheckCircle className="text-white text-xs" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        {imagenesError[metodo.id] ? (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">{metodo.icon}</span>
                          </div>
                        ) : (
                          <img
                            src={metodo.imagen}
                            alt={metodo.nombre}
                            onError={() => {
                              setImagenesError((prev) => ({
                                ...prev,
                                [metodo.id]: true,
                              }));
                            }}
                            className="w-12 h-12 object-contain"
                          />
                        )}
                        <span
                          className={`font-medium ${
                            isSelected ? "text-blue-900" : "text-gray-900"
                          }`}
                        >
                          {metodo.nombre}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onHide}
              disabled={processing}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handlePayment}
              disabled={!selectedMethod || !saldoSuficiente || processing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Pagar {formatCurrency(total)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
