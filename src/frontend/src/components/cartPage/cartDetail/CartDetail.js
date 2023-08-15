import React from "react";

import CartItem from "./CartItem";
import { useCart } from "../../../hook/CartHook.js";

const CartDetail = () => {
  const { cart } = useCart();
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
          </div>
        </div>
        <div className="col-12 col-md-9 p-3">
          <table className="table text-center">
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
              {/* {!cart && (
                <div className="fw-bold fs-2 text-wanring">
                  No Items in your cart
                </div>
              )} */}
              {cart?.map((item, index) => {
                return (
                  <tr key={index}>
                    <CartItem data={item}></CartItem>
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
