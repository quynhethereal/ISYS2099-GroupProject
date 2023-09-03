import React from "react";

import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hook/AuthHook.js";
import Swal from "sweetalert2";

import FormInput from "../../../utils/FormInput.js";

const WarehouseUpdateForm = ({ show, handleClose, data }) => {
  const { token } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      province: "",
      city: "",
      district: "",
      street: "",
      number: "",
      total_volume: 0,
      available_volume: 0,
    },
  });

  const handleSubmitData = async (data) => {
    // await createWarehouse(token(), data).then((res) => {
    //   if (res) {
    //     Swal.fire({
    //       title: "Warehouse created successfully!",
    //       icon: "success",
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         reset();
    //         navigate(0);
    //       }
    //     });
    //   }
    // });
  };
  return (
    <Modal show={show} onHide={handleClose} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">#{data?.id} Warehouse</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center align-items-center"></div>
      </Modal.Body>
      <Form>
        <FormInput
          inputName={"name"}
          inputLabel={"Warehouse name"}
          inputPlaceHolder={"Warehouse A,B,C"}
          inputFocus={true}
          register={register}
          errors={errors}
        ></FormInput>
        <FormInput
          inputName={"province"}
          inputLabel={"Warehouse province"}
          inputPlaceHolder={"New York,etc"}
          register={register}
          errors={errors}
        ></FormInput>
        <div className="d-flex flex-col flex-md-row justify-content-between">
          <FormInput
            inputName={"city"}
            inputLabel={"Warehouse city"}
            inputPlaceHolder={"City X, Y, Z"}
            register={register}
            errors={errors}
          ></FormInput>
          <FormInput
            inputName={"district"}
            inputLabel={"Warehouse district"}
            inputPlaceHolder={"Midtown, etc"}
            register={register}
            errors={errors}
          ></FormInput>
        </div>
        <div className="d-flex flex-col flex-md-row justify-content-between">
          <FormInput
            inputName={"street"}
            inputLabel={"Warehouse street"}
            inputPlaceHolder={"Boardway, etc"}
            register={register}
            errors={errors}
          ></FormInput>
          <FormInput
            inputName={"number"}
            inputLabel={"Warehouse number"}
            inputPlaceHolder={"465, 123, 134, etc"}
            register={register}
            errors={errors}
          ></FormInput>
        </div>
        <FormInput
          inputName={"total_volume"}
          inputLabel={"Warehouse total volume"}
          inputType={"number"}
          inputPlaceHolder={"The total warehouse capacity"}
          register={register}
          errors={errors}
        ></FormInput>
        <FormInput
          inputName={"available_volume"}
          inputLabel={"Warehouse available volume"}
          inputType={"number"}
          inputPlaceHolder={"The available capacity"}
          register={register}
          errors={errors}
        ></FormInput>
      </Form>
      <Modal.Footer>
        <Button
          className="w-100"
          variant="primary"
          onClick={() => handleClose()}
        >
          Cancel
          <Button variant="primary" onClick={handleSubmit(handleSubmitData)}>
            Update warehouse
          </Button>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarehouseUpdateForm;
