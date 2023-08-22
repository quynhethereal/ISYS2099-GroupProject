import React, { useEffect, useState } from "react";

import { useAuth } from "../../hook/AuthHook.js";
import { getAllOrderByUser } from "../../action/order/order.js";

import Header from "../header/Header.js";
import CustomerOrderList from "./order/CustomerOrderList";

const CustomerOrderPage = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState();

  useEffect(() => {
    async function getTheOrdersOfUsers() {
      await getAllOrderByUser(token()).then((res) => {
        if (res) {
          setOrders(res);
        }
      });
    }
    getTheOrdersOfUsers();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Header user={user}></Header>
      <CustomerOrderList data={orders}></CustomerOrderList>
    </>
  );
};

export default CustomerOrderPage;
