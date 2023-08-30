import { createContext, useContext, useMemo, useState, useEffect } from "react";
const CartContent = createContext();

export const CartProvider = ({ children }) => {
  const key = "lazada-cart";
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem(key)));

  const addItem = (data, quantity) => {
    let listOfId = cart?.map((item) => item.id);
    if (listOfId?.includes(data?.id)) {
      const newCart = cart.map((item) => {
        if (item.id === data.id) {
          if (quantity) {
            item.quantity = quantity;
          } else {
            item.quantity += 1;
          }
          return item;
        } else {
          return item;
        }
      });
      setCart(newCart);
    } else {
      data.quantity = quantity ? quantity : 1;
      if (cart) {
        setCart([...cart, data]);
      } else {
        setCart([data]);
      }
    }
  };

  const removeItem = (data) => {
    if (cart.length === 1) {
      setCart(null);
    }
    setCart(cart.filter((item) => item.id !== data.id));
  };

  const resetItem = () => {
    localStorage.setItem(key, JSON.stringify(null));
  };

  useEffect(() => {
    if (!localStorage.getItem(key) || localStorage.getItem(key) == null) {
      localStorage.setItem(key, JSON.stringify(null));
    } else {
      if (cart != null) {
        localStorage.setItem(key, JSON.stringify(cart));
      }
    }
  }, [cart]);

  const value = useMemo(
    () => ({
      addItem,
      removeItem,
      resetItem,
      cart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart]
  );
  return <CartContent.Provider value={value}>{children}</CartContent.Provider>;
};

export const useCart = () => {
  return useContext(CartContent);
};
