import { api } from "@/api";

export const getUserInfo = (userId: string) =>
  api.get(`/api/admin/user/${userId}`);
