import React from "react";
import { useNavigate } from "react-router-dom";

import http404 from "../../assets/image/http-404.jpeg";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="container d-flex align-items-center position-relative"
        style={{ height: "100vh " }}
      >
        <img src={http404} alt="background 404" className="img-fluid" />
        <div className="col-8 position-absolute text-white text-center">
          <p className="my-4 fw-bolder">Oops! Sorry the page has not founded</p>
          <button
            onClick={() => navigate("/")}
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

export default NotFoundPage;
