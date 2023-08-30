import React, { memo, useState } from "react";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
// import { updateProduct } from "../action/product/product.js";
// import { useAuth } from "../hook/AuthHook.js";
// import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormInput from "./FormInput.js";

const ProductUpdateForm = ({ data, show, handleClose }) => {
  // const { token } = useAuth();
  // const navigate = useNavigate();
  const [imageSoure, setImageSoure] = useState();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: data?.title,
      description: data?.description,
      price: data?.price,
      image: data?.image,
    },
  });

  const handleFetchImageSoure = async (imgUrl) => {
    const checkImage = (path) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ path, status: "ok" });
        img.onerror = () => resolve({ path, status: "error" });

        img.src = path;
      });
    await checkImage(imgUrl).then((res) => {
      if (res?.status === "ok") {
        setImageSoure("ok");
        setValue("image", imgUrl);
      } else {
        setImageSoure("error");
      }
    });
  };

  const handleUpdateProduct = async (value) => {
    if (imageSoure === "error") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide valid image URLs!",
      });
      return;
    }
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit(handleUpdateProduct)}>
        <Modal.Header closeButton>
          <Modal.Title className="ms-auto">#{data?.id} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 d-flex flex-column justify-content-center align-items-center">
            <div className="col-12">
              <div className="mb-4 d-flex justify-content-center align-items-center">
                <img
                  src={getValues("image")}
                  alt="product"
                  width="200px"
                  height="200px"
                />
              </div>
              <div className="d-flex flex-column justify-content-center">
                <div>
                  <label htmlFor="image-input">
                    <p className="mb-2">Image URLs</p>
                  </label>
                  <input
                    type="text"
                    className="w-100 form-control"
                    id="image-input"
                    placeholder="Enter valid image URLS"
                    {...register("image", {
                      required: "The image is required as web url",
                    })}
                    onChange={(e) => handleFetchImageSoure(e.target.value)}
                  />
                  <p className="text-danger text-center">
                    {errors?.image && errors?.image?.message}
                  </p>
                </div>
                <FormInput
                  inputName={"title"}
                  inputLabel={"Product Title"}
                  inputPlaceHolder={"Ennter title of product"}
                  register={register}
                  errors={errors}
                ></FormInput>
                <FormInput
                  inputName={"description"}
                  inputLabel={"Product Description"}
                  inputPlaceHolder={"Ennter description of product"}
                  register={register}
                  errors={errors}
                ></FormInput>
                <FormInput
                  inputName={"price"}
                  inputLabel={"Product Price"}
                  inputPlaceHolder={"Ennter new price of product"}
                  register={register}
                  inputType={"number"}
                  errors={errors}
                  step={"0.01"}
                ></FormInput>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="primary" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button className="btn btn-primary" type="submit">
            Update Product
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default memo(ProductUpdateForm);
