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

export const getProductAllAttribute = async (id) => {
  try {
    const { data } = await api.getProductAllAttribute(id);

    return data;
  } catch (error) {
    return;
  }
};

export const updateAttribute = async (token, id, formData) => {
  try {
    const { data } = await api.updateAttribute(token, id, formData);

    return data;
  } catch (error) {
    return;
  }
};

export const getAllFlatternCategory = async () => {
  try {
    const { data } = await api.getAllFlatternCategory();

    return data;
  } catch (error) {
    return;
  }
};

export const createCategory = async (token, formData) => {
  try {
    const { data } = await api.createCategory(token, formData);

    return data;
  } catch (error) {
    return;
  }
};

export const updateCategory = async (token, id, formData) => {
  try {
    const { data } = await api.updateCategory(token, id, formData);

    return data;
  } catch (error) {
    return;
  }
};
export const createSubCategory = async (token, id, formData) => {
  try {
    const { data } = await api.createSubCategory(token, id, formData);

    return data;
  } catch (error) {
    return;
  }
};

export const deleteCategory = async (token, id) => {
  try {
    const { data } = await api.deleteCategory(token, id);

    return data;
  } catch (error) {
    return;
  }
};

export const deleteSubCategory = async (token, id) => {
  try {
    const { data } = await api.deleteSubCategory(token, id);

    return data;
  } catch (error) {
    return;
  }
};
