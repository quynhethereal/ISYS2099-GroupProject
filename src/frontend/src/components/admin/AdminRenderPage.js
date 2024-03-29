import React from "react";
import { useLocation } from "react-router-dom";

import WarehouseList from "../warehouseList/WarehouseList.js";
import Inventory from "../inventory/Inventory.js";
import Category from "../category/Category.js";

const AdminRenderPage = () => {
  const location = useLocation().pathname;
  return (
    <>
      {location === "/admin/warehouse" && <WarehouseList></WarehouseList>}
      {location === "/admin" && <Inventory></Inventory>}
      {location === "/admin/category" && <Category></Category>}
    </>
  );
};

export default AdminRenderPage;
