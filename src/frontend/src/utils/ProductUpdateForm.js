import React, { memo } from "react";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { updateProduct } from "../action/product/product.js";
import { useAuth } from "../hook/AuthHook.js";
import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ProductUpdateForm = ({ data, show, handleClose }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: null,
    },
  });

  const handleUpdateProduct = async (value) => {};
  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit(handleUpdateProduct)}>
        <Modal.Header closeButton>
          <Modal.Title className="ms-auto">#{data?.id} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 d-flex flex-column justify-content-center align-items-center">
            <div className="w-100 text-center">
              <img
                src={data?.image}
                alt={data?.image_name ? data?.image_name : "product"}
                style={{ width: "150px" }}
              />
            </div>
            <h3 className="w-100 text-center fw-bolder mt-2">{data?.title}</h3>
            <p className="w-100 fs-5 text-center text-muted my-4">
              {data?.description}
            </p>
            <p className="w-100 text-center text-muted">$ {data?.price}</p>
            <p className="w-100 text-center text-muted ">
              {data?.width} x {data?.height} x {data?.length} (x,y,z in meter)
            </p>
            <div className="w-100 d-flex flex-column flex-md-row justify-content-center justify-content-md-evenly align-items-center">
              <p className="text-secondary">
                Reserved Quantity: {data?.reserved_quantity}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="primary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button className="btn btn-primary" type="submit">
            Update
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default memo(ProductUpdateForm);
