// Modal de carrito de compras moderno
import { cartService } from "../../services/cartService";
import { formatCurrency } from "../../utils/helpers";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaTimes,
  FaShoppingCart,
  FaArrowRight,
} from "react-icons/fa";
import { toastService } from "../../utils/toastService";

const CartModal = ({
  show,
  onHide,
  cartItems,
  cartTotal,
  onUpdate,
  onCheckout,
}) => {
  if (!show) return null;

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }

    const { error } = await cartService.updateItemQuantity(itemId, newQuantity);

    if (!error) {
      await onUpdate();
    }
  };

  const handleRemoveItem = async (itemId) => {
    const { error } = await cartService.removeFromCart(itemId);

    if (!error) {
      await onUpdate();
    }
  };

  const handleClearCart = async () => {
    if (!cartItems[0]?.carrito_id) return;

    const { error } = await cartService.clearCart(cartItems[0].carrito_id);

    if (!error) {
      await onUpdate();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onHide}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#002f19] rounded-lg flex items-center justify-center">
              <FaShoppingCart className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Carrito de Compras
            </h2>
            {cartItems.length > 0 && (
              <span className="px-2 py-1 bg-[#E8F5E8] text-[#002f19] text-xs font-semibold rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <button
            onClick={onHide}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <FaShoppingCart className="text-gray-300 text-6xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#002f19] transition-colors"
                >
                  {/* Información del producto */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.productos?.nombre || "Producto"}
                    </h4>
                    {item.productos?.talla && (
                      <p className="text-sm text-gray-500">
                        Talla: {item.productos.talla}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-gray-700 mt-1">
                      {formatCurrency(item.precio_unitario)} c/u
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg">
                      <button
                        className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.cantidad - 1)
                        }
                      >
                        <FaMinus className="text-xs text-gray-600" />
                      </button>
                      <span className="px-3 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                        {item.cantidad}
                      </span>
                      <button
                        className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.cantidad + 1)
                        }
                        disabled={item.cantidad >= (item.productos?.stock || 0)}
                      >
                        <FaPlus className="text-xs text-gray-600" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[100px]">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.precio_unitario * item.cantidad)}
                      </p>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Eliminar"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(cartTotal)}
                </p>
              </div>
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash className="text-xs" />
                Vaciar Carrito
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onHide}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Seguir Comprando
              </button>
              <button
                onClick={onCheckout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#002f19] hover:bg-[#001a0e] text-white font-medium rounded-lg transition-colors active:scale-95"
              >
                Proceder al Pago
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
