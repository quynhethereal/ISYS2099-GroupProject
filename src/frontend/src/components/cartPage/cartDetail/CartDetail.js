import React, { useState } from "react";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

import { useCart } from "../../../hook/CartHook.js";
import { useAuth } from "../../../hook/AuthHook.js";
import { createOrder } from "../../../action/order/order.js";

import CartItem from "./CartItem";

const CartDetail = () => {
  // const navigate = useNavigate();
  const { token } = useAuth();
  const { cart } = useCart();

  const [isOrdered, setIsOrdered] = useState(false);

  const handleCreateOrder = async () => {
    if (!cart) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please add a product before creating order",
      });
      return;
    }
    const payload = {
      cart: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };
    await createOrder(token(), payload).then((result) => {
      // log
      if (result && result.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Order sucess",
          text: "Your order now in pending state for delivery",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Maximum 30 items are allowed per order",
        });
      }
    });
  };
  return (
    <>
      <div className="container my-4 d-flex flex-column flex-md-row justify-content-between align-items-start">
        <div className="col-12 col-md-2 p-3">
          <p className="text-danger fw-bold">Total amount</p>
          <hr className="hr" />
          <div className="d-flex flex-column">
            <p>
              Total amount: <span>123,2</span>
            </p>
            <p>
              Total quantity: <span>12</span>
            </p>
            <div>
              <button
                className="btn btn-success"
                onClick={() => handleCreateOrder()}
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-9 p-3">
          <table className="table text-start">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Amount</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart?.map((item, index) => {
                return (
                  <tr key={index}>
                    <CartItem data={item} index={index}></CartItem>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CartDetail;
