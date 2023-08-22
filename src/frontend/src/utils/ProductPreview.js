import React, { memo } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import unknownProduct from "../assets/image/unknownProduct.png";

const ProductPreview = ({ data, show, handleClose }) => {
  console.log(data);
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">#{data?.id} Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <div className="w-100 text-center">
            <img
              src={unknownProduct}
              alt={data?.image_name}
              style={{ width: "150px" }}
            />
          </div>
          <h3 className="w-100 text-center fw-bolder mt-2">{data?.title}</h3>
          <p className="w-100 fs-5 text-center text-muted my-4">
            {data?.description}
          </p>
          <p className="w-100 text-center text-muted">$ {data?.price}</p>
          <p className="w-100 text-center text-muted ">
            {data?.width} x {data?.height} x {data?.length} (x,y,z)
          </p>
          <div className="w-100 d-flex flex-column flex-md-row justify-content-center justify-content-md-evenly align-items-center">
            <p className="text-secondary">Quantity: {data?.quantity}</p>
            <p className="text-secondary">
              Reserved Quantity: {data?.reserved_quantity}
            </p>
          </div>
          <p className="w-100 text-center text-secondary ">
            Created: {formatDate(data?.created_at)}
          </p>
          <p className="w-100 text-center text-secondary ">
            Updated: {formatDate(data?.updated_at)}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleClose()}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ProductPreview);
