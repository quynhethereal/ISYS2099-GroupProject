import React from "react";
import { useNavigate } from "react-router-dom";

import http403 from "../../assets/image/http-403.avif";

const BlockPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="container-fluid d-flex flex-column justify-content-center align-items-center"
        style={{
          height: "100vh",
        }}
      >
        <div className="col-4 text-center">
          <img src={http403} className="img-fluid" alt="access denied" />
        </div>
        <h2 className="text-muted fw-bolder">We are sorry...</h2>
        <div className="d-flex flex-column justify-content-center align-items-center my-4">
          <p className="text-muted fw-bold text-center">
            The page you are trying to access has restricted access
          </p>
          <p className="text-muted fw-bold text-center">
            Please login to continue
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          type="button"
          className="col-1 btn btn-info shadow p-3 mb-5 rouded"
          style={{ borderRadius: "15px" }}
        >
          Go Back
        </button>
      </div>
    </>
  );
};

export default BlockPage;
