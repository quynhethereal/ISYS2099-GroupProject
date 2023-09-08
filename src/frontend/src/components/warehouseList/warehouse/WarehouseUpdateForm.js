import React from "react";

import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateWarehouse } from "../../../action/warehouse/warehouse";
import { useAuth } from "../../../hook/AuthHook.js";
import Swal from "sweetalert2";

import FormInput from "../../../utils/FormInput.js";

const WarehouseUpdateForm = ({ show, handleClose, data }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name,
      province: data?.province,
      city: data?.city,
      district: data?.district,
      street: data?.street,
      number: data?.number,
      total_volume: data?.total_volume,
      available_volume: data?.available_volume,
    },
  });

  const handleSubmitData = async (e) => {
    await updateWarehouse(token(), data?.id, e).then((res) => {
      if (res?.message) {
        Swal.fire({
          icon: "success",
          title: res?.message,
          text: "The warehouse now has been updated. Reloading in 2 secs...",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          navigate(0);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res?.message,
        });
      }
    });
  };
  return (
    <Modal show={show} onHide={handleClose} className="p-2">
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">#{data?.id} Warehouse</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit(handleSubmitData)}>
          Update warehouse
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarehouseUpdateForm;
