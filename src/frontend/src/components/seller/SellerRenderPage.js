import React from "react";
import { useLocation } from "react-router-dom";

import SellerProductList from "./SellerProductList";

const SellerRenderPage = () => {
  const location = useLocation().pathname;
  return (
    <>
      {location === "/seller" && <SellerProductList></SellerProductList>}
      {/* {location === "/seller/inventory" && <WarehouseList></WarehouseList>} */}
    </>
  );
};

export default SellerRenderPage;
