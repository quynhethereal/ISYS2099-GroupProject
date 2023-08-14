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
          <h5 className="card-title text-truncate">Product Name</h5>
          <p className="card-text text-truncate text-danger">
            <b className="text-decoration-underline fw-bold">đ</b>54,000
          </p>
          <button className="btn btn-primary">Add product</button>
        </div>
      </div>
    </>
  );
};

export default Product;
