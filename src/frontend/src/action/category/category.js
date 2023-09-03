import * as api from "../../api/category.js";

export const getAllCategory = async () => {
  try {
    const { data } = await api.getAllCategory();

    return data;
  } catch (error) {
    return;
  }
};

export const getCategoryByID = async (id) => {
  try {
    const { data } = await api.getCategoryByID(id);

    return data;
  } catch (error) {
    return;
  }
};

export const getAllAttribute = async (id) => {
  try {
    const { data } = await api.getAllAttribute(id);

    return data;
  } catch (error) {
    return;
  }
};
