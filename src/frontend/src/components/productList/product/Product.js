import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import ProductPreview from "../../../utils/ProductPreview.js";
import ProductUpdateForm from "../../../utils/ProductUpdateForm.js";

const Product = ({ info, update }) => {
  const [showUpdateQuantityForm, setShowUpdateQuantityForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const navigate = useNavigate();
  const hanleViewProduct = (item) => {
    navigate(`/customer/product/details/${item.id}`);
  };
  const handleUpdateProductQuantity = (item) => {
    handleOpenUpdateQuantityForm();
  };

  const handleOpenUpdateQuantityForm = () => {
    setShowUpdateQuantityForm((prev) => !prev);
  };

  const handleOpenUpdateForm = () => {
    setShowUpdateForm((prev) => !prev);
  };

  const handleUpdateProduct = (item) => {};
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
          {update && showUpdateQuantityForm && (
            <ProductPreview
              data={info}
              show={showUpdateQuantityForm}
              handleClose={handleOpenUpdateQuantityForm}
              update={true}
            />
          )}
          {update && showUpdateForm && (
            <ProductUpdateForm
              data={info}
              show={showUpdateForm}
              handleClose={handleOpenUpdateForm}
            />
          )}
          {update ? (
            <div>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => handleUpdateProductQuantity(info)}
              >
                Update quantity
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => handleUpdateProduct(info)}
              >
                Update quantity
              </button>
            </div>
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
