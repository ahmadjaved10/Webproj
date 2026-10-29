import React from 'react';
import '../styles/components/checkout.css';

const CheckoutSheet = ({ items = [], onCheckout, onClose }) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = items.length ? 2.99 : 0;

  return (
    <div className="checkout-scene">
      <aside className="checkout-sheet" role="dialog" aria-label="Checkout">
        <div className="checkout-handle" />
        <header className="checkout-header">
          <h3>Your order</h3>
          {onClose && <button className="checkout-close" onClick={onClose} aria-label="Close">✕</button>}
        </header>

        <ul className="checkout-items">
          {items.map((i) => (
            <li key={i.id}>
              <span>{i.qty}× {i.name}</span>
              <strong>${(i.price * i.qty).toFixed(2)}</strong>
            </li>
          ))}
        </ul>

        <div className="checkout-totals">
          <div><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div><span>Delivery</span><span>${delivery.toFixed(2)}</span></div>
          <div className="checkout-total"><span>Total</span><span>${(subtotal + delivery).toFixed(2)}</span></div>
        </div>

        <button className="checkout-btn" onClick={onCheckout}>Place order</button>
      </aside>
    </div>
  );
};

export default CheckoutSheet;