import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { useAuth } from "../hook/AuthHook.js";
import { getOrderById } from "../action/order/order.js";

const OrderPreview = ({ data, show, handleClose }) => {
  const [detail, setDetail] = useState([]);
  function stateProgressBar() {
    switch (detail?.status) {
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
  const { token } = useAuth();
  useEffect(() => {
    async function getOrderDetail() {
      await getOrderById(token(), data?.id).then((res) => {
        if (res) {
          setDetail(res);
        }
      });
    }
    if (data?.id) {
      getOrderDetail();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">#{data?.id} Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="col-12">
            <div className="progress col-12">
              <div
                className={`progress-bar ${stateProgressBar()} bg-warning`}
                role="progressbar"
              ></div>
            </div>
            <div className="mt-3 col-12 d-flex flex-row text-center">
              <div className="col-3 text-muted">Pending</div>
              <div className="col-6 text-muted">Accepted</div>
              <div className="col-3 text-muted">Shipping</div>
            </div>
          </div>
          <div className="col-12 d-flex flex-column my-3">
            <div className="d-flex flex-row justify-content-between align-items-center p-2 text-start fw-bold">
              <div className="col-2">Name</div>
              <div className="col-3">Image</div>
              <div className="col-4">Description</div>
              <div className="col-2">Quantity</div>
            </div>
            {detail?.orderItems?.map((product, index) => {
              return (
                <div
                  key={index}
                  className="d-flex flex-row justify-content-between align-items-center p-2 text-start text-secondary"
                >
                  <div className="col-2">{product?.title}</div>
                  <div className="col-3">{product?.image}</div>
                  <div className="col-4">{product?.description}</div>
                  <div className="col-2">{product?.quantity}</div>
                </div>
              );
            })}
          </div>
          <div className="col-12 d-flex flex-row justify-content-between align-items-center">
            <div className="fw-bold">Total</div>
            <div className="text-secondary">{detail?.totalPrice}</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="w-100"
          variant="primary"
          onClick={() => handleClose()}
        >
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderPreview;
