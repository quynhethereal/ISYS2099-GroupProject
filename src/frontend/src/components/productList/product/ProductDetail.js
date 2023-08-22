import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../../hook/AuthHook.js";
import { useCart } from "../../../hook/CartHook.js";
import { getProductById } from "../../../action/product/product.js";

import Header from "../../header/Header.js";
import NotFoundProductPage from "./NotFoundProductPage.js";
import unknownProduct from "../../../assets/image/unknownProduct.png";
import star from "../../../assets/image/star.png";

const ProductDetail = () => {
  const productId = useParams().id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState(1);
  const [randomComments, setRandomCommemts] = useState();

  useEffect(() => {
    async function findProduct() {
      await getProductById(productId).then((res) => {
        if (res) {
          setProduct(res);
        }
      });
    }
    findProduct();
    setRandomCommemts(Math.ceil(500 + Math.random() * (10000 - 500)));
    // eslint-disable-next-line
  }, []);

  const handleRemoveItem = () => {
    if (amount > 1) {
      setAmount((prev) => prev - 1);
    }
  };
  const handleAddItem = () => {
    if (amount < 100) {
      setAmount((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    addItem(product, amount);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Added product to cart",
      text: "You can see the details in cart",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };
  const handleBuyNow = () => {
    addItem(product, amount);
    navigate("/customer/cart");
  };
  return (
    <>
      <Header user={user}></Header>
      {product ? (
        <div className="container my-4 p-3 d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center align-items-md-start">
          <div className="col-12 col-md-4">
            <img
              src={product?.image ? product.image : unknownProduct}
              alt="product img"
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-md-7 d-flex flex-column p-4">
            <div>
              <span className="badge bg-danger">Lazada 2.0</span>
            </div>
            <div className="text-warp fw-bolder my-4">
              <h1>{product?.title}</h1>
            </div>
            <div className="text-warp text-muted mb-4">
              <p>{product?.description}</p>
            </div>
            <div className="d-flex flex-row align-items-center">
              {[1, 2, 3, 4, 5].map((item) => {
                return (
                  <img
                    key={item}
                    src={star}
                    alt="star"
                    style={{ width: "20px", height: "20px" }}
                  />
                );
              })}
              <span className="ms-4 fs-5">{randomComments}</span>
              <span className="ms-2 text-muteed text-decoration-underline">
                Ratings
              </span>
            </div>
            <div className="my-4 d-flex flex-row justify-content-center justify-content-md-start align-items-center align-items-md-start">
              <button
                className="btn btn-secondary rounded"
                onClick={() => handleRemoveItem()}
              >
                -
              </button>
              <div className="col-4 d-flex justify-content-center align-items-center">
                {amount}
              </div>
              <button
                className="btn btn-secondary rounded"
                onClick={() => handleAddItem()}
              >
                +
              </button>
            </div>
            <div className="d-flex flex-row justify-content-evenly justify-content-md-start align-items-center align-items-md-start">
              <button
                type="button"
                className="col-lg-2 btn btn-warning me-md-5"
                onClick={() => handleBuyNow()}
              >
                Buy Now
              </button>
              <button
                type="button"
                className="col-lg-2 btn btn-success"
                onClick={() => handleAddToCart()}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <NotFoundProductPage />
      )}
    </>
  );
};

export default ProductDetail;
