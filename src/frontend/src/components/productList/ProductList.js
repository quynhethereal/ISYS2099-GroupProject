import React, { useState, useEffect } from "react";
import Product from "./product/Product.js";

import { getAllProduct } from "../../action/product/product.js";

const ProductList = () => {
  const [product, setProduct] = useState();
  const [isloading, setIsLoading] = useState(false);

  const handleAddMoreProduct = async () => {
    setIsLoading(true);
    console.log(product.length);
    await getAllProduct(product.length, 10).then((data) => {
      setProduct([...product, ...data?.products]);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    async function getInitialData() {
      await getAllProduct(0, 10).then((data) => {
        setProduct(data?.products);
      });
    }
    getInitialData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
          {product?.map((item, index) => {
            return (
              <div key={index} className="">
                <Product info={item}></Product>
              </div>
            );
          })}
        </div>
        <div className="my-4 d-flex justify-content-center algin-items-center">
          {isloading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          <button
            className="btn btn-warning"
            onClick={() => handleAddMoreProduct()}
          >
            More products...
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductList;
