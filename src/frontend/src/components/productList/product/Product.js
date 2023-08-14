import React from "react";

import unknownProduct from "../../../assets/image/unknownProduct.png";

const Product = ({ info }) => {
  return (
    <>
      <div className="card" style={{ width: "16rem" }}>
        <div className="card-img-top text-center">
          <img
            src={unknownProduct}
            alt="product"
            style={{ width: 200, height: 200 }}
          />
        </div>
        <div className="card-body">
          <h5 className="card-title text-truncate">{info.title}</h5>
          <div className="card-text ">
            <p
              className="fw-bolder overflow-hidden"
              style={{ height: "4.5rem" }}
            >
              {info.description}
            </p>
            <p className="text-truncate text-danger">
              <b className="text-decoration-underline fw-bold">đ</b>
              {info.price}
            </p>
          </div>

          <button className="btn btn-success">Add product</button>
        </div>
      </div>
    </>
  );
};

export default Product;
