import React from "react";
import { useAuth } from "../../hook/AuthHook.js";
import Header from "../header/Header.js";
import CartDetail from "./cartDetail/CartDetail.js";

const CartPage = () => {
  const { user } = useAuth();
  return (
    <>
      <Header user={user}></Header>
      <CartDetail></CartDetail>
    </>
  );
};

export default CartPage;
