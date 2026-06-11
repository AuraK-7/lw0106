import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RightOutlined, ArrowUpOutlined, SafetyCertificateOutlined, SwapOutlined, CustomerServiceOutlined, ThunderboltOutlined } from '@ant-design/icons';
import HeroCarousel from '../components/HeroCarousel';
import { useMallData } from '../hooks/useMallData';
import { getBanners, getCategories, getHotProducts, getNewProducts } from '../utils/mallStore';

export default function HomePage() {
  const navigate = useNavigate();
  const banners = useMallData(function(){return getBanners();},[]);
  const categories = useMallData(function(){return getCategories();},[]);
  const hot = useMallData(function(){return getHotProducts(8);},[]);
  const newest = useMallData(function(){
    var all = getNewProducts(12);
    var hotIds = hot.map(function(x){return x.id;});
    return all.filter(function(x){return !hotIds.includes(x.id);}).slice(0, 4);
  }, [hot]);
  const [showBack, setShowBack] = useState(false);

  useEffect(function(){
    function onScroll(){setShowBack(window.scrollY>600);}
    window.addEventListener('scroll',onScroll,{passive:true});
    return function(){window.removeEventListener('scroll',onScroll);};
  },[]);

  return (
    <div className="hp">
      <HeroCarousel banners={banners} />

      {/* 服务保障 */}
      {/* <div className="hp-strip">
        <span><SafetyCertificateOutlined /> 正品保障</span>
        <span><SwapOutlined /> 7 天退换</span>
        <span><CustomerServiceOutlined /> 在线客服</span>
        <span><ThunderboltOutlined /> 极速发货</span>
      </div> */}

      {/* 挑你所爱 */}
      <div className="shelf">
        <div className="shelf-header">
          <h2 className="shelf-title">挑你所爱</h2>
          <span className="shelf-subtitle">每一个品类，都值得细细挑选</span>
        </div>
        <div className="card-scroller">
          {categories.map(function(c){
            return (
              <div className="card-scroller-item" key={c.id}>
                <a className="ccard ccard-40"
                  onClick={function(e){e.preventDefault();navigate('/category?category='+c.id);}}
                  href={'/category?category='+c.id}>
                  <img className="ccard-image" alt={c.name} src={c.cover} />
                  <div className="ccard-content">
                    <div className="ccard-header">{c.name}</div>
                    <div className="ccard-desc">{c.description}</div>
                  </div>
                </a>
              </div>
            );
          })}
          {/* 全部分类入口 */}
          <div className="card-scroller-item">
            <a className="ccard ccard-40" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f0f0'}}
              onClick={function(e){e.preventDefault();navigate('/category');}}
              href="/category">
              <div style={{textAlign:'center',color:'#888'}}>
                <div style={{fontSize:'24px',marginBottom:'4px'}}>···</div>
                <div style={{fontSize:'13px',fontWeight:500}}>全部分类</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 中间促销横幅 */}
      {/* <div className="hp-promo" onClick={function(){navigate('/category?keyword=手机');}}>
        <div className="hp-promo-inner">
          <span className="hp-promo-tag">品牌日</span>
          <span className="hp-promo-text">热门手机 · 限时直降最高 ¥800</span>
          <span className="hp-promo-link">去看看 <RightOutlined/></span>
        </div>
      </div> */}

      {/* 大家都在买 */}
      <div className="shelf">
        <div className="shelf-header">
          <h2 className="shelf-title">大家都在买</h2>
          <span className="shelf-subtitle">看看别人都在挑什么</span>
          <span style={{marginLeft:'auto'}}>
            <a className="hp-hd-more" href="/category" onClick={function(e){e.preventDefault();navigate('/category');}}>
              全部商品 <RightOutlined/>
            </a>
          </span>
        </div>
        <div className="card-scroller">
          {hot.map(function(p){
            return (
              <div className="card-scroller-item" key={p.id}>
                <a className="ccard ccard-33"
                  onClick={function(e){e.preventDefault();navigate('/product/'+p.id);}}
                  href={'/product/'+p.id}>
                  <img className="ccard-image" alt={p.name} src={p.cover} />
                  <div className="ccard-content" style={{padding:'10px'}}>
                    <div className="ccard-header" style={{fontSize:'12px'}}>{p.name}</div>
                    <div className="ccard-price" style={{fontSize:'12px',fontWeight:600,marginTop:'1px',opacity:1}}>
                      ¥{p.price}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* 新品上架 */}
      <div className="shelf">
        <div className="shelf-header">
          <h2 className="shelf-title">新品上架</h2>
          <span className="shelf-subtitle">新鲜到货，抢先体验</span>
          <span style={{marginLeft:'auto'}}>
            <a className="hp-hd-more" href="/category" onClick={function(e){e.preventDefault();navigate('/category');}}>
              更多新品 <RightOutlined/>
            </a>
          </span>
        </div>
        <div className="card-scroller">
          {newest.map(function(p){
            return (
              <div className="card-scroller-item" key={p.id}>
                <a className="ccard ccard-33"
                  onClick={function(e){e.preventDefault();navigate('/product/'+p.id);}}
                  href={'/product/'+p.id}>
                  <img className="ccard-image" alt={p.name} src={p.cover} />
                  <div className="ccard-content" style={{padding:'10px'}}>
                    <div className="ccard-header" style={{fontSize:'12px'}}>{p.name}</div>
                    <div className="ccard-price" style={{fontSize:'12px',fontWeight:600,marginTop:'1px',opacity:1}}>
                      ¥{p.price}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* 限时秒杀 */}
      <div className="shelf">
        <div className="shelf-header">
          <h2 className="shelf-title" style={{color:'#e74c3c'}}>⏰ 限时秒杀</h2>
          <span className="shelf-subtitle">限时特价，手慢无</span>
          <span style={{marginLeft:'auto'}}>
            <a className="hp-hd-more" href="/category" onClick={function(e){e.preventDefault();navigate('/category');}}>
              更多优惠 <RightOutlined/>
            </a>
          </span>
        </div>
        <div className="card-scroller">
          {hot.slice(0,6).map(function(p){
            var d = Math.round((1-p.price/p.marketPrice)*100);
            return (
              <div className="card-scroller-item" key={p.id}>
                <a className="ccard ccard-33"
                  onClick={function(e){e.preventDefault();navigate('/product/'+p.id);}}
                  href={'/product/'+p.id}>
                  <img className="ccard-image" alt={p.name} src={p.cover} />
                  {d>0&&<span style={{position:'absolute',top:'6px',left:'6px',background:'#e74c3c',color:'#fff',fontSize:'10px',fontWeight:700,padding:'1px 5px',borderRadius:'3px',zIndex:1,lineHeight:'1.3'}}>-{d}%</span>}
                  <div className="ccard-content" style={{padding:'10px'}}>
                    <div className="ccard-header" style={{fontSize:'12px'}}>{p.name}</div>
                    <div className="ccard-price" style={{fontSize:'12px',fontWeight:600,marginTop:'1px',opacity:1,color:'#e74c3c'}}>
                      ¥{p.price}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* 快速入口 */}
      {/* <div className="hp-tags">
        <a className="hp-tag" href="/category?keyword=手机" onClick={function(e){e.preventDefault();navigate('/category?keyword=手机');}}>📱 手机专场</a>
        <a className="hp-tag" href="/category?keyword=智能" onClick={function(e){e.preventDefault();navigate('/category?keyword=智能');}}>🏠 智能设备</a>
        <a className="hp-tag" href="/category?keyword=美容" onClick={function(e){e.preventDefault();navigate('/category?keyword=美容');}}>💄 美妆热卖</a>
        <a className="hp-tag" href="/category?keyword=运动" onClick={function(e){e.preventDefault();navigate('/category?keyword=运动');}}>🏃 运动装备</a>
        <a className="hp-tag" href="/category" onClick={function(e){e.preventDefault();navigate('/category');}}>📦 全部商品</a>
      </div> */}

      {/* 返回顶部 */}
      {showBack && (
        <button className="back-top" onClick={function(){window.scrollTo({top:0,behavior:'smooth'});}} aria-label="返回顶部">
          <ArrowUpOutlined />
        </button>
      )}
    </div>
  );
}
