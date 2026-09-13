import api from "./api";

export const fetchProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const fetchProductById = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};
