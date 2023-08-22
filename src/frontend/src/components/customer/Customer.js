import React from "react";
import { useAuth } from "../../hook/AuthHook.js";
import Header from "../header/Header.js";
import ProductList from "../productList/ProductList.js";

const Customer = () => {
  const { user } = useAuth();
  return (
    <>
      <Header user={user}></Header>
      <ProductList></ProductList>
    </>
  );
};

export default Customer;
