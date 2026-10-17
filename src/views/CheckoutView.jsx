import React, { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building,
  DollarSign,
  PackageCheck,
  FileDown,
  Share2,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORE_INFO } from '../data/products';
import { buildInvoicePdf } from '../utils/invoice';

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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceBlobUrl, setInvoiceBlobUrl] = useState(null);

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
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        deliveryMethod: formData.deliveryMethod,
        items: cartItems,
        subtotal: subtotal,
        deliveryCost: subtotal > 0 ? deliveryCost : 0,
        total: total,
        status: 'Processing',
        paymentMethod: formData.paymentMethod === 'card' ? 'Card (Mastercard)' : formData.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Pay on Delivery',
        tracking: `TRK-NG-${Math.floor(100000 + Math.random() * 900000)}`
      };

      setCompletedOrder(orderObj);
      onOrderPlaced(orderObj);
      try {
        const doc = buildInvoicePdf({ order: orderObj, customer: formData, subtotal, deliveryCost: subtotal > 0 ? deliveryCost : 0, total });
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        setInvoiceBlobUrl(url);
        setShowInvoiceModal(true);
      } catch (err) {
        console.warn('Invoice generation failed:', err);
      }
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
      <>
      <div className="section-pad">
        <div className="section-container" style={{ maxWidth: 650 }}>
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: 20,
              padding: 40,
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-green)'
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                background: 'var(--surface-green-tint)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: 'var(--text-success)'
              }}
            >
              <PackageCheck size={40} />
            </div>

            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-green-strong)', letterSpacing: '0.08em' }}>
              Order Placed Successfully!
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)', margin: '8px 0 12px 0' }}>
              Daalụ! Thank You, {completedOrder.customer}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: 24 }}>
              Your order <strong style={{ color: 'var(--text-heading)' }}>#{completedOrder.id}</strong> has been received and is now being packaged with fresh Nigerian food staples.
            </p>

            {/* Tracking Card */}
            <div
              style={{
                background: 'var(--surface-subtle)',
                borderRadius: 14,
                padding: 20,
                textAlign: 'left',
                border: '1px solid var(--border-light)',
                marginBottom: 28
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tracking Number:</span>
                <strong style={{ color: 'var(--text-green)' }}>{completedOrder.tracking}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Estimated Delivery:</span>
                <strong>2-3 Business Days</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Paid:</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '1.1rem' }}>₦{completedOrder.total.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-pill"
                onClick={() => {
                  try {
                    const doc = buildInvoicePdf({
                      order: completedOrder,
                      customer: {
                        fullName: completedOrder.customer,
                        email: completedOrder.email,
                        phone: completedOrder.phone,
                        address: completedOrder.address,
                        city: completedOrder.city,
                        state: completedOrder.state,
                        deliveryMethod: completedOrder.deliveryMethod,
                        paymentMethod: completedOrder.paymentMethod
                      },
                      subtotal: completedOrder.subtotal,
                      deliveryCost: completedOrder.deliveryCost,
                      total: completedOrder.total
                    });
                    const blob = doc.output('blob');
                    const url = URL.createObjectURL(blob);
                    setInvoiceBlobUrl(url);
                    setShowInvoiceModal(true);
                  } catch (err) {
                    console.warn('Invoice download failed:', err);
                  }
                }}
              >
                <FileDown size={17} /> Download Invoice (PDF)
              </button>
              <button
                className="btn-secondary-pill"
                style={{ color: 'var(--text-heading)', borderColor: 'var(--border-strong)' }}
                onClick={() => onNavigate('account')}
              >
                Track in Account Dashboard
              </button>
              <button
                className="btn-secondary-pill"
                style={{ color: 'var(--text-heading)', borderColor: 'var(--border-strong)' }}
                onClick={() => onNavigate('shop')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

    {/* Invoice Modal */}
    {showInvoiceModal && completedOrder && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backdropFilter: 'blur(4px)'
        }}
      >
        <div
          style={{
            background: '#FFF',
            borderRadius: 20,
            maxWidth: 720,
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              background: 'var(--surface-green-tint)',
              padding: 20,
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  background: '#0C6837',
                  color: '#FFF',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18
                }}
              >
                🧾
              </span>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#0C6837', letterSpacing: '0.08em' }}>
                  Order Invoice
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  #{completedOrder.id}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowInvoiceModal(false);
                if (invoiceBlobUrl) URL.revokeObjectURL(invoiceBlobUrl);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 24,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                lineHeight: 1,
                padding: 0
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 20,
                fontSize: '0.85rem'
              }}
            >
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Customer
                </div>
                <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{completedOrder.customer}</div>
                <div style={{ color: 'var(--text-body)', marginTop: 4 }}>{completedOrder.phone}</div>
                <div style={{ color: 'var(--text-body)', marginTop: 4 }}>{completedOrder.email}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Order Details
                </div>
                <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>
                  {completedOrder.paymentMethod}
                </div>
                <div style={{ color: 'var(--text-body)', marginTop: 4 }}>
                  {completedOrder.deliveryMethod === 'express' ? 'Express Delivery' : 'Standard Delivery'}
                </div>
                <div style={{ color: 'var(--text-body)', marginTop: 4 }}>
                  Tracking: {completedOrder.tracking}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total
                </div>
                <div style={{ color: 'var(--text-green)', fontWeight: 800, fontSize: '1.2rem' }}>
                  ₦{completedOrder.total.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Date
                </div>
                <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{completedOrder.date}</div>
              </div>
            </div>

            <div
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#FFF',
                minHeight: 500
              }}
            >
              {invoiceBlobUrl ? (
                <>
                  <div style={{ padding: 12, background: 'var(--surface-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
                    📄 Invoice Preview (scroll to view full document)
                  </div>
                  <iframe
                    src={invoiceBlobUrl}
                    style={{ width: '100%', height: 420, border: 'none', display: 'block' }}
                    title="Invoice PDF"
                  />
                </>
              ) : (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading invoice preview...
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer: Download + WhatsApp Share */}
          <div
            style={{
              padding: 20,
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              background: 'var(--surface-subtle)'
            }}
          >
            <button
              onClick={() => {
                if (invoiceBlobUrl) {
                  const link = document.createElement('a');
                  link.href = invoiceBlobUrl;
                  link.download = `Chygodwin-Invoice-${completedOrder.id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              className="btn-primary-pill"
              style={{ flex: 1 }}
            >
              <Download size={17} /> Download PDF
            </button>
            <button
              onClick={() => {
                const itemsText = (completedOrder.items || [])
                  .map((it) => `• ${it.name} x${it.quantity} — ₦${(it.price * it.quantity).toLocaleString()}`)
                  .join('%0A');
                const message = `*New Order — ${STORE_INFO.name}*%0A%0AOrder: #${completedOrder.id}%0ACustomer: ${completedOrder.customer}%0APhone: ${completedOrder.phone}%0ATotal: ₦${completedOrder.total.toLocaleString()}%0APayment: ${completedOrder.paymentMethod}%0ADelivery: ${completedOrder.deliveryMethod === 'express' ? 'Express' : 'Standard'}%0A%0A*Items:*%0A${itemsText}%0A%0AInvoice PDF attached. Please confirm receipt.%0A%0A— ${STORE_INFO.name}`;
                const waUrl = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
                window.open(waUrl, '_blank');
              }}
              className="btn-primary-pill"
              style={{
                flex: 1,
                background: '#25D366',
                color: '#FFF',
                border: 'none'
              }}
            >
              <Share2 size={17} style={{ marginRight: 6 }} /> Share WhatsApp
            </button>
          </div>
        </div>
      </div>
    )}
      </>

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
          <span style={{ color: 'var(--border-strong)' }}>————</span>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span>Payment</span>
          </div>
          <span style={{ color: 'var(--border-strong)' }}>————</span>
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
              <h2 className="form-title">Delivery &amp; Waybill Method</h2>
              <div style={{ background: 'var(--surface-subtle)', padding: 12, borderRadius: 8, border: '1px solid var(--border-light)', marginBottom: 14, fontSize: '0.8rem', color: 'var(--text-body)' }}>
                📍 Dispatched from <strong>Nkwelle Light of God estate</strong>. We waybill and deliver Nationwide and beyond.
              </div>

              <div
                className={`radio-option-card ${formData.deliveryMethod === 'standard' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
              >
                <div className="radio-left">
                  <Truck size={20} color="#0C6837" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Nationwide Waybill &amp; Delivery (2-3 Days)</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dispatched via trusted interstate bus/haulage park or direct courier</div>
                  </div>
                </div>
                <strong style={{ color: 'var(--text-heading)' }}>₦1,500</strong>
              </div>

              <div
                className={`radio-option-card ${formData.deliveryMethod === 'express' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, deliveryMethod: 'express' })}
              >
                <div className="radio-left">
                  <Truck size={20} color="#22C55E" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Express Priority Dispatch (Same Day / 24 Hours)</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>First-morning bus waybill for urgent foodstuff requirements</div>
                  </div>
                </div>
                <strong style={{ color: 'var(--text-heading)' }}>₦3,500</strong>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="form-card">
              <h2 className="form-title">Payment Method</h2>

              <div
                className={`radio-option-card ${formData.paymentMethod === 'transfer' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'transfer' })}
              >
                <div className="radio-left">
                  <Building size={20} color="#0C6837" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Direct Bank Transfer (Moniepoint)</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-green-strong)', fontWeight: 600 }}>Recommended • Zero transaction delays</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'var(--surface-green-tint)', color: 'var(--text-green-strong)', padding: '3px 8px', borderRadius: 4, fontWeight: 800 }}>Instant</span>
              </div>

              {formData.paymentMethod === 'transfer' && (
                <div style={{ background: 'var(--surface-mint)', padding: 18, borderRadius: 12, marginBottom: 14, border: '2px solid #86EFAC', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-green-strong)' }}>
                      Official Payment Account
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(STORE_INFO.bank.accountNumber || '');
                        alert(`Account Number ${STORE_INFO.bank.accountNumber || '•••• ••••'} copied to clipboard!`);
                      }}
                      style={{
                        background: '#0C6837',
                        color: '#FFF',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Copy Account No
                    </button>
                  </div>

                  <p style={{ margin: '4px 0' }}><strong>Bank :</strong> {STORE_INFO.bank.bankName || 'Moniepoint'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Acc No:</strong> <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-green)', letterSpacing: '0.04em' }}>{STORE_INFO.bank.accountNumber || '•••• ••••'}</span></p>
                  <p style={{ margin: '4px 0' }}><strong>Name:</strong> {STORE_INFO.bank.accountName || 'Chygodwin Foodstuffs Global Concept'}</p>

                  <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.7)', padding: 10, borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-green-strong)', lineHeight: '1.4' }}>
                    💡 <em>After making your transfer, please send proof of payment on WhatsApp to <strong>{STORE_INFO.phone}</strong> for immediate package dispatch.</em>
                  </div>
                </div>
              )}

              <div
                className={`radio-option-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
              >
                <div className="radio-left">
                  <CreditCard size={20} color="#0C6837" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Card (Visa, Mastercard, Verve)</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Online debit card payment</div>
                  </div>
                </div>
                <ShieldCheck size={18} color="#16A34A" />
              </div>

              {formData.paymentMethod === 'card' && (
                <div style={{ background: 'var(--surface-subtle)', padding: 16, borderRadius: 10, marginBottom: 14, border: '1px solid var(--border-light)' }}>
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
                className={`radio-option-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
              >
                <div className="radio-left">
                  <DollarSign size={20} color="#0C6837" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pay on Delivery / Park Pickup</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cash on doorstep or waybill park verification</div>
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
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No items in checkout.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {cartItems.map((it) => (
                    <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-light)', paddingBottom: 10 }}>
                      <img src={it.image} alt={it.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', background: 'var(--surface-subtle)', border: '1px solid var(--border-light)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-strong)' }}>{it.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {it.quantity}</div>
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>
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

              <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.75rem', color: 'var(--text-light)' }}>
                You will receive a confirmation email shortly at <strong>{formData.email}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
