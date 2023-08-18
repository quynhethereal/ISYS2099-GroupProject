import React, { memo } from "react";

const WarehouseInventory = ({ data }) => {
  return (
    <div>
      <ul className="list-group list-group-numbered">
        {data?.map((product, index) => {
          return (
            <li
              className="list-group-item d-flex justify-content-between align-items-start"
              key={index}
            >
              <div className="col-10 ms-2 me-auto">
                <div className="col-12 d-inline-block text-truncate fw-bold">
                  {product.title}
                </div>
                <span className="col-12 d-inline-block text-truncate text-muted">
                  {product.description}
                </span>
              </div>
              <span className="badge bg-primary rounded-pill">
                {product.quantity}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(WarehouseInventory);
