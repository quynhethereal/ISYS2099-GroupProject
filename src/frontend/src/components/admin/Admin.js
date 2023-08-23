import React from "react";

import DashBoard from "../header/DashBoard.js";
import AdminRenderPage from "./AdminRenderPage.js";

const Admin = () => {
  return (
    <>
      <div className="d-flex flex-column flex-md-row">
        <DashBoard></DashBoard>
        <AdminRenderPage></AdminRenderPage>
      </div>
    </>
  );
};

export default Admin;
