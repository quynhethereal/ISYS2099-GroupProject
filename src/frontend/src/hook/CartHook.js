import { createContext, useContext, useMemo, useState, useEffect } from "react";
const CartContent = createContext();

export const CartProvider = ({ children }) => {
  const key = "lazada-cart";
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem(key)));

  const addItem = (data, quanlity) => {
    let listOfId = cart?.map((item) => item.id);
    if (listOfId?.includes(data?.id)) {
      const newCart = cart.map((item) => {
        if (item.id === data.id) {
          if (quanlity) {
            item.quanlity = quanlity;
          } else {
            item.quanlity += 1;
          }
          return item;
        } else {
          return item;
        }
      });
      setCart(newCart);
    } else {
      data.quanlity = quanlity ? quanlity : 1;
      if (cart) {
        setCart([...cart, data]);
      } else {
        setCart([data]);
      }
    }
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
