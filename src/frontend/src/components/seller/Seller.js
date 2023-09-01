import React from "react";

import DashBoard from "../header/ControlPanel.js";
import SellerRenderPage from "./SellerRenderPage.js";

const Seller = () => {
  return (
    <>
      <div className="d-flex flex-column flex-md-row">
        <DashBoard></DashBoard>
        <SellerRenderPage></SellerRenderPage>
      </div>
    </>
  );
};

export default Seller;
