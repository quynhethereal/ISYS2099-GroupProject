import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import ProductPreview from "../../../utils/ProductPreview.js";
// import unknownProduct from "../../../assets/image/unknownProduct.png";

const Product = ({ info, update }) => {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const hanleViewProduct = (item) => {
    navigate(`/customer/product/details/${item.id}`);
  };
  const handleUpdateProduct = (item) => {
    console.log("Going to update", item);
    handleShowPreview();
  };

  const handleShowPreview = () => {
    setShowPreview((prev) => !prev);
  };
  return (
    <>
      <div className="card" style={{ width: "16rem" }}>
        <div className="card-img-top text-center">
          <img
            src={info?.image}
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
          {update && showPreview && (
            <ProductPreview
              data={info}
              show={showPreview}
              handleClose={handleShowPreview}
              update={true}
            />
          )}
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
