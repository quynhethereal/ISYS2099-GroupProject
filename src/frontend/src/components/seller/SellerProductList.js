import React, { useEffect, useState } from "react";

import { useAuth } from "../../hook/AuthHook.js";
import { getProductBySellerId } from "../../action/product/product.js";

import Product from "../productList/product/Product.js";

const SellerProductList = () => {
  const { token } = useAuth();
  const [params, setParams] = useState({
    limit: null,
    currentPage: null,
    totalPage: null,
  });

  useEffect(() => {
    async function getProducts() {
      await getProductBySellerId(
        token(),
        params.currentPage,
        params.limit
      ).then((res) => {
        if (res) {
          setParams({
            product: res?.products,
            limit: res?.limit,
            currentPage: res?.currentPage,
            totalPage: res?.totalPage,
          });
        }
      });
    }

    if ((params?.currentPage !== params?.totalPage) !== null && token()) {
      getProducts();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container p-4 d-flex flex-column justify-content-start align-items-center">
      <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
        {params?.product?.map((item, index) => {
          return (
            <div key={index}>
              <Product info={item} update={true}></Product>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerProductList;
