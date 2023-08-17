import React from "react";
import { useLocation } from "react-router-dom";

import WarehouseList from "../warehouseList/WarehouseList.js";

const AdminRenderPage = () => {
  const location = useLocation().pathname;
  return (
    <>{location === "/admin/warehouse" && <WarehouseList></WarehouseList>}</>
  );
};

export default AdminRenderPage;
