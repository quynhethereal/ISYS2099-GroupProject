import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hook/AuthHook.js";

import logo from "../../assets/image/icon.png";

import cart from "../../assets/image/cart.png";
import logoutImage from "../../assets/image/logout.png";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleToCartPage = () => {
    navigate("/customer/cart");
  };

  const handleToOrderPage = () => {
    navigate("/customer/order/delivery");
  };

  const handleToHomePage = () => {
    navigate("/customer");
  };
  return (
    <>
      <div className="container py-3">
        <div className="row d-flex flex-column flex-md-row justify-content-center align-items-center justify-content-md-between">
          <div className="col-12 col-md-2 text-center d-flex justtify-content-center align-items-center my-3 m-md-0">
            <button className="btn" onClick={() => handleToHomePage()}>
              <img src={logo} alt="app logo" className="img-fluid" />
            </button>
          </div>

          <div className="col-12 col-md-auto d-flex justify-content-md-end align-items-center my-3 m-md-0">
            <button
              className="btn btn-outline-warning"
              onClick={() => handleToCartPage()}
            >
              <img
                src={cart}
                alt="cart icon"
                style={{ width: "36px", height: "36px" }}
              />
            </button>
          </div>
          <div className="col-12 col-md-4 d-flex flex-column flex-md-row justify-content-center justify-content-md-evenly align-items-center">
            <button
              className="btn btn-outline-warning text-black my-2"
              onClick={() => handleToOrderPage()}
            >
              {user?.firstName}
              {user?.lastName}
            </button>
            <button
              type="button"
              className="d-flex flex-row justtify-content-center align-items-center btn btn-outline-warning"
              onClick={() => logout()}
            >
              <img
                src={logoutImage}
                alt="logout icon"
                style={{ width: "16px", height: "16px" }}
              />
              <span className="text-muted" style={{ fontSize: "16px" }}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
