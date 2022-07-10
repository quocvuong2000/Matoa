import { callAPIWithToken } from "../../services/jwt-axios";

export const addNewCategory = async (categoryInfo) => {
  const res = await callAPIWithToken.post("/api/category/", {
    category: categoryInfo,
  });
  if (res && res.status !== 200)
    throw Error("Something wrongs with code status" + res.status);
  return res.data;
};

export const getCategoryList = async (page) => {
  const res = await callAPIWithToken({
    url: `/api/category/`,
    params: { page: page },
    method: "GET",
  });
  if (res && res.status !== 200)
    throw Error("Something wrongs with code status" + res.status);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await callAPIWithToken.delete(`/api/category/${id}`);
  if (res && res.status !== 200)
    throw Error("Something wrongs with code status" + res.status);
  return res.data;
};

export const updateCategory = async (id, category) => {
  const res = await callAPIWithToken.patch(`/api/category/${id}`, {
    category: category,
  });
  if (res && res.status !== 200)
    throw Error("Something wrongs with code status" + res.status);
  return res.data;
};
