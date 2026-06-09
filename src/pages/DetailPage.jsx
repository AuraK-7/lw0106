import React, {useContext } from 'react';
import { useParams, useNavigate } from 'react-router';

import { ServiceContext } from '../contexts/ServiceContext';
const DetailPage = () => {
  const { goodId } = useParams();
  const parsedGoodId = parseInt(goodId, 10);
  const services = useContext(ServiceContext);
  const navigate = useNavigate();

  const good = services.good.getGoodById(parsedGoodId);
  
  const onBuyClick = () => {
    navigate(`/createOrder/${goodId}`);
  }


  if (!good) {
    //TBD 璺宠浆涓婚〉
    navigate('/home');
  }

  return <>
    <h1>Detail Page</h1>
    <p> goodId: {good && goodId}</p>
    <p> goodName: {good && good.name}</p>
    <p> goodPrice: {good && good.price}</p>
    <p> goodCategoryId: {good && good.categoryId}</p>
    <img src={good && good.img} alt={good && good.name} />
    <button onClick={onBuyClick}>璐拱</button>
  </>
}

export default DetailPage;