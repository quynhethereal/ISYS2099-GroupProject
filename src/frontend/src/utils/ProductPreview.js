import React, { memo } from "react";
import { useForm } from "react-hook-form";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import unknownProduct from "../assets/image/unknownProduct.png";

const ProductPreview = ({ data, show, handleClose, update }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: null,
    },
  });
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

  const handleUpdateChangeQuantity = (e) => {
    console.log(e);
  };
  const handleUpdateProduct = () => {};
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
            {data?.width} x {data?.height} x {data?.length} (x,y,z in meter)
          </p>
          <div className="w-100 d-flex flex-column flex-md-row justify-content-center justify-content-md-evenly align-items-center">
            {update ? (
              <form
                onSubmit={handleSubmit(handleUpdateChangeQuantity)}
                className="w-100 px-3"
              >
                <label
                  htmlFor="quantity-input"
                  className="form-label text-muted"
                >
                  Quantity {data?.quantity} (current)
                </label>
                <input
                  type="number"
                  id="quantity-input"
                  className="form-control"
                  {...register("quantity", {
                    required: "The quantity is required",
                    valueAsNumber: true,
                    pattern: {
                      value: /^[0-9]*[1-9][0-9]*$/,
                      message: "Input must be a number greater than 0.",
                    },
                  })}
                />
                {console.log(errors)}
                <p className="text-danger fw-bold">
                  {errors?.number && errors?.number?.message}
                </p>
              </form>
            ) : (
              <p className="text-secondary">Quantity: {data?.quantity}</p>
            )}
            {!update && (
              <p className="text-secondary">
                Reserved Quantity: {data?.reserved_quantity}
              </p>
            )}
          </div>
          {update && (
            <p className="w-100 text-center text-secondary">
              Reserved Quantity: {data?.reserved_quantity}
            </p>
          )}
          <p className="w-100 text-center text-secondary ">
            Created: {formatDate(data?.created_at)}
          </p>
          <p className="w-100 text-center text-secondary ">
            Updated: {formatDate(data?.updated_at)}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={() => handleClose()}>
          {update ? "Cancel" : "Ok"}
        </Button>
        {update && (
          <Button
            type="button"
            variant="primary"
            onClick={() => handleUpdateProduct()}
          >
            Update quantity
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ProductPreview);
