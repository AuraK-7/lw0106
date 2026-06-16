import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroCarousel({ banners = [], onShopNow }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const total = banners.length;

  useEffect(function () {
    if (total <= 1) return undefined;
    const timer = setInterval(function () {
      setCurrent(function (prev) { return (prev + 1) % total; });
    }, 5000);
    return function () { clearInterval(timer); };
  }, [total]);

  if (!banners.length) return null;

  function go(offset) {
    setCurrent(function (prev) { return (prev + offset + total) % total; });
  }

  function handleShopNow(item) {
    if (onShopNow) {
      onShopNow(item);
      return;
    }
    navigate('/');
  }

  return (
    <section className="hero-carousel" aria-label="首页轮播图">
      {banners.map(function (item, index) {
        const active = index === current;
        return (
          <div className={'hero-panel' + (active ? ' active' : '')} key={item.id}>
            <img alt={item.title} className="hero-image" src={item.image} />
            <div className="hero-shade" />
            <div className="hero-copy">
              <span className="hero-kicker">{item.kicker || '今日推荐'}</span>
              <h1>{item.title}</h1>
              <p>{item.subtitle}</p>
              <button className="btn-primary btn-large" onClick={function () { handleShopNow(item); }}>
                立即选购
              </button>
            </div>
          </div>
        );
      })}
      {total > 1 ? (
        <>
          <button className="hero-nav hero-prev" onClick={function () { go(-1); }} aria-label="上一张">
            <LeftOutlined />
          </button>
          <button className="hero-nav hero-next" onClick={function () { go(1); }} aria-label="下一张">
            <RightOutlined />
          </button>
          <div className="hero-dots">
            {banners.map(function (_, index) {
              return (
                <button
                  aria-label={'切换到第 ' + (index + 1) + ' 张'}
                  className={index === current ? 'active' : ''}
                  key={index}
                  onClick={function () { setCurrent(index); }}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </section>
  );
}
