import React from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import unknownProduct from "../../../assets/image/unknownProduct.png";

const Product = ({ info }) => {
  const navigate = useNavigate();
  const hanleViewProduct = (item) => {
    navigate(`/customer/product/details/${item.id}`);
  };

  // async function CheckImage(path) {
  //   await axios
  //     .get(info?.image)
  //     .then((result) => {
  //       return true;
  //     })
  //     .catch(() => {
  //       return false;
  //     });
  // }

  return (
    <>
      <div className="card" style={{ width: "16rem" }}>
        <div className="card-img-top text-center">
          <img
            // src={`data:image/png;base64,${base64String}`}
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

          <button
            className="btn btn-success"
            onClick={() => hanleViewProduct(info)}
          >
            View product
          </button>
        </div>
      </div>
    </>
  );
};

export default Product;
