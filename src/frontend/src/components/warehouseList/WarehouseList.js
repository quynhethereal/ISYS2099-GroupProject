import React, { useState, useEffect } from "react";

import { useAuth } from "../../hook/AuthHook.js";
import { getWarehouses } from "../../action/warehouse/warehouse.js";

import WarehouseItem from "./warehouse/WarehouseItem.js";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState();
  const [page, setPage] = useState(1);

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
    var rows = [],
      i = 0;
    while (++i <= totalPage) rows.push(i);
    return rows;
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
            {returnNumberToArray(warehouses?.totalPages).map((number) => {
              return (
                <li
                  className={`page-item ${page === number && "active"}`}
                  aria-current="page"
                  key={number}
                >
                  <button
                    className="page-link"
                    onClick={() => handleChangePage(number)}
                  >
                    {number}
                  </button>
                </li>
              );
            })}
            <li className="page-item">
              <button className="page-link" onClick={() => handleNextPage()}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container d-flex flex-column flex-md-row justify-content-evenly align-items-center p-0">
        {warehouses?.warehouses?.map((item, index) => {
          return <WarehouseItem key={index} data={item} token={token} />;
        })}
      </div>
    </div>
  );
};

export default WarehouseList;
