import React, { useState } from "react";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hook/AuthHook.js";
import { rejectOrder, acceptOrder } from "../../../action/order/order.js";

import OrderPreview from "../../../utils/OrderPreview.js";

const Order = ({ data }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  function stateProgressBar() {
    switch (data?.status) {
      case "pending":
        return "col-3";
      case "accepted":
        return "col-6";
      case "rejected":
        return "col-6";
      default:
        return;
    }
  }

  function stateMessage() {
    switch (data?.status) {
      case "pending":
        return "Please handle it in order to change to accepted state";
      case "accepted":
        return "Please wait for the order to be processed before shipping";
      case "rejected":
        return "You can just view this rejected order";
      default:
        return;
    }
  }

  const handleViewOrder = () => {
    setShow((prev) => !prev);
  };

  const handleRejctOrder = async (id) => {
    await rejectOrder(token(), id).then((res) => {
      if (res?.data?.order?.status === "rejected") {
        Swal.fire({
          icon: "success",
          title: "Rejected the order",
          text: "The products in order now being sent back to appropriate warehouses...",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        }).then(() => {
          navigate(0);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Sorry, some problem occurred! Try again",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
  };
  const handleAcceptOrder = async (id) => {
    await acceptOrder(token(), id).then((res) => {
      console.log(res);
      if (res && res?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Accepted the order",
          text: "The order is now moved to the inventory warehouse for shipping...",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        }).then(() => {
          // navigate(0);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Sorry, some problem occurred! Try again",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
  };
  return (
    <div className="card p-3">
      <div className="card-img-top d-flex flex-column justify-content-center align-items-center">
        <div className="progress col-12">
          <div
            className={`progress-bar ${stateProgressBar()}`}
            role="progressbar"
          ></div>
        </div>
        <div className="mt-3 col-12 d-flex flex-row text-center">
          <div className="col-3 text-muted">Ordered</div>
          <div className="col-6 text-muted">Accepted/Rejected</div>
          <div className="col-3 text-muted">Shipping</div>
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">
          Order number #{data?.id} is now in{" "}
          <b className="text-danger">{data?.status}</b> state
        </h5>
        <p className="card-text">
          Your order is now in {data?.status} state. {stateMessage()}
        </p>
        {data?.status === "pending" ? (
          <div className="col-12 d-flex flex justify-content-between">
            <button
              className="btn btn-danger"
              onClick={() => handleRejctOrder(data?.id)}
            >
              Reject Order
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleViewOrder()}
            >
              View Order
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleAcceptOrder(data?.id)}
            >
              Accept Order
            </button>
          </div>
        ) : (
          <div className="col-12 d-flex flex justify-content-between">
            <button
              className="btn btn-warning"
              onClick={() => handleViewOrder()}
            >
              View Order
            </button>
          </div>
        )}
        {show && (
          <OrderPreview
            show={show}
            handleClose={setShow}
            data={data}
          ></OrderPreview>
        )}
      </div>
    </div>
  );
};

export default Order;
