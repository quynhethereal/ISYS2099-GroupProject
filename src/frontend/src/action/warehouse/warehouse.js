import * as api from "../../api/warehouse.js";

export const getWarehouses = async (token, limit, currentPage) => {
  try {
    const { data } = await api.getWarehouses(token, limit, currentPage);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getInventoryByWarehouseId = async (
  token,
  id,
  limit,
  currentPage
) => {
  try {
    const { data } = await api.getInventoryByWarehouseId(
      token,
      id,
      limit,
      currentPage
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const createWarehouse = async (token, data) => {
  try {
    const res = await api.createWarehouse(token, data);

    if (res.status === 200) {
      return res;
    } else {
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
};
