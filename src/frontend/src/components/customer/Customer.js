import React from "react";
import { useAuth } from "../../hook/AuthHook.js";

const Customer = () => {
  const { user } = useAuth();
  // console.log(user);
  return <div>Customer page</div>;
};

export default Customer;
