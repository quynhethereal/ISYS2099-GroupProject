import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../../action/auth.js";

import background from "../../assets/image/background.webp";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleForm = (value) => {
    console.log(value);
    login(value);
  };
  return (
    <>
      <div
        className="container-fluid d-flex flex-column-reverse flex-md-row"
        style={{ height: "100vh" }}
      >
        <div className="h-100 col-12 col-md-6 d-flex justify-content-center align-items-center">
          <div className="d-flex flex-column col-10 col-md-7">
            <h1 className="my-2">Welcome Back</h1>
            <p className="my-2 text-muted">Hi! We a lazada 2.0</p>
            <form onSubmit={handleSubmit(handleForm)}>
              <label htmlFor="email" className="my-1">
                Email
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  aria-describedby="basic-addon3"
                  placeholder="Enter email"
                  {...register("username", {
                    required: "The email is required",
                  })}
                />
              </div>
              {errors?.username && (
                <p className="font-weight-bold" style={{ color: "#b00020" }}>
                  {errors?.username?.message}
                </p>
              )}
              <label htmlFor="password" className="my-2">
                Password
              </label>
              <div className="input-group mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  aria-describedby="basic-addon3"
                  placeholder="Enter password"
                  {...register("password", {
                    required: "The password is required",
                  })}
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="input-group-text"
                    id="basic-addon2"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="24"
                        height="24"
                      >
                        <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path d="M8.052 5.837A9.715 9.715 0 0 1 12 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.11.11 0 0 1 .016.055.122.122 0 0 1-.017.06 16.766 16.766 0 0 1-1.53 2.218.75.75 0 1 0 1.163.946 18.253 18.253 0 0 0 1.67-2.42 1.607 1.607 0 0 0 .001-1.602c-.485-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5c-1.695 0-3.215.374-4.552.963a.75.75 0 0 0 .604 1.373Zm11.114 12.15C17.328 19.38 14.933 20.5 12 20.5c-3.432 0-6.125-1.534-8.054-3.24C2.02 15.556.814 13.648.33 12.798a1.606 1.606 0 0 1 .001-1.6A18.283 18.283 0 0 1 3.648 7.01L1.317 5.362a.75.75 0 1 1 .866-1.224l20.5 14.5a.75.75 0 1 1-.866 1.224ZM4.902 7.898c-1.73 1.541-2.828 3.273-3.268 4.044a.112.112 0 0 0-.017.059c0 .015.003.034.016.055.441.774 1.551 2.527 3.307 4.08C6.69 17.685 9.045 19 12 19c2.334 0 4.29-.82 5.874-1.927l-3.516-2.487a3.5 3.5 0 0 1-5.583-3.949L4.902 7.899Z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {errors?.password && (
                <p className="font-weight-bold" style={{ color: "#b00020" }}>
                  {errors?.password?.message}
                </p>
              )}
              <div className="w-100 d-flex justify-content-end">
                <p className="mb-4">Forgot password</p>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{ background: "#5D3FD3" }}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
        <div className="h-100 col-10 col-md-6 d-flex justify-content-center align-items-center">
          <img src={background} className="img-fluid" alt="background" />
        </div>
      </div>
    </>
  );
};

export default Login;
