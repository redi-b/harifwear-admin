type Product = {
  id: number;
  name: string;
  photo: string;
  size: string;
  color: string;
  description: string|null;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  name: string;
  address: string;
  phone: string;
  products: Product[];
};