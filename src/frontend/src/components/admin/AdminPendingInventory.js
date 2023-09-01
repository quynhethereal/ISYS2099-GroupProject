import React, { useEffect, useState } from "react";

import { useAuth } from "../../hook/AuthHook.js";
import { getPendingInventory } from "../../action/warehouse/warehouse.js";

const AdminPendingInventory = () => {
  const { token } = useAuth();
  const [params, setParams] = useState({
    limit: 5,
    currentPage: 1,
    totalPages: null,
  });

  const [resData, setResData] = useState([]);

  useEffect(() => {
    async function getData() {
      await getPendingInventory(
        token(),
        params?.limit,
        params?.currentPage
      ).then((res) => console.log(res));
    }

    if (params?.currentPage !== params?.totalPages || resData?.length === 0) {
      getData();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container p-4 d-flex flex-column justify-content-start align-items-center"></div>
  );
};

export default AdminPendingInventory;
