import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { useAuth } from "../../hook/AuthHook.js";
import { useNavigate } from "react-router-dom";
import {
  getWarehouses,
  getWarehouseById,
  moveTheIventoryToWarehouse,
} from "../../action/warehouse/warehouse.js";

import WarehouseItem from "../warehouseList/warehouse/WarehouseItem.js";

const Inventory = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fromWarehouse: "",
      toWarehouse: "",
      productId: "",
      quantity: null,
    },
  });
  const [numberOfWarehouse, setNumberOfWarehouse] = useState();
  const [warehouseId, setWarehouseId] = useState({
    data: null,
    id: null,
  });
  const [context, setContext] = useState([]);
  const [data, setData] = useState({
    fromWarehouse: null,
    toWarehouse: null,
    fromWarehouseData: null,
    toWarehouseData: null,
  });
  const [fromWarehouseInventoryData, setFromWarehouseInventoryData] = useState(
    []
  );
  const [choosenProductQuantity, setChoosenProductQuantity] = useState();
  const { token } = useAuth();

  const handleForm = async (data) => {
    await moveTheIventoryToWarehouse(token(), data).then((res) => {
      if (res?.data) {
        Swal.fire({
          icon: "success",
          title: res?.data?.message,
          text: "Reloading in 2 secs...",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          navigate(0);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: `Oops...`,
          text: res,
        });
      }
    });
  };

  const handleFilterAvailableOptions = (elements) => {
    if (elements?.id === "toWarehouse") {
      setData({ ...data, toWarehouse: parseInt(elements?.value) });
    } else if (elements?.id === "fromWarehouse") {
      setData({ ...data, fromWarehouse: parseInt(elements?.value) });
    }
    setWarehouseId({
      data: elements?.id,
      id: elements?.value,
    });
  };

  const handleGetTotalQuantity = (e) => {
    setChoosenProductQuantity(
      fromWarehouseInventoryData?.inventory?.find(
        (product) => parseInt(product?.id) === parseInt(e.target.value)
      )?.quantity
    );
  };

  useEffect(() => {
    //change when the warehouse data is not available in useState
    async function getTheWarehouse() {
      await getWarehouseById(token(), warehouseId?.id).then((res) => {
        if (res) {
          if (warehouseId?.data === "toWarehouse") {
            setData({ ...data, toWarehouseData: res });
            setContext([...context, res]);
          } else if (warehouseId?.data === "fromWarehouse") {
            setData({ ...data, fromWarehouseData: res });
            setContext([...context, res]);
          }
        }
      });
    }
    if (
      warehouseId?.id &&
      context.filter(
        (warehouse) => parseInt(warehouse?.id) === parseInt(warehouseId?.id)
      ).length === 0
    ) {
      getTheWarehouse();
    } else {
      var existedData = context.filter(
        (warehouse) => parseInt(warehouse?.id) === parseInt(warehouseId?.id)
      );
      if (warehouseId?.id && existedData?.length === 1) {
        if (warehouseId?.data === "toWarehouse") {
          setData({ ...data, toWarehouseData: existedData[0] });
        } else if (warehouseId?.data === "fromWarehouse") {
          setData({ ...data, fromWarehouseData: existedData[0] });
        }
      }
    }
    // eslint-disable-next-line
  }, [warehouseId]);

  useEffect(() => {
    //get the first warehouse to calculte the total warehouse count
    async function getInitialData() {
      await getWarehouses(token(), 1, 1).then((res) => {
        if (res?.totalWarehouseCount) {
          var i = 0;
          var arrayId = [];
          while (++i <= res?.totalWarehouseCount) {
            arrayId.push(i);
          }
          setNumberOfWarehouse(arrayId);
        }
      });
    }
    getInitialData();
    // eslint-disable-next-line
  }, []);

  return (
    <form
      className="p-4 container d-flex flex-column"
      onSubmit={handleSubmit(handleForm)}
    >
      <div className="col-12 mb-4">
        <h3 className="text-primary text-center">Move inventory</h3>
      </div>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-center justify-content-lg-evenly align-items-center align-items-lg-start">
        <div className="col-12 col-lg-4 d-flex flex-column align-items-start justify-content-center justify-content-lg-start">
          <label htmlFor="fromWarehouse">From warehouse</label>
          <select
            id="fromWarehouse"
            type="number"
            className="form-select form-select-lg mb-3"
            {...register("fromWarehouse", {
              required: "From warehouse is required",
              valueAsNumber: true,
              onChange: (event) => handleFilterAvailableOptions(event.target),
            })}
          >
            <option value="" disabled>
              Start warehouse...
            </option>
            {numberOfWarehouse?.map((number) => {
              return (
                number !== data?.toWarehouse && (
                  <option value={parseInt(number)} key={number}>
                    Warehouse #{number}
                  </option>
                )
              );
            })}
          </select>
          {data?.fromWarehouse && (
            <WarehouseItem
              data={data?.fromWarehouseData}
              token={token}
              size={"col-12"}
              setWareHouseInventoryData={setFromWarehouseInventoryData}
            ></WarehouseItem>
          )}
          {errors?.fromWarehouse && (
            <p className="text-danger fw-bold">
              {errors?.fromWarehouse?.message}
            </p>
          )}
        </div>

        <div className="d-flex col-lg-3 flex-column justify-content-center align-items-center my-3">
          <div className="col-12 d-flex flex-column justify-content-start mb-3">
            {/* working */}
            <label htmlFor="productId">ProductID</label>
            <select
              id="productId"
              className="form-select form-select-lg mb-3"
              {...register("productId", {
                required: "To warehouse is required",
                valueAsNumber: true,
                onChange: (e) => handleGetTotalQuantity(e),
              })}
            >
              <option value="" disabled>
                Product ID...
              </option>
              {fromWarehouseInventoryData?.inventory?.map((product) => {
                return (
                  <option value={parseInt(product?.id)} key={product?.id}>
                    Product #{product?.id}: {product?.title}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-12 d-flex flex-column justify-content-start mb-3">
            <label htmlFor="quantity">
              Quantity{" "}
              {choosenProductQuantity && `Max: ${choosenProductQuantity}`}
            </label>
            <input
              id="quantity"
              className="form-control"
              type="number"
              {...register("quantity", {
                required: "ProductID is required",
                valueAsNumber: "This must be a number",
              })}
            />
            {errors?.quantity && (
              <p className="text-danger fw-bold">{errors?.quantity?.message}</p>
            )}
          </div>
          <div className="col-12 d-flex flex-row justify-content-center align-items-center mb-3">
            <button type="submit" className="btn btn-primary">
              Move product
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-4 d-flex flex-column align-items-start justify-content-center justify-content-lg-start5">
          <label htmlFor="toWarehouse">To warehouse</label>
          <select
            id="toWarehouse"
            className="form-select form-select-lg mb-3"
            {...register("toWarehouse", {
              required: "To warehouse is required",
              valueAsNumber: true,
              onChange: (event) => handleFilterAvailableOptions(event.target),
            })}
          >
            <option value="" disabled>
              Destination warehouse...
            </option>
            {numberOfWarehouse?.map((number) => {
              return (
                number !== data?.fromWarehouse && (
                  <option value={parseInt(number)} key={number}>
                    Warehouse #{number}
                  </option>
                )
              );
            })}
          </select>
          {data?.toWarehouse && (
            <WarehouseItem
              data={data?.toWarehouseData}
              token={token}
              size={"col-12"}
            ></WarehouseItem>
          )}
          {errors?.toWarehouse && (
            <p className="text-danger fw-bold">
              {errors?.toWarehouse?.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Inventory;
