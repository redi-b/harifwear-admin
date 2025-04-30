import { api } from "@/api";

export const getProductById = (id: string | number) =>
  api.get(`/api/products/${id}`);
