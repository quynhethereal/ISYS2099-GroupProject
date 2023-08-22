import React, { useState } from "react";
import Swal from "sweetalert2";

import { useCart } from "../../../hook/CartHook.js";

import unknownProduct from "../../../assets/image/unknownProduct.png";
import deleteProduct from "../../../assets/image/deleteProduct.png";

const CartItem = ({ data, index }) => {
  const { addItem, removeItem } = useCart();
  const [amount, setAmount] = useState(data?.quantity ? data.quantity : 1);

  const handleRemoveItem = (info) => {
    if (amount > 1) {
      setAmount((prev) => prev - 1);
      addItem(info, amount - 1);
    }
  };
  const handleAddItem = (info) => {
    if (amount < 100) {
      setAmount((prev) => prev + 1);
      addItem(info, amount + 1);
    }
  };

  const handleRemoveProductFromCart = (info) => {
    removeItem(info);
    Swal.fire({
      icon: "success",
      title: "Removed product from cart",
      text: "Your cart has changed",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
  };

  return (
    <>
      <th scope="row">{index + 1}</th>
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
      <td>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div>$ {(amount * data?.price).toFixed(2)}</div>
          <button
            className="btn btn-primary"
            onClick={() => handleRemoveProductFromCart(data)}
          >
            <img src={deleteProduct} alt="" style={{ width: 24, height: 24 }} />
          </button>
        </div>
      </td>
    </>
  );
};

export default CartItem;
