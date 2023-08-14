import React from "react";
import Product from "./product/Product.js";

const productList = () => {
  return (
    <>
      <div className="container">
        <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
          {["1", "2", "3", "4", "5", "6"].map((item, index) => {
            return (
              <div key={index} className="">
                <Product info={item}></Product>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default productList;
