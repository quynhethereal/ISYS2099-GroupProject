import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../../hook/CartHook.js";
import { useAuth } from "../../../hook/AuthHook.js";
import { createOrder } from "../../../action/order/order.js";

import CartItem from "./CartItem";

const CartDetail = () => {
  const [isOrdering, setIsOrdering] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { cart, resetItem } = useCart();

  const handleCreateOrder = async () => {
    setIsOrdering(true);
    if (!cart || cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please add a product before creating order",
      });
      setIsOrdering(false);
      return;
    }
    const payload = {
      cart: cart?.map((item) => ({
        productId: item?.id,
        quantity: item?.quantity,
      })),
    };

    await createOrder(token(), payload).then((result) => {
      if (result && result?.status === 200) {
        var unFullFilledId = result?.data?.unfulfilledProducts;
        var unFullFilledName = [];
        var i = 0;
        var j = 0;
        while (++i <= cart?.length) {
          while (++j <= unFullFilledId.length) {
            if (parseInt(unFullFilledId[j - 1]) === parseInt(cart[i - 1]?.id)) {
              unFullFilledName.push(cart[i - 1]?.title);
              break;
            }
          }
        }
        if (
          result?.data?.orderId &&
          result?.data?.unfulfilledProducts.length === 0
        ) {
          resetItem();
          Swal.fire({
            icon: "success",
            title: "Order sucess",
            text: `Your order ${result?.data?.orderId} now in pending state for delivery. Reloading in 3 secs...`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).then(() => {
            navigate(0);
          });
        } else if (
          result?.data?.orderId &&
          result?.data?.unfulfilledProducts.length > 0
        ) {
          resetItem();
          Swal.fire({
            icon: "success",
            title: "Order sucess with some product only",
            text: `Your order ${
              result?.data?.orderId
            } now in pending state for delivery. But some products is not associated with it: ${unFullFilledName.join()} (out of stock. Reloading in 3 secs...)`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).then(() => {
            navigate(0);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to created the order",
            text: `The following products is out of stock: ${unFullFilledName.join()}`,
          });
        }
      } else {
        if (result?.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Maximum 30 items are allowed per order",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result?.response?.data?.message,
          });
        }
      }
    });
    setIsOrdering(false);
  };
  return (
    <>
      <div className="container my-4 d-flex flex-column flex-md-row justify-content-between align-items-start">
        <div className="col-12 col-md-2 p-3">
          <p className="text-danger fw-bold">Total amount</p>
          <hr className="hr" />
          <div className="d-flex flex-column">
            <p>
              Total amount:{" "}
              <span>
                $
                {cart &&
                  cart
                    ?.reduce(
                      (acc, o) => acc + o.quantity * parseFloat(o.price),
                      0
                    )
                    .toFixed(2)}
              </span>
            </p>
            <p>
              Total quantity:{" "}
              <span>
                {cart && cart?.reduce((acc, o) => acc + o.quantity, 0)}
              </span>
            </p>
            <div>
              <button
                className="btn btn-success col-12"
                onClick={() => handleCreateOrder()}
              >
                {isOrdering ? (
                  <div
                    className="spinner-border text-white"
                    role="status"
                  ></div>
                ) : (
                  "Create Order"
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-10 p-3">
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
