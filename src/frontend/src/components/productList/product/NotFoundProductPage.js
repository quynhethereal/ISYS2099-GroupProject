import React from "react";
import { useNavigate } from "react-router-dom";

import unknownProduct from "../../../assets/image/unknownProduct.png";

const NotFoundProductPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="container d-flex flex-column align-items-center justify-content-center"
        style={{ height: "100vh " }}
      >
        <div>
          <img src={unknownProduct} alt="Not found img" className="img-fluid" />
        </div>
        <div className="text-white text-center">
          <p className="my-4 fw-bolder text-danger">
            Oops! Sorry the product has not found
          </p>
          <button
            onClick={() => navigate("/customer")}
            type="button"
            className="btn btn-info shadow p-3 mb-5 rouded"
            style={{ borderRadius: "15px" }}
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFoundProductPage;
