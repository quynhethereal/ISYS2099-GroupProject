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

export const createWarehouse = (token, data) =>
  axios.post(`${backend_url}/api/warehouses`, data, {
    headers: { "x-access-token": token },
  });

export const getWarehouseById = (token, id) =>
  axios.get(`${backend_url}/api/warehouses/${id}`, {
    headers: { "x-access-token": token },
  });
export const moveTheIventoryToWarehouse = (token, data) =>
  axios.post(`${backend_url}/api/inventories/move`, data, {
    headers: { "x-access-token": token },
  });
