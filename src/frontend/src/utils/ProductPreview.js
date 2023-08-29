import React, { memo } from "react";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { updateProductQuantity } from "../action/product/product.js";
import { useAuth } from "../hook/AuthHook.js";
import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ProductPreview = ({ data, show, handleClose, update }) => {
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

  const handleUpdateChangeQuantity = async (value) => {
    await updateProductQuantity(token(), data?.id, value).then((res) => {
      if (res) {
        if (res?.pendingQuantity === 0) {
          console.log(res);
          Swal.fire({
            icon: "success",
            title: res?.message,
            text: "Reloading the page in 1 secs...",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          }).then(() => {
            navigate(0);
          });
        } else if (res?.pendingQuantity !== 0) {
          Swal.fire({
            icon: "error",
            title: res?.message,
            text: `Remaining: ${res?.pendingQuantity}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(0);
            }
          });
        }
      }
    });
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit(handleUpdateChangeQuantity)}>
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
              {update ? (
                <div className="w-100 px-3">
                  <label htmlFor="quantity" className="text-muted">
                    Quantity {data?.quantity} (current)
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="0"
                    className="form-control"
                    {...register("quantity", {
                      required: "The quantity is required",
                      valueAsNumber: true,
                    })}
                  />
                  <p className="text-danger fw-bold">
                    {errors?.quantity && errors?.quantity?.message}
                  </p>
                </div>
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
            <Button className="btn btn-primary" type="submit">
              Update quantity
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default memo(ProductPreview);
