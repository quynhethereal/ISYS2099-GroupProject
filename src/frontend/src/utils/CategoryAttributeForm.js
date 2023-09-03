import React from "react";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormInput from "./FormInput.js";

const CategoryAttributeForm = ({ data, show, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: data?.category_id,
      title: data?.title,
      description: data?.description,
      price: data?.price,
      image: data?.image,
    },
  });
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">Create Attribute</Modal.Title>
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
