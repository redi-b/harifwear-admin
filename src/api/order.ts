import { api } from "@/api";
import { Order } from "@/libs/Interface";

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

// -------------------------------
// Normal Orders
// -------------------------------

/*  export const getAllOrders = () => api.get("/api/admin/order");  */
export const getAllOrders:Order[] = [
  {
    id: 1,
    name: 'John Doe',
    address: '123 Main St, Springfield',
    phone: '123-456-7890',
    products: [
      {
        id: 101,
        name: 'T-Shirt',
        photo: 'https://via.placeholder.com/100',
        size: 'M',
        color: 'Red',
        description: 'the color should be red',
        price: 20,
        quantity: 2,
      },
      {
        id: 102,
        name: 'Jeans',
        photo: 'https://via.placeholder.com/100',
        size: '32',
        color: 'Blue',
        description: 'the color should be red',
        price: 40,
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    address: '456 Elm St, Metropolis',
    phone: '987-654-3210',
    products: [
      {
        id: 103,
        name: 'dsjfklasdjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjddddddddddddddiewwwwwwwwwwwwwwwwwwwwwwwwwwww',
        photo: 'https://via.placeholder.com/100',
        size: 'L',
        color: 'Black',
        description: 'the color should be red',
        price: 60,
        quantity: 1,
      },
    ],
  },
];


export const updateOrderStatus = (orderId: string, status: OrderStatus) =>
  api.patch(`/api/admin/order/${orderId}`, { status });

console.log( updateOrderStatus("1","shipped") );
export const deleteOrder = (orderId: string) =>
  api.delete(`/api/admin/order/${orderId}`);

// -------------------------------
// Custom Orders
// -------------------------------

//export const getAllCustomOrders = () => api.get("/api/admin/order/custom");
export const getAllCustomOrders:Order[] = [
  {
    id: 1,
    name: 'John Doe',
    address: '123 Main St, Springfield',
    phone: '123-456-7890',
    products: [
      {
        id: 102,
        name: 'Jeans',
        photo: 'https://via.placeholder.com/100',
        size: '32',
        color: 'Blue',
        description: 'the color should be red',
        price: 40,
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    address: '456 Elm St, Metropolis',
    phone: '987-654-3210',
    products: [
      {
        id: 103,
        name: 'dsjfklasdjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjddddddddddddddiewwwwwwwwwwwwwwwwwwwwwwwwwwww',
        photo: 'https://via.placeholder.com/100',
        size: 'L',
        color: 'Black',
        description: 'the color should be red',
        price: 60,
        quantity: 1,
      },
    ],
  },
];

export const updateCustomOrderStatus = (
  customOrderId: string,
  status: OrderStatus
) => api.patch(`/api/admin/order/custom/${customOrderId}`, { status });

export const deleteCustomOrder = (customOrderId: string) =>
  api.delete(`/api/admin/order/custom/${customOrderId}`);
