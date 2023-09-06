import React, { useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CategoryAttributeForm = ({ data }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow((prev) => !prev);
  };
  return (
    <div>
      <button
        type="button"
        className="btn btn-info p-0"
        onClick={() => handleClose()}
      >
        <span className="badge bg-info d-flex align-items-center justify-content-center">
          {data?.name}
        </span>
      </button>
      {show && (
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="ms-auto">{data?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <p className="fw-bold">
                ID: <span className="fw-normal">{data?._id}</span>
              </p>
              <p className="fw-bold">
                Require:{" "}
                <span className="fw-normal">
                  {data?.required ? "True" : "False"}
                </span>
              </p>
              <p className="fw-bold">
                Value Description:{" "}
                <span className="fw-normal">
                  {data?.value?.description || "None"}
                </span>
              </p>
              <p className="fw-bold">
                Value Type:{" "}
                <span className="fw-normal">{data?.value?.type || "None"}</span>
              </p>
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
      )}
    </div>
  );
};

export default CategoryAttributeForm;
