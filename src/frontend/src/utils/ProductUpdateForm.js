import React, { useState, useEffect } from "react";

import Swal from "sweetalert2";
import { useForm, useFieldArray } from "react-hook-form";
import { updateProduct } from "../action/product/product.js";
import {
  getAllFlatternCategory,
  getCategoryByID,
  updateAttribute,
} from "../action/category/category.js";
import { useAuth } from "../hook/AuthHook.js";
import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormInput from "./FormInput.js";

const ProductUpdateForm = ({ data, show, handleClose }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [imageSoure, setImageSoure] = useState();
  const [allCategory, setAllCategory] = useState([]);
  const [currentChoice, setCurrentChoice] = useState();
  const [currentCategoryData, setCurrentCategoryData] = useState([]);
  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: data?.category_id,
      title: data?.title,
      description: data?.description,
      price: data?.price,
      image: data?.image,
      attributes: [{}],
    },
  });

  console.log(data?.category_id);

  useFieldArray({
    control,
    name: "attributes",
  });

  useEffect(() => {
    async function getAllCategoryData() {
      await getAllFlatternCategory().then((res) => {
        setAllCategory(res);
      });
    }
    getAllCategoryData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function getCurrentCategory() {
      await getCategoryByID(currentChoice || data?.category_id).then((res) => {
        if (res) {
          setValue("attributes", res?.attributes);
          setCurrentCategoryData(res);
        }
      });
    }
    getCurrentCategory();
    // eslint-disable-next-line
  }, [currentChoice, data]);

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
    var attributesPayload = [];
    value?.attributes?.forEach((element) => {
      let object = {
        name: element?.name,
        required: element?.required,
        value: {
          description: element?.description,
          type: element?.type,
        },
      };
      attributesPayload.push(object);
    });

    if (imageSoure === "error" && imageSoure) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide valid image URLs!",
      });
      return;
    }
    delete value.attributes;
    await updateProduct(token(), data?.id, value).then(async (res) => {
      if (res) {
        Swal.fire({
          icon: "success",
          title: res?.message,
          text: "The product info has been updated. Waiting for category to be updated...",
          showConfirmButton: false,
          timer: 2000,
        }).then(async () => {
          console.log(res?.product?.category);
          await updateAttribute(
            token(),
            res?.product?.category,
            attributesPayload
          ).then((res) => {
            console.log(res);
            if (res) {
              Swal.fire({
                icon: "success",
                title: res?.message,
                text: "The product category has been changed. Reloading in 2 secs...",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              }).then(() => {
                // navigate(0);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Some error happened! Cannot update the product category. Reloading in 2 secs...",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              }).then(() => {
                // navigate(0);
              });
            }
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Some error happened! Cannot update the product info",
        });
      }
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
                <div className="col-12 d-flex flex-column justtify-content-center align-items-center mt-md-3 gap-3">
                  <div className="col-12">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      type="number"
                      value={currentChoice || getValues("category")}
                      className="form-select form-select-lg w-100"
                      {...register("category", {
                        valueAsNumber: true,
                      })}
                      onChange={(e) =>
                        setCurrentChoice((prev) => e.target.value)
                      }
                    >
                      {allCategory?.map((category, index) => {
                        return (
                          <option value={category?.id} key={index}>
                            {category?.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <label htmlFor="atr" className="fw-bolder fs-4">
                      Add-ons Attributes
                    </label>
                    <div
                      className="col-12 d-flex flex-row flex-wrap gap-2"
                      id="atr"
                    >
                      {currentCategoryData &&
                        currentCategoryData?.attributes?.map((item, index) => {
                          return (
                            <Form.Group className="mb-3" key={index}>
                              <Form.Label className="form-label">
                                {item?.name}{" "}
                                {item?.required ? (
                                  <b> (Required)</b>
                                ) : (
                                  <b> (Not Required)</b>
                                )}
                              </Form.Label>
                              <Form.Control
                                className="form-control"
                                type={item?.value?.type}
                                {...register(
                                  `attributes.${index}.description`,
                                  {
                                    required: item?.required,
                                  }
                                )}
                              />
                            </Form.Group>
                          );
                        })}
                    </div>
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

export default ProductUpdateForm;
