import React from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CategoryAttributeForm = ({ data, show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        {console.log(data)}
        <Modal.Title className="ms-auto">Attribute</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center align-items-center"></div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="w-100"
          variant="primary"
          onClick={() => handleClose()}
        >
          Ok
        </Button>
        {/* <Button
          type="submit"
          className="w-100"
          variant="primary"
          onClick={() => handleClose()}
        >
          Create
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryAttributeForm;
