import React, { useState, useEffect } from "react";

import { useAuth } from "../../hook/AuthHook.js";
import {
  getWarehouses,
  getPendingInventory,
} from "../../action/warehouse/warehouse.js";

import WarehouseItem from "./warehouse/WarehouseItem.js";
import WarehouseCreateForm from "./warehouse/WarehouseCreateForm.js";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState();
  const [page, setPage] = useState(1);
  const [pendingParams, setPendingParams] = useState({
    limit: 5,
    currentPage: null,
    totalPages: null,
    data: null,
  });

  const [more, setMore] = useState(false);

  const { token } = useAuth();

  const handleNextPage = () => {
    if (page < warehouses.totalPages) {
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
    while (++i <= totalPage) rows.push(i);
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
      await getWarehouses(token(), 2, page).then((res) => {
        setWarehouses(res);
      });
    }
    getData();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    async function getPendingInventoryData() {
      await getPendingInventory(
        token(),
        pendingParams?.limit,
        pendingParams?.currentPage || 1
      ).then((res) => {
        if (res?.pendingInventory) {
          if (res?.pendingInventory?.length === 0) {
            setMore(true);
          } else {
            setPendingParams({
              ...pendingParams,
              currentPage: res?.currentPage + 1,
              totalPages: res?.totalPages,
              data: res?.pendingInventory,
            });
          }
        }
      });
    }
    if (
      !(pendingParams?.currentPage === pendingParams?.totalPages) ||
      !pendingParams?.data?.length
    ) {
      getPendingInventoryData();
    }
    if (pendingParams?.currentPage === pendingParams?.totalPages) {
      setMore(true);
    }
    // eslint-disable-next-line
  }, []);

  const handleGetMore = () => {
    setMore(false);
  };

  return (
    <div className="container p-4 d-flex flex-column justify-content-start align-items-center">
      <div className="row">
        <nav aria-label="pagination-warehouses">
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handlePreviousPage()}
              >
                Previous
              </button>
            </li>
            {returnNumberToArray(warehouses?.totalPages).map(
              (number, index) => {
                return (
                  <div key={index}>
                    {Number.isInteger(number) ? (
                      <li
                        className={`page-item ${page === number && "active"}`}
                        aria-current="page"
                      >
                        <button
                          className="page-link"
                          onClick={() => handleChangePage(number)}
                        >
                          {number}
                        </button>
                      </li>
                    ) : (
                      <li aria-current="page">
                        <button className="page-link" disabled>
                          {number}
                        </button>
                      </li>
                    )}
                  </div>
                );
              }
            )}
            <li className="page-item">
              <button className="page-link" onClick={() => handleNextPage()}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="row mb-md-4">
        <WarehouseCreateForm />
      </div>
      <div className="container d-flex flex-column flex-md-row justify-content-evenly align-items-start p-0 mb-md-4">
        {warehouses?.warehouses?.map((item, index) => {
          return <WarehouseItem key={index} data={item} token={token} />;
        })}
      </div>
      <div className="row">
        <div className="col-12 mb-4">
          <h3 className="text-primary text-center">Pending Inventory</h3>
        </div>
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <div className="my-4 d-flex flex-wrap flex-row justify-content-center align-items-center">
            {pendingParams?.data?.map((item, index) => {
              return (
                <div className="card" style={{ width: "16rem" }} key={index}>
                  <div className="card-img-top text-center">
                    <img
                      src={item?.image}
                      alt={item?.image ? item?.image : item?.title}
                      style={{ width: 200, height: 200 }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title text-wrap">{item?.title}</h5>
                    <div className="card-text ">
                      <p className="fw-bolder overflow-hidden text-wrap">
                        Inventory ID : #{item?.inventory_id}
                      </p>
                      <p className="fw-bolder overflow-hidden text-wrap">
                        Quantity : {item?.quantity}
                      </p>
                      <p className="text-wrap">
                        {formatDate(item?.inventory_created_date)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!more && (
            <button
              type="button"
              className="col-12 btn btn-primary"
              onClick={() => handleGetMore()}
            >
              More ...
            </button>
          )}
          {!pendingParams?.data && (
            <div className="fw-bold fw-3">None of pending inventories</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseList;
