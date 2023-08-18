import React from "react";

// import { useAuth } from "../../hook/AuthHook.js";

import DashBoard from "../header/DashBoard.js";
import AdminRenderPage from "./AdminRenderPage.js";

const Admin = () => {
  // const { user } = useAuth();
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
