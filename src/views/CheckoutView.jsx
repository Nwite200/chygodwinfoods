import React, { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building,
  DollarSign,
  PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutView({
  cartItems,
  onClearCart,
  onNavigate,
  onOrderPlaced
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    phone: '08012345678',
    email: 'john@example.com',
    address: '123 Main Street, Onitsha',
    state: 'Anambra',
    city: 'Onitsha',
    deliveryMethod: 'standard', // 'standard' or 'express'
    paymentMethod: 'card', // 'card', 'transfer', 'cod'
    cardNumber: '5399 •••• •••• 4210',
    cardExpiry: '12/28',
    cardCvc: '•••'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const subtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const deliveryCost = formData.deliveryMethod === 'express' ? 3500 : 1500;
  const total = subtotal + (subtotal > 0 ? deliveryCost : 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const orderId = `CSF2025${Math.floor(1000 + Math.random() * 9000)}`;
      const orderObj = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        customer: formData.fullName,
        email: formData.email,
        items: cartItems,
        total: total,
        status: 'Processing',
        paymentMethod: formData.paymentMethod === 'card' ? 'Card (Mastercard)' : formData.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Pay on Delivery',
        tracking: `TRK-NG-${Math.floor(100000 + Math.random() * 900000)}`
      };

      setCompletedOrder(orderObj);
      onOrderPlaced(orderObj);
      onClearCart();
      setStep(3);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if not supported
      }
    }, 1200);
  };

  // STEP 3: Order Confirmation Screen
  if (step === 3 && completedOrder) {
    return (
      <div className="section-pad">
        <div className="section-container" style={{ maxWidth: 650 }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 40,
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid #BBF7D0'
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                background: '#DCFCE7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: '#16A34A'
              }}
            >
              <PackageCheck size={40} />
            </div>

            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.08em' }}>
              Order Placed Successfully!
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#062E1D', margin: '8px 0 12px 0' }}>
              Daalụ! Thank You, {completedOrder.customer}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: 24 }}>
              Your order <strong style={{ color: '#062E1D' }}>#{completedOrder.id}</strong> has been received and is now being packaged with fresh Nigerian food staples.
            </p>

            {/* Tracking Card */}
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: 14,
                padding: 20,
                textAlign: 'left',
                border: '1px solid #E2E8F0',
                marginBottom: 28
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Tracking Number:</span>
                <strong style={{ color: '#0C6837' }}>{completedOrder.tracking}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Estimated Delivery:</span>
                <strong>2-3 Business Days</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontSize: '0.85rem' }}>Total Paid:</span>
                <strong style={{ color: '#062E1D', fontSize: '1.1rem' }}>₦{completedOrder.total.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <button
                className="btn-primary-pill"
                onClick={() => onNavigate('account')}
              >
                Track in Account Dashboard
              </button>
              <button
                className="btn-secondary-pill"
                style={{ color: '#062E1D', borderColor: '#CBD5E1' }}
                onClick={() => onNavigate('shop')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-pad">
      <div className="section-container">
        {/* Step Indicator Bar */}
        <div className="checkout-steps-bar">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span>Shipping</span>
          </div>
          <span style={{ color: '#CBD5E1' }}>————</span>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span>Payment</span>
          </div>
          <span style={{ color: '#CBD5E1' }}>————</span>
          <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Left Form Area */}
          <div>
            {/* Step 1: Shipping Address */}
            <div className="form-card">
              <h2 className="form-title">Shipping Address</h2>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Delivery Street Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">State</label>
                  <select
                    name="state"
                    className="form-input"
                    value={formData.state}
                    onChange={handleInputChange}
                  >
                    <option value="Anambra">Anambra</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja (FCT)</option>
                    <option value="Enugu">Enugu</option>
                    <option value="Rivers">Rivers (Port Harcourt)</option>
                    <option value="Imo">Imo (Owerri)</option>
                    <option value="Delta">Delta (Asaba/Warri)</option>
                    <option value="Oyo">Oyo (Ibadan)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">City / Town</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="form-card">
              <h2 className="form-title">Delivery Method</h2>
              <div
                className={`radio-option-card ${formData.deliveryMethod === 'standard' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
              >
                <div className="radio-left">
                  <Truck size={20} color="#0C6837" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Standard Delivery (2-3 Days)</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Doorstep delivery via GIG Logistics / Red Star</div>
                  </div>
                </div>
                <strong style={{ color: '#062E1D' }}>₦1,500</strong>
              </div>

              <div
                className={`radio-option-card ${formData.deliveryMethod === 'express' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, deliveryMethod: 'express' })}
              >
                <div className="radio-left">
                  <Truck size={20} color="#22C55E" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Express Delivery (Same Day)</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Priority dispatcher for urgent orders</div>
                  </div>
                </div>
                <strong style={{ color: '#062E1D' }}>₦3,500</strong>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="form-card">
              <h2 className="form-title">Payment Method</h2>
              <div
                className={`radio-option-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
              >
                <div className="radio-left">
                  <CreditCard size={20} color="#0C6837" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Card (Visa, Mastercard, Verve)</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Secured by Paystack / Flutterwave</div>
                  </div>
                </div>
                <ShieldCheck size={18} color="#16A34A" />
              </div>

              {formData.paymentMethod === 'card' && (
                <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 10, marginBottom: 14, border: '1px solid #E2E8F0' }}>
                  <div className="form-field">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.cardNumber}
                      readOnly
                    />
                  </div>
                  <div className="form-grid-2">
                    <div className="form-field">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.cardExpiry}
                        readOnly
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        className="form-input"
                        value={formData.cardCvc}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`radio-option-card ${formData.paymentMethod === 'transfer' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'transfer' })}
              >
                <div className="radio-left">
                  <Building size={20} color="#0C6837" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Direct Bank Transfer</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>GTBank / Zenith Bank instant transfer</div>
                  </div>
                </div>
              </div>

              {formData.paymentMethod === 'transfer' && (
                <div style={{ background: '#F0FDF4', padding: 14, borderRadius: 10, marginBottom: 14, border: '1px solid #BBF7D0', fontSize: '0.85rem' }}>
                  <p><strong>Bank Name:</strong> Guaranty Trust Bank (GTBank)</p>
                  <p><strong>Account Name:</strong> ChyGodwin Foodstuff Global Ltd</p>
                  <p><strong>Account Number:</strong> 0123456789</p>
                </div>
              )}

              <div
                className={`radio-option-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
              >
                <div className="radio-left">
                  <DollarSign size={20} color="#0C6837" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pay on Delivery</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Cash or POS on doorstep in eligible cities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="form-card" style={{ position: 'sticky', top: 90 }}>
              <h2 className="form-title">Order Summary</h2>

              {cartItems.length === 0 ? (
                <p style={{ color: '#64748B', fontSize: '0.88rem' }}>No items in checkout.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {cartItems.map((it) => (
                    <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
                      <img src={it.image} alt={it.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', background: '#F8FAFC', border: '1px solid #E2E8F0' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{it.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Qty: {it.quantity}</div>
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: '#062E1D' }}>
                        ₦{(it.price * it.quantity).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              <div className="order-summary-row">
                <span>Subtotal</span>
                <strong>₦{subtotal.toLocaleString()}</strong>
              </div>
              <div className="order-summary-row">
                <span>Shipping ({formData.deliveryMethod === 'express' ? 'Express' : 'Standard'})</span>
                <strong>₦{deliveryCost.toLocaleString()}</strong>
              </div>

              <div className="order-summary-row total-row">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>

              <button
                className="drawer-checkout-btn"
                style={{ width: '100%', marginTop: 20 }}
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || isProcessing}
              >
                {isProcessing ? 'Processing Order...' : 'Place Order'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.75rem', color: '#94A3B8' }}>
                You will receive a confirmation email shortly at <strong>{formData.email}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
