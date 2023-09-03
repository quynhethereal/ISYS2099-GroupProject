import React, { useState, useEffect, memo } from "react";

import { getInventoryByWarehouseId } from "../../../action/warehouse/warehouse.js";

import WarehouseInventory from "./WarehouseInventory.js";

const WarehouseItem = ({ data, token, size, setWareHouseInventoryData }) => {
  const [inventory, setInventory] = useState();
  const [page, setPage] = useState(1);

  const handleNextPage = () => {
    if (page < inventory?.totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleChangePage = (number) => {
    setPage(number);
  };

  function returnNumberToArray(totalPage) {
    var rows = [];
    var i = 0;
    if (totalPage < 3) {
      while (++i <= totalPage) rows.push(i);
      return rows;
    }
    if (totalPage - page >= 3) {
      i = page - 1;
      while (++i <= page + 1) rows.push(i);
      rows.push("...");
      rows.push(totalPage);
    } else {
      i = totalPage - 3;
      while (++i <= totalPage - 1) rows.push(i);
      rows.push("...");
      rows.push(totalPage);
    }
    return rows;
  }

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    async function getData() {
      await getInventoryByWarehouseId(token(), data?.id, 5, page).then(
        (res) => {
          setInventory(res);

          if (setWareHouseInventoryData) {
            setWareHouseInventoryData(res);
          }
        }
      );
    }
    if (data?.id) {
      getData();
    }
    // eslint-disable-next-line
  }, [page, data]);

  const handleDeleteWarehouse = async (data) => {
    console.log(data?.id);
  };

  return (
    <div
      className={`col-12 ${
        size ? size : "col-md-5"
      } my-3 my-md-0 d-flex flex-column justify-content-center align-items-center`}
    >
      <div className="card w-100">
        <div className="card-body">
          <div className="card-title d-flex flex-row">
            <div className="fs-4 fw-bolder">#{data?.id}</div>
            <div className="mx-auto fs-4 fw-bolder">{data?.name}</div>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteWarehouse(data)}
            >
              Delete
            </button>
          </div>
          <hr />
          <div className="card-text d-flex- flex-column">
            <div className="col-12">
              <label htmlFor="city" className="text-muted">
                City:
              </label>
              <div
                id="city"
                className="mt-2 rounded"
                style={{ background: "#f0f0f0" }}
              >
                <p className="bold px-2 py-1 ">{data?.city}</p>
              </div>
            </div>
            <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-start">
              <div className="col-12 col-lg-7">
                <label htmlFor="address" className="text-muted">
                  Address
                </label>
                <div
                  id="address"
                  className="mt-2 rounded"
                  style={{ background: "#f0f0f0" }}
                >
                  <p className="bold px-2 py-1 ">
                    {data?.province}, {data?.district}, {data?.street}
                  </p>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <label htmlFor="number" className="text-muted">
                  Number
                </label>
                <div
                  id="number"
                  className="mt-2 rounded"
                  style={{ background: "#f0f0f0" }}
                >
                  <p className="bold px-2 py-1 ">{data?.number}</p>
                </div>
              </div>
            </div>
            <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-start">
              <div className="col-12 col-lg-5">
                <label htmlFor="total-volume" className="text-muted">
                  Total Volume
                </label>
                <div
                  id="total-volume"
                  className="mt-2 rounded"
                  style={{ background: "#f0f0f0" }}
                >
                  <p className="bold px-2 py-1 ">{data?.total_volume}</p>
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <label htmlFor="number" className="text-muted">
                  Available Volume
                </label>
                <div
                  id="number"
                  className="mt-2 rounded"
                  style={{ background: "#f0f0f0" }}
                >
                  <p className="bold px-2 py-1 ">{data?.available_volume}</p>
                </div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="create-at" className="text-muted">
                Created At:
              </label>
              <div
                id="create-at"
                className="mt-2 rounded"
                style={{ background: "#f0f0f0" }}
              >
                <p className="bold px-2 py-1 ">
                  {formatDate(data?.created_at)}
                </p>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="create-at" className="text-muted">
                Updated At:
              </label>
              <div
                id="create-at"
                className="mt-2 rounded"
                style={{ background: "#f0f0f0" }}
              >
                <p className="bold px-2 py-1 ">
                  {formatDate(data?.updated_at)}
                </p>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-center">
              <nav aria-label="pagination-inventory">
                <ul className="pagination pagination-sm">
                  <li className="page-item">
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => handlePreviousPage()}
                    >
                      {"<"}
                    </button>
                  </li>
                  {returnNumberToArray(inventory?.totalPages).map(
                    (number, index) => {
                      return (
                        <div key={index}>
                          {Number.isInteger(number) ? (
                            <li
                              className={`page-item ${
                                page === number && "active"
                              }`}
                              aria-current="page"
                            >
                              <button
                                type="button"
                                className="page-link"
                                onClick={() => handleChangePage(number)}
                              >
                                {number}
                              </button>
                            </li>
                          ) : (
                            <li aria-current="page">
                              <button
                                className="page-link"
                                disabled
                                type="button"
                              >
                                {number}
                              </button>
                            </li>
                          )}
                        </div>
                      );
                    }
                  )}
                  <li className="page-item">
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => handleNextPage()}
                    >
                      {">"}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-12 p-2">
              <WarehouseInventory data={inventory?.inventory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WarehouseItem);
