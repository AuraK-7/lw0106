import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCartItems, getCurrentUser, subscribeMallChange } from '../utils/mallStore';

const CartContext = createContext(null);

// 购物车上下文主要提供购物车数量和金额汇总。
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(function () {
    const user = getCurrentUser();
    return user ? getCartItems(user.id) : [];
  });

  useEffect(function () {
    return subscribeMallChange(function () {
      const user = getCurrentUser();
      setCartItems(user ? getCartItems(user.id) : []);
    });
  }, []);

  const value = useMemo(function () {
    const checkedItems = cartItems.filter(function (item) { return item.checked; });
    return {
      cartItems,
      checkedItems,
      cartCount: cartItems.reduce(function (sum, item) { return sum + item.quantity; }, 0),
      checkedCount: checkedItems.length,
      totalAmount: checkedItems.reduce(function (sum, item) { return sum + item.amount; }, 0),
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
