import { Carousel } from 'antd';

// 首页轮播图组件。
export default function HeroCarousel({ banners = [] }) {
  return (
    <Carousel autoplay className="hero-carousel">
      {banners.map(function (item) {
        return (
          <div key={item.id}>
            <div className="hero-slide">
              <img alt={item.title} src={item.image} />
              <div className="hero-overlay">
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
}
