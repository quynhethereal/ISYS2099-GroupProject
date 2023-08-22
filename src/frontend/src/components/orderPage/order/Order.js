import React from "react";

const Order = ({ data }) => {
  const handleRejctOrder = () => {};
  const handleUpdateOrder = () => {};
  return (
    <div className="card p-3">
      <div className="card-img-top d-flex flex-column justify-content-center align-items-center">
        <div className="progress col-12">
          <div className="progress-bar col-3" role="progressbar"></div>
        </div>
        <div className="mt-3 col-12 d-flex flex-row text-center">
          <div className="col-3 text-muted">Ordered</div>
          <div className="col-6 text-muted">Accepted</div>
          <div className="col-3 text-muted">Shipping</div>
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">
          Order number #{data?.id} is now in{" "}
          <b className="text-danger">{data?.status}</b> state
        </h5>
        <p className="card-text">
          Your order is now in pending state. Please wait the sellers to handle
        </p>
        <div className="col-12 d-flex flex">
          <button className="btn btn-danger" onClick={() => handleRejctOrder()}>
            Reject Order
          </button>
          <button
            className="btn ms-auto btn-success"
            onClick={() => handleUpdateOrder()}
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
