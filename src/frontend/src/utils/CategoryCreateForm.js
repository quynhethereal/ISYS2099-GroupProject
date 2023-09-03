import React, { useState } from "react";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { createCategory } from "../action/category/category";
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
      required: [],
      optional: [],
    },
  });
  const navigate = useNavigate();
  const { token } = useAuth();

  const [require, setRequire] = useState([]);
  const [optional, setOptional] = useState([]);

  const handleAddRequire = () => {
    if (!require?.includes(getValues("required"))) {
      setRequire([...require, getValues("required")]);
      reset({ required: [] });
    }
  };

  const handleAddOptional = () => {
    if (!optional?.includes(getValues("optional"))) {
      setOptional([...optional, getValues("optional")]);
      reset({ optional: [] });
    }
  };

  const handleRemoveRequire = (value) => {
    if (require?.includes(value)) {
      setRequire((prev) => prev?.filter((item) => item !== value));
    }
  };
  const handleRemoveOptional = (value) => {
    if (optional?.includes(value)) {
      setOptional((prev) => prev?.filter((item) => item === value));
    }
  };

  const handleSubmitData = async (e) => {
    if (require?.length === 0) {
      Swal.fire({
        title: "The require field must be at least one attribute name!",
        icon: "error",
      });
      return;
    }
    const payload = {
      name: e.name,
      attributes: [
        {
          required: require,
          optional: optional,
        },
      ],
    };
    console.log(payload);
    await createCategory(token(), payload).then((res) => {
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Accepted the order",
          text: "The order is now moved to the inventory warehouse for shipping...",
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
          text: "Server error! Try again",
        });
      }
    });
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
              <Form.Label>Required</Form.Label>
              <div className="d-flex flex-row">
                <Form.Control
                  type="text"
                  placeholder="Required attribute"
                  {...register("required", {})}
                />
                <Button variant="primary" onClick={() => handleAddRequire()}>
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
                    {item}
                    <Button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => handleRemoveRequire(item)}
                    >
                      x
                    </Button>
                  </span>
                );
              })}
            </div>
            <p className="text-danger">
              {errors?.require && errors?.require?.message}
            </p>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Optional</Form.Label>
              <div className="d-flex flex-row">
                <Form.Control
                  type="text"
                  placeholder="Required attribute"
                  {...register("optional", {})}
                />
                <Button variant="primary" onClick={() => handleAddOptional()}>
                  +
                </Button>
              </div>
            </Form.Group>
            <p className="text-danger">
              {errors?.require && errors?.require?.message}
            </p>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleClose()}>
          Ok
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
