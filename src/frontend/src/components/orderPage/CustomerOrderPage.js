import React, { useEffect, useState } from "react";

import { useAuth } from "../../hook/AuthHook.js";
import { getAllOrderByUser } from "../../action/order/order.js";

import Header from "../header/Header.js";
import CustomerOrderList from "./order/CustomerOrderList";

const CustomerOrderPage = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState();
  const [state, setState] = useState("pending");

  const handleSetState = (value) => {
    setState(value);
  };

  useEffect(() => {
    async function getTheOrdersOfUsers() {
      await getAllOrderByUser(token(), state).then((res) => {
        if (res) {
          setOrders(res);
        }
      });
    }
    getTheOrdersOfUsers();
    // eslint-disable-next-line
  }, [state]);
  return (
    <>
      <Header user={user}></Header>
      <div className="my-4 container d-flex flex-column justify-content-center align-items-center">
        <div className="col-12">
          <ul className="nav nav-pills nav-justified">
            <li className="nav-item">
              <button
                className={`nav-link ${state === "pending" && "active"}`}
                onClick={() => handleSetState("pending")}
              >
                On Pending
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${state === "accepted" && "active"}`}
                onClick={() => handleSetState("accepted")}
              >
                Accepted
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${state === "rejected" && "active"}`}
                onClick={() => handleSetState("rejected")}
              >
                Rejected
              </button>
            </li>
          </ul>
        </div>
        <CustomerOrderList data={orders}></CustomerOrderList>
      </div>
    </>
  );
};

export default CustomerOrderPage;
