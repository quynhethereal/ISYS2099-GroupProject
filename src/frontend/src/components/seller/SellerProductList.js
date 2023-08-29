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

  const [products, setProducts] = useState([]);
  const [more, setMore] = useState(false);

  useEffect(() => {
    async function getProducts() {
      await getProductBySellerId(
        token(),
        params.currentPage,
        params.limit
      ).then((res) => {
        if (res) {
          if (products.length === 0) {
            setProducts(res?.products);
          } else {
            setProducts([...products, res?.products]);
          }
          setParams({
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
  }, [more]);

  console.log(products);
  return (
    <div className="container p-4 d-flex flex-column justify-content-start align-items-center">
      <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
        {products?.map((item, index) => {
          return (
            <div key={index}>
              <Product info={item} update={true}></Product>
            </div>
          );
        })}
      </div>
      <div className="col-12 text-center">
        <button
          className="btn btn-warning"
          onClick={() => setMore((prev) => !prev)}
        >
          More products...
        </button>
      </div>
    </div>
  );
};

export default SellerProductList;
