import React from 'react';
import { Sparkles, Truck, ShieldCheck, ThumbsUp } from 'lucide-react';

export default function TrustBar() {
  const items = [
    {
      icon: <Sparkles size={22} />,
      title: 'Quality & Affordable',
      subtitle: 'Pure farm-direct Nigerian staples'
    },
    {
      icon: <Truck size={22} />,
      title: 'Nationwide & Beyond Waybill',
      subtitle: 'Dispatched from Nkwelle Light of God'
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Moniepoint Verified',
      subtitle: 'Acc No: •••• ••••'
    },
    {
      icon: <ThumbsUp size={22} />,
      title: '62 Available Staples',
      subtitle: 'Grains, oils, egusi & food combos'
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
