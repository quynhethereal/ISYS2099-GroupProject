import React, { memo, useState } from "react";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { updateProduct } from "../action/product/product.js";
import { useAuth } from "../hook/AuthHook.js";
import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormInput from "./FormInput.js";

var testData = [
  {
    _id: "64e234d2e360f233a9c99ad5",
    id: 1,
    name: "Clothing and Accessories",
    attributes: ["Entertaining", "Music", "Electrical"],
    parent: 2,
    __v: 0,
  },
  {
    _id: "64e234d2e360f233a9c99ad6",
    id: 2,
    name: "Electronics and Gadgets",
    attributes: [],
    __v: 0,
  },
  {
    _id: "64e234d2e360f233a9c99ad7",
    id: 3,
    name: "Home and Kitchen Appliances",
    attributes: [],
    parent: 1,
    __v: 0,
  },
  {
    _id: "64e234d2e360f233a9c99ad8",
    id: 4,
    name: "Beauty and Personal Care",
    attributes: [],
    __v: 0,
  },
  {
    _id: "64e234d2e360f233a9c99ad9",
    id: 5,
    name: "Books, Music, and Movies",
    attributes: [],
    __v: 0,
  },
  {
    _id: "64e23ac7a11f741d717017e0",
    id: 21,
    name: "Instruments",
    attributes: ["Entertaining", "Music"],
    parent: 5,
    __v: 0,
  },
];

const ProductUpdateForm = ({ data, show, handleClose }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [imageSoure, setImageSoure] = useState();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
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
  // token, id, title, description, price, category, image;

  const handleUpdateProduct = async (value) => {
    if (imageSoure === "error") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide valid image URLs!",
      });
      return;
    }
    console.log(value);
    await updateProduct(token(), data?.id, value).then((res) => {
      console.log(res);
    });
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
                <div className="col-12 col-md-6 d-flex justtify-content-center align-items-center mt-md-3">
                  <div className="col-12">
                    <select
                      id="category"
                      type="number"
                      className="form-select form-select-lg"
                      {...register("category", {
                        valueAsNumber: true,
                      })}
                    >
                      <option value={data?.category_id} disabled>
                        {data?.category_name && "Going to get api"}
                      </option>
                      {testData?.map((category, index) => {
                        return (
                          <option value={category?.id} key={index}>
                            {category?.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
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
