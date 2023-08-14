import { createContext, useContext, useMemo, useState, useEffect } from "react";
const CartContent = createContext();

export const CartProvider = ({ children }) => {
  const key = "lazada-cart";
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem(key)));

  const addItem = (data) => {
    let listOfId = cart?.map((item) => item.id);
    if (listOfId?.includes(data?.id)) {
      const newCart = cart.map((item) => {
        console.log("add quantity to existing product in cart");
        if (item.id === data.id) {
          item.quantity += 1;
          return item;
        } else {
          return item;
        }
      });
      setCart(newCart);
    } else {
      console.log("add new product to cart");
      data.quantity = 1;
      if (cart) {
        setCart([...cart, data]);
      } else {
        setCart([data]);
      }
    }
  };
  console.log(cart);

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
