import React from "react";
import Form from "react-bootstrap/Form";

const FormInput = ({
  inputName,
  inputLabel,
  inputPlaceHolder,
  inputType,
  inputFocus,
  register,
  errors,
  step,
}) => {
  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>{inputLabel}</Form.Label>
        <Form.Control
          type={inputType ? inputType : "text"}
          placeholder={inputPlaceHolder}
          autoFocus={inputFocus ? true : false}
          {...register(inputName, {
            required: `The ${inputName} is required`,
            valueAsNumber: inputType ? true : false,
          })}
          min="1"
          step={step && step}
        />
      </Form.Group>
      <p className="text-danger">
        {inputName in errors && errors[`${inputName}`]?.message}
      </p>
    </div>
  );
};

export default FormInput;
