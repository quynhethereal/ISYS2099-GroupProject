import React from "react";
import { useLocation } from "react-router-dom";

import logo from "../../assets/image/icon.png";
import home from "../../assets/image/home.png";
import warehouse from "../../assets/image/warehouse.png";
import product from "../../assets/image/product.png";

const DashBoard = () => {
  const location = useLocation().pathname;
  return (
    <div
      className="col-4 col-sm-4 col-md-3 col-lg-2 d-flex flex-column flex-shrink-0 p-3 text-white"
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
            href="/admin"
            className={`nav-link text-black d-flex justify-content-start align-items-center ${
              location === "/admin" && "active"
            }`}
            aria-current="page"
          >
            <span>
              <img
                src={home}
                alt="home logo"
                className="img-fluid me-3"
                style={{ width: "28px" }}
              />
            </span>
            Home
          </a>
        </li>
        <li className="nav-item my-2">
          <a
            href="/admin/warehouse"
            className={`nav-link text-black d-flex justify-content-start align-items-center ${
              location === "/admin/warehouse" && "active"
            }`}
            aria-current="page"
          >
            <span>
              <img
                src={warehouse}
                alt="warehouse logo"
                className="img-fluid me-3"
                style={{ width: "28px" }}
              />
            </span>
            WareHouse
          </a>
        </li>
        <li className="nav-item my-2">
          <a
            href="/admin/products"
            className={`nav-link text-black d-flex justify-content-start align-items-center ${
              location === "/admin/products" && "active"
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
            WareHouse
          </a>
        </li>
      </ul>
      <hr />
      <div className="last-element"></div>
    </div>
  );
};

export default DashBoard;
