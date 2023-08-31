import React from "react";
import { useAuth } from "../../hook/AuthHook.js";
import { useLocation } from "react-router-dom";
import Header from "../header/Header.js";
import ProductList from "../productList/ProductList.js";
import ProductListBrowse from "../productList/ProductListBrowse.js";
import ProductListSearch from "../productList/ProductListSearch.js";
import ProductListPrice from "../productList/ProductListPrice.js";

const Customer = () => {
  const { user } = useAuth();
  const location = useLocation().pathname;
  return (
    <>
      <Header user={user}></Header>
      {location === "/customer/browse" && <ProductListBrowse />}
      {location === "/customer/search" && <ProductListSearch />}
      {location === "/customer/price" && <ProductListPrice />}
      {location === "/customer" && <ProductList />}
    </>
  );
};

export default Customer;
