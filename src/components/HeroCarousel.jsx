import { useEffect, useState } from 'react';

export default function HeroCarousel({ banners = [] }) {
  const [cur, setCur] = useState(0);
  const total = banners.length;

  useEffect(function () {
    if (total <= 1) return;
    const timer = setInterval(function () { setCur(function (p) { return (p + 1) % total; }); }, 5000);
    return function () { clearInterval(timer); };
  }, [total]);

  if (!banners.length) return null;

  return (
    <div className="hero" style={{ position: 'relative', overflow: 'hidden', background: '#000' }}>
      {banners.map(function (item, idx) {
        const act = idx === cur;
        return (
          <div key={item.id} style={{
            position: 'absolute', inset: 0,
            opacity: act ? 1 : 0,
            transform: act ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 0.6s, transform 6s',
            zIndex: act ? 1 : 0,
          }}>
            <img alt={item.title} src={item.image} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,26,46,0.8) 0%, transparent 60%)' }} />
            <div className="container" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {act && (
                <span style={{
                  display: 'inline-flex', alignSelf: 'flex-start', padding: '3px 10px',
                  fontSize: '11px', fontWeight: 600, color: '#fff',
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                  borderRadius: '4px', marginBottom: '10px',
                }}>
                  今日必抢
                </span>
              )}
              <h2 style={{
                fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, color: '#fff',
                lineHeight: 1.15, margin: '0 0 6px', maxWidth: '600px',
              }}>{item.title}</h2>
              <p style={{
                fontSize: 'clamp(13px, 1.5vw, 16px)', color: 'rgba(255,255,255,0.85)',
                margin: '0 0 14px', maxWidth: '480px',
              }}>{item.subtitle}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a className="btn-primary btn-small"
                  href="/category" onClick={function(e){e.preventDefault();window.location.hash='#/category';}}
                  style={{ display: 'inline-flex' }}>
                  立即选购 →
                </a>
                <a className="btn-secondary btn-small"
                  href="/category" onClick={function(e){e.preventDefault();window.location.hash='#/category';}}
                  style={{ display: 'inline-flex' }}>
                  了解更多
                </a>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ position: 'relative', height: '180px' }} />
      {total > 1 && (
        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 }}>
          {banners.map(function (_, idx) {
            return (
              <button key={idx} onClick={function () { setCur(idx); }}
                style={{
                  width: idx === cur ? '24px' : '8px', height: '8px',
                  borderRadius: '4px', border: 'none',
                  background: idx === cur ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer', transition: 'all 0.3s', padding: 0,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
