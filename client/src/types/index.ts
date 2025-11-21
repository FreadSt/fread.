export interface CartProduct {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

export interface CartState {
  products: CartProduct[];
  totalPrice: number;
  totalQuantity: number;
  userId?: string
}
