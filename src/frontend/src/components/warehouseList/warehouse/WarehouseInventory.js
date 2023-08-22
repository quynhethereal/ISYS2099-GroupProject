import React, { memo, useState } from "react";

import ProductPreview from "../../../utils/ProductPreview.js";

const WarehouseInventory = ({ data }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [productData, setProductData] = useState();

  const handleShowProductPreview = (product) => {
    setProductData(product);
    setShowDetail(true);
  };
  const handleCloseProductPreview = () => {
    setShowDetail(false);
  };
  return (
    <div>
      <ul className="list-group list-group-numbered">
        {data?.map((product, index) => {
          return (
            <button
              className="my-1"
              style={{ background: "none", border: "none" }}
              onClick={() => handleShowProductPreview(product)}
              key={index}
            >
              <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="col-10 ms-2 me-auto">
                  <div className="col-12 d-inline-block text-truncate fw-bold">
                    {product?.title}
                  </div>
                  <span className="col-12 d-inline-block text-truncate text-muted">
                    {product?.description}
                  </span>
                </div>
                <span className="badge bg-primary rounded-pill">
                  {product?.quantity}
                </span>
              </li>
            </button>
          );
        })}
      </ul>
      <ProductPreview
        data={productData}
        show={showDetail}
        handleClose={handleCloseProductPreview}
      ></ProductPreview>
    </div>
  );
};

export default memo(WarehouseInventory);
