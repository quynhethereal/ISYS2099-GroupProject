import React, { useState, useEffect } from "react";
import Product from "./product/Product.js";

import { getAllProduct } from "../../action/product/product.js";

const ProductList = () => {
  const [product, setProduct] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [isFechtedEverything, setIsFechtedEverything] = useState(false);
  const [nextRequest, setNextRequest] = useState({
    nextId: 0,
    limit: 10,
  });

  const handleAddMoreProduct = async () => {
    setIsLoading(true);
    await getAllProduct(nextRequest?.nextId, nextRequest?.limit).then(
      (data) => {
        setProduct([...product, ...data?.products]);
        setNextRequest({
          nextId: data?.nextId,
          limit: data?.limit,
        });
        setIsLoading(false);
        if (data?.totalProductCount === data?.nextId) {
          setIsFechtedEverything(true);
        }
      }
    );
  };
  useEffect(() => {
    async function getInitialData() {
      await getAllProduct(nextRequest?.nextId, nextRequest?.limit).then(
        (data) => {
          setProduct(data?.products);
          setNextRequest({
            nextId: data?.nextId,
            limit: data?.limit,
          });
        }
      );
    }
    getInitialData();
    // eslint-disable-next-line
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
          {!isFechtedEverything && (
            <button
              className="btn btn-warning"
              onClick={() => handleAddMoreProduct()}
            >
              More products...
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
