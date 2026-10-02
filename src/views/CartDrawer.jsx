import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { PROMO_CODES } from '../data/products';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  promoCode,
  setPromoCode,
  discountAmount,
  setDiscountAmount
}) {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (discountAmount === 'freeship' ? 0 : 1500) : 0;
  const discountVal =
    typeof discountAmount === 'number'
      ? (subtotal * discountAmount) / 100
      : 0;
  const total = Math.max(0, subtotal + shipping - discountVal);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      const p = PROMO_CODES[code];
      setPromoCode(code);
      if (p.type === 'percent') {
        setDiscountAmount(p.value);
        setPromoMessage({ type: 'success', text: `${p.label} (-${p.value}%)` });
      } else if (p.type === 'shipping') {
        setDiscountAmount('freeship');
        setPromoMessage({ type: 'success', text: p.label });
      }
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid promo code. Try CHY10 or NAIJA20' });
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="#0C6837" />
            <h2 className="drawer-title">
              Your Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button className="drawer-close-link" onClick={onClose}>
            Continue Shopping
          </button>
        </div>

        {/* Body Items List */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <ShoppingBag size={48} strokeWidth={1.2} style={{ margin: '0 auto 12px auto', color: '#CBD5E1' }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#062E1D', marginBottom: 4 }}>
                Your cart is currently empty
              </p>
              <p style={{ fontSize: '0.85rem' }}>Add some fresh Nigerian foodstuffs to begin!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-thumb">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-price">₦{item.price.toLocaleString()}</div>
                  <div className="cart-item-actions">
                    <div className="qty-stepper" style={{ padding: 2 }}>
                      <button
                        className="qty-stepper-btn"
                        style={{ width: 24, height: 24 }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="qty-stepper-val" style={{ minWidth: 24, fontSize: '0.82rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="qty-stepper-btn"
                        style={{ width: 24, height: 24 }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cart-item-remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '0.92rem', color: '#062E1D' }}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Input */}
            <div className="promo-code-box">
              <input
                type="text"
                placeholder="Have a promo code? (e.g. CHY10)"
                className="promo-input"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
              <button className="promo-btn" onClick={handleApplyPromo}>
                Apply
              </button>
            </div>
            {promoMessage && (
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: 12,
                  color: promoMessage.type === 'success' ? '#16A34A' : '#DC2626'
                }}
              >
                {promoMessage.text}
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="order-summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>₦{subtotal.toLocaleString()}</span>
            </div>

            {discountVal > 0 && (
              <div className="order-summary-row" style={{ color: '#16A34A' }}>
                <span>Promo Discount ({promoCode})</span>
                <span style={{ fontWeight: 700 }}>-₦{discountVal.toLocaleString()}</span>
              </div>
            )}

            <div className="order-summary-row">
              <span>Shipping</span>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>
                {shipping === 0 ? <span style={{ color: '#16A34A' }}>FREE</span> : `₦${shipping.toLocaleString()}`}
              </span>
            </div>

            <div className="order-summary-row total-row">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <button
              className="drawer-checkout-btn"
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
