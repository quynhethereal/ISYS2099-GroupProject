import React from "react";
import { useNavigate } from "react-router-dom";

// import unknownProduct from "../../../assets/image/unknownProduct.png";

const Product = ({ info }) => {
  const navigate = useNavigate();
  const hanleViewProduct = (item) => {
    navigate(`/customer/product/details/${item.id}`, {
      replace: true,
    });
  };

  // function _arrayBufferToBase64(buffer) {
  //   var binary = "";
  //   var bytes = new Uint8Array(buffer);
  //   var len = bytes.byteLength;
  //   for (var i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(binary);
  // }

  // console.log(_arrayBufferToBase64(info.image.data));
  return (
    <>
      <div className="card" style={{ width: "16rem" }}>
        <div className="card-img-top text-center">
          <img
            // src={`data:image/png;base64,${base64String}`}
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
