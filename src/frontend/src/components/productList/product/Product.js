import React from "react";

import { useNavigate } from "react-router-dom";

import unknownProduct from "../../../assets/image/unknownProduct.png";

const Product = ({ info, update }) => {
  const navigate = useNavigate();
  const hanleViewProduct = (item) => {
    navigate(`/customer/product/details/${item.id}`);
  };
  const handleUpdateProduct = (item) => {
    console.log("we are going to update this");
  };
  return (
    <>
      <div className="card" style={{ width: "16rem" }}>
        <div className="card-img-top text-center">
          <img
            src={info?.image || unknownProduct}
            alt={info?.image_name ? info?.image_name : "product"}
            style={{ width: 200, height: 200 }}
          />
        </div>
        <div className="card-body">
          <h5 className="card-title text-truncate">{info?.title}</h5>
          <div className="card-text ">
            <p
              className="fw-bolder overflow-hidden"
              style={{ height: "4.5rem" }}
            >
              {info?.description}
            </p>
            <p className="text-truncate text-danger">
              <b className="text-decoration-underline fw-bold">đ</b>
              {info?.price}
            </p>
          </div>

          {update ? (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => handleUpdateProduct(info)}
            >
              Update product
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => hanleViewProduct(info)}
            >
              View product
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
