import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router';

import { ServiceContext } from '../contexts/ServiceContext';


const CreateOrderPage = () => {
  const { goodId } = useParams();
  const services = useContext(ServiceContext);
  const navigate = useNavigate();

  const onSubmitClick = () => {
    // 1. 鍒涘缓璁㈠崟锛屾嬁鍒皁rderid
    const parsedGoodId = parseInt(goodId, 10);
    const good = services.good.getGoodById(parsedGoodId);
    if (!good) {
      //TBD 璺宠浆涓婚〉
      alert('鍟嗗搧涓嶅瓨鍦?);
      navigate('/home');
      return;
    }
    const order = services.order.createOrder(1, parsedGoodId, good.price)
    // 2. 璺宠浆鍒版敮浠橀〉闈?
    alert('涓嬪崟鎴愬姛锛岃鏀粯锛?);
    navigate(`/pay/${order.id}`);
    
  }

  return <>
    <h1>CreateOrder Page</h1>
    <p> goodId: {goodId}</p>
    <p>浣犳槸鍚﹁璐拱锛燂紵锛燂紵锛燂紵</p>
    <button onClick={onSubmitClick}>璐拱</button>
  </>
}

export default CreateOrderPage;