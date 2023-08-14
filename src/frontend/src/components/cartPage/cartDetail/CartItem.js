import React, { useState, useEffect } from "react";
import unknownProduct from "../../../assets/image/unknownProduct.png";

const CartItem = ({ data }) => {
  const [amount, setAmount] = useState(data?.quantity ? data.quantity : 1);

  const handleRemoveItem = (info) => {
    if (amount > 1) {
      setAmount((prev) => prev - 1);
    }
  };
  const handleAddItem = (info) => {
    if (amount < 100) {
      setAmount((prev) => prev + 1);
    }
  };
  // console.log(amount);

  return (
    <>
      <th scope="row">{data.id}</th>
      <th>
        <img
          src={data?.image ? data.image : unknownProduct}
          alt="product img"
          style={{ maxWidth: "150px", maxHeight: "150px" }}
        />
      </th>
      <td>{data?.title}</td>
      <td>{data?.description}</td>
      <td>
        <div className="w-100 d-flex flex-row justify-content-center align-items-center">
          <button
            className="btn btn-danger rounded"
            onClick={() => handleRemoveItem(data)}
          >
            -
          </button>
          <div className="col-4 d-flex justify-content-center align-items-center">
            {amount}
          </div>
          <button
            className="btn btn-success rounded"
            onClick={() => handleAddItem(data)}
          >
            +
          </button>
        </div>
      </td>
      <td>{amount * data?.price}</td>
    </>
  );
};

export default CartItem;
