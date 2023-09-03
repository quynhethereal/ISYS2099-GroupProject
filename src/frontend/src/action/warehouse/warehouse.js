import * as api from "../../api/warehouse.js";

export const getWarehouses = async (token, limit, currentPage) => {
  try {
    const { data } = await api.getWarehouses(token, limit, currentPage);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};
export const getWarehouseById = async (token, id) => {
  try {
    const res = await api.getWarehouseById(token, id);

    if (res.status === 200) {
      const { data } = res;
      return data;
    } else {
      return;
    }
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

export const deleteWarehouse = async (token, id) => {
  try {
    const res = await api.deleteWarehouse(token, id);

    if (res.status === 200) {
      const { data } = res;
      return data;
    }
  } catch (error) {
    const { response } = error;
    return response?.data?.message;
  }
};

export const moveTheIventoryToWarehouse = async (token, data) => {
  try {
    const res = await api.moveTheIventoryToWarehouse(token, data);
    if (res.status === 200) {
      return res;
    } else {
      return;
    }
  } catch (error) {
    return error?.response?.data?.message;
  }
};

export const getPendingInventory = async (token, limit, currentPage) => {
  try {
    const res = await api.getPendingInventory(token, limit, currentPage);
    if (res.status === 200) {
      const { data } = res;
      return data;
    } else {
      return;
    }
  } catch (error) {
    return error?.response?.data?.message;
  }
};
