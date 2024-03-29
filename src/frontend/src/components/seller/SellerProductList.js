import React, { useEffect, useState } from "react";

import { useAuth } from "../../hook/AuthHook.js";
import { getProductBySellerId } from "../../action/product/product.js";

import Product from "../productList/product/Product.js";
import ProductCreateForm from "../../utils/ProductCreateForm.js";

const SellerProductList = () => {
  const { token } = useAuth();
  const [params, setParams] = useState({
    limit: 10,
    currentPage: 0,
    totalPages: null,
  });

  const [products, setProducts] = useState([]);
  const [more, setMore] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const handleShowCreateProductForm = () => {
    setShowCreateProduct((prev) => !prev);
  };

  useEffect(() => {
    async function getProducts() {
      await getProductBySellerId(
        token(),
        params.currentPage + 1,
        params.limit
      ).then((res) => {
        if (res) {
          if (products.length === 0) {
            setProducts(res?.products);
          } else {
            setProducts([...products, ...res?.products]);
          }
          setParams({
            limit: res?.limit,
            currentPage: res?.currentPage,
            totalPages: res?.totalPages,
          });
        }
      });
    }

    if (params?.currentPage !== params?.totalPages || products?.length === 0) {
      getProducts();
    }
    // eslint-disable-next-line
  }, [more]);

  return (
    <div className="container p-4 d-flex flex-column justify-content-start align-items-center">
      <div className="col-12 d-flex">
        <button
          className="btn btn-info ms-auto"
          onClick={() => handleShowCreateProductForm()}
        >
          Create Product
        </button>
      </div>
      {showCreateProduct && (
        <ProductCreateForm
          show={showCreateProduct}
          handleClose={handleShowCreateProductForm}
        />
      )}
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
        {params?.currentPage !== params?.totalPages && (
          <button
            className="btn btn-warning"
            onClick={() => setMore((prev) => !prev)}
          >
            More products...
          </button>
        )}
      </div>
    </div>
  );
};

export default SellerProductList;
