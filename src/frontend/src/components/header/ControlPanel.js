import React from "react";

import { useLocation } from "react-router-dom";

import { useAuth } from "../../hook/AuthHook.js";

import logo from "../../assets/image/icon.png";
import logoutImage from "../../assets/image/logout.png";
import product from "../../assets/image/product.png";

const ControlPanel = () => {
  const { logout } = useAuth();
  const location = useLocation().pathname;
  return (
    <div
      className="col-12 col-md-3 col-lg-2 d-flex flex-column flex-shrink-0 p-3 text-white sticky-md-top"
      style={{ height: "100vh", background: "#f0f0f0" }}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <img src={logo} alt="app logo" className="img-fluid" />
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item my-2">
          <a
            href="/seller"
            className={`nav-link text-black d-flex justify-content-start align-items-center ${
              location === "/seller" && "active"
            }`}
            aria-current="page"
          >
            <span>
              <img
                src={product}
                alt="product logo"
                className="img-fluid me-3"
                style={{ width: "28px" }}
              />
            </span>
            Product
          </a>
        </li>
      </ul>
      <hr style={{ border: "1px solid black" }} />
      <div className="d-flex flex-column flex-md-row">
        <button
          type="button"
          className="col-12 d-flex flex-row justtify-content-center align-items-center btn btn-outline-warning"
          onClick={() => logout()}
        >
          <img
            src={logoutImage}
            alt="logout icon"
            className="img-fluid me-3"
            style={{ width: "28px" }}
          />
          <span className="text-muted" style={{ fontSize: "16px" }}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
