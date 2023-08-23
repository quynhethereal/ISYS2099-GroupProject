import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const OrderPreview = ({ data, show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">#{data?.id} Order</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleClose()}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderPreview;
