import React from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/image/icon.png";
import searchIcon from "../../assets/image/searchIcon.png";
import cart from "../../assets/image/cart.png";
import logout from "../../assets/image/logout.png";

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleToCartPage = () => {
    navigate("/customer/cart");
  };

  //just customer
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
          <div className="col-12 col-md-5 d-flex justtify-content-center align-items-center">
            <div className="w-100 input-group-lg mb-3 d-flex justify-content-center algin-items-center">
              <input
                type="text"
                className="form-control rounded-start"
                placeholder="Search product"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                style={{ background: "#f0f0f0" }}
              />
              <span className="input-group-append rounded-end">
                <button className="btn btn-warning" type="button">
                  <img
                    src={searchIcon}
                    alt="search logo"
                    style={{ width: "36px", height: "36px" }}
                  />
                </button>
              </span>
            </div>
          </div>

          <div className="col-12 col-md-1 d-flex justify-content-center align-items-center my-3 m-md-0">
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
          <div className="col-12 col-md-2 d-flex flex-column justtify-content-center align-items-center">
            <p>
              {user?.firstName}
              {user?.lastName}
            </p>
            <button
              type="button"
              className="d-flex flex-row justtify-content-center align-items-center btn btn-outline-warning"
            >
              <img
                src={logout}
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
