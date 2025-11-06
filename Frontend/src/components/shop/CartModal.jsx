// Modal de carrito de compras
import { cartService } from "../../services/cartService";
import { formatCurrency } from "../../utils/helpers";
import { FaTrash, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
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
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onHide}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">🛒 Carrito de Compras</h5>
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
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div>
                              <div className="font-semibold">
                                {item.productos?.nombre || "Producto"}
                              </div>
                              {item.productos?.talla && (
                                <small className="text-muted">
                                  Talla: {item.productos.talla}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>{formatCurrency(item.precio_unitario)}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.cantidad - 1
                                  )
                                }
                              >
                                <FaMinus />
                              </button>
                              <span>{item.cantidad}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.cantidad + 1
                                  )
                                }
                                disabled={
                                  item.cantidad >= (item.productos?.stock || 0)
                                }
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </td>
                          <td className="font-semibold">
                            {formatCurrency(
                              item.precio_unitario * item.cantidad
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <div>
                    <h5 className="mb-0">Total: {formatCurrency(cartTotal)}</h5>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleClearCart}
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
            >
              Cerrar
            </button>
            {cartItems.length > 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onCheckout}
              >
                Proceder al Pago
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
