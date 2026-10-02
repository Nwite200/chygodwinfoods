import React from 'react';
import { Sparkles, Truck, ShieldCheck, ThumbsUp } from 'lucide-react';

export default function TrustBar() {
  const items = [
    {
      icon: <Sparkles size={22} />,
      title: 'Fresh & Quality',
      subtitle: '100% Authentic Nigerian Staples'
    },
    {
      icon: <Truck size={22} />,
      title: 'Fast & Reliable',
      subtitle: 'Doorstep Delivery'
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Secure Payment',
      subtitle: '256-Bit SSL Encrypted'
    },
    {
      icon: <ThumbsUp size={22} />,
      title: 'Trusted by Nigerians',
      subtitle: 'Home & Diaspora Preferred'
    }
  ];

  return (
    <section className="trust-strip">
      <div className="trust-container">
        {items.map((it, idx) => (
          <div key={idx} className="trust-item">
            <div className="trust-icon-box">
              {it.icon}
            </div>
            <div className="trust-content">
              <h4>{it.title}</h4>
              <p>{it.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
