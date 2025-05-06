import { api } from "@/api";
import { OrderStatus } from "@/types/order";

// -------------------------------
// Normal Orders
// -------------------------------

export const getAllOrders = () => api.get("/api/admin/order");

export const updateOrderStatus = (orderId: string, status: OrderStatus) =>
  api.patch(`/api/admin/order/${orderId}`, { status });

export const deleteOrder = (orderId: string) =>
  api.delete(`/api/admin/order/${orderId}`);

// -------------------------------
// Custom Orders
// -------------------------------

export const getAllCustomOrders = () => api.get("/api/admin/order/custom");

export const updateCustomOrderStatus = (
  customOrderId: string,
  status: OrderStatus
) => api.patch(`/api/admin/order/custom/${customOrderId}`, { status });

export const deleteCustomOrder = (customOrderId: string) =>
  api.delete(`/api/admin/order/custom/${customOrderId}`);

// -------------------------------
// Single Order
// -------------------------------

export const getOrderById = (orderId: string) =>
  api.get(`/api/admin/order/${orderId}`);

export const getCustomOrderById = (customOrderId: string) =>
  api.get(`/api/admin/order/custom/${customOrderId}`);
