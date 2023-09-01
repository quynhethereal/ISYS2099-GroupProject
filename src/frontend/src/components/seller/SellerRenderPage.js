import React from "react";
import { useLocation } from "react-router-dom";

import SellerProductList from "./SellerProductList";
// import SellerInventory from "./SellerInventory";

const SellerRenderPage = () => {
  const location = useLocation().pathname;
  return (
    <>{location === "/seller" && <SellerProductList></SellerProductList>}</>
  );
};

export default SellerRenderPage;
