import React from "react";

import Order from "./Order";

const CustomerOrderList = ({ data }) => {
  return (
    <>
      <div className="my-4 container d-flex flex-column justify-content-center align-items-center">
        {data?.map((item, key) => {
          return (
            <div className="col-12 mx-e" key={key}>
              <Order data={item}></Order>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CustomerOrderList;
