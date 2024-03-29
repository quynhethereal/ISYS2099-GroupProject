import React, { useState } from "react";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { createCategory, createSubCategory } from "../action/category/category";
import { useAuth } from "../hook/AuthHook";

import { Modal, Button, Form } from "react-bootstrap";
import FormInput from "./FormInput.js";

const CategoryCreateForm = ({ data, show, handleClose }) => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      required: "",
      isOptional: "false",
      hasValue: "string",
    },
  });
  const navigate = useNavigate();
  const { token } = useAuth();

  const [require, setRequire] = useState([]);

  const handleAddAtr = () => {
    if (getValues("required") === "" || getValues("required").length === 0) {
      Swal.fire({
        title: "The name field is required for creating new attribute!",
        icon: "error",
      });
      return;
    }
    setRequire([
      ...require,
      {
        name: getValues("required"),
        required: getValues("isOptional") === "false" ? false : true,
        type: getValues("hasValue"),
      },
    ]);
    reset({ required: "" });
    // }
  };

  const handleRemoveAtr = (value) => {
    if (require.filter((item) => item.name === value.name).length > 0) {
      setRequire((prev) => prev?.filter((item) => item.name !== value.name));
    }
  };

  const handleSubmitData = async (e) => {
    if (require?.length === 0) {
      Swal.fire({
        title: "The attribute field must be at least one attribute!",
        icon: "error",
      });
      return;
    }
    const payload = {
      name: e.name,
      attributes: require,
    };
    if (data) {
      await createSubCategory(token(), data?.id, payload).then((res) => {
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Category create",
            text: "Reloading in 1 second...",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          }).then(() => {
            navigate(0);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Could not create new category",
          });
        }
      });
    } else {
      await createCategory(token(), payload).then((res) => {
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Category crated",
            text: "Reloading in 1 second...",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          }).then(() => {
            navigate(0);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Could not create new category",
          });
        }
      });
    }
  };
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">Create Category </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormInput
            inputName={"name"}
            inputLabel={"Category Name"}
            inputPlaceHolder={"House, Phone, etc"}
            register={register}
            errors={errors}
            autoFocus={true}
          ></FormInput>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Attribute</Form.Label>
              <div className="d-flex flex-row gap-2">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  {...register("required", {})}
                />
                <select
                  id="fromWarehouse"
                  className="form-select form-select-lg"
                  {...register("isOptional", {})}
                >
                  <option value={false}>False</option>
                  <option value={true}>True</option>
                </select>
                <select
                  id="fromWarehouse"
                  className="form-select form-select-lg"
                  {...register("hasValue", {})}
                >
                  <option value={"string"}>String</option>
                  <option value={"number"}>Number</option>
                </select>
                <Button variant="primary" onClick={() => handleAddAtr()}>
                  +
                </Button>
              </div>
            </Form.Group>
            <div className="d-flex flex-row flex-wrap gap-2">
              {require?.map((item, index) => {
                return (
                  <span
                    className="badge bg-info text-center pe-0 py-0"
                    key={index}
                  >
                    {item?.name} {item?.type}
                    <Button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => handleRemoveAtr(item)}
                    >
                      x
                    </Button>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="col-12">
            {require?.map((item, index) => {
              return (
                <div className="my-2" key={index}>
                  <b>Name</b>: {item?.name}, <b>Require</b>:
                  {item?.required ? "True" : "False"},
                  <span>
                    <b>Type</b>: {item?.type}
                  </span>
                </div>
              );
            })}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={handleSubmit(handleSubmitData)}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryCreateForm;
