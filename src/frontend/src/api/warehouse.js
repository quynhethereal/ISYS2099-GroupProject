import axios from "axios";

const backend_url = "http://localhost:4000";

export const getWarehouses = (token, limit, currentPage) =>
  axios.get(
    `${backend_url}/api/warehouses?limit=${limit}&currentPage=${currentPage}`,
    {
      headers: { "x-access-token": token },
    }
  );

export const getInventoryByWarehouseId = (token, id, limit, currentPage) =>
  axios.get(
    `${backend_url}/api/warehouses/${id}/inventory?limit=${limit}&currentPage=${currentPage}`,
    {
      headers: { "x-access-token": token },
    }
  );
