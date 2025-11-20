import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartProduct, CartState } from '../types';

const initialState: CartState = {
  products: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<CartProduct>) {
      const product = action.payload;

      const existingProduct = state.products.find(
        (p) => p._id === product._id && p.size === product.size
      );

      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        state.products.push(product);
      }

      state.totalQuantity = state.products.reduce((acc, p) => acc + p.quantity, 0);
      state.totalPrice = state.products.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      );
    },

    removeProduct(state, action: PayloadAction<{ _id: string; size?: string }>) {
      const { _id, size } = action.payload;
      state.products = state.products.filter(
        (p) => !(p._id === _id && p.size === size)
      );
      state.totalQuantity = state.products.reduce((acc, p) => acc + p.quantity, 0);
      state.totalPrice = state.products.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      );
    },

    updateProductQuantity(
      state,
      action: PayloadAction<{ _id: string; size?: string; quantity: number }>
    ) {
      const { _id, size, quantity } = action.payload;
      const product = state.products.find(
        (p) => p._id === _id && p.size === size
      );
      if (product) {
        product.quantity = quantity;
      }
      state.totalQuantity = state.products.reduce((acc, p) => acc + p.quantity, 0);
      state.totalPrice = state.products.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      );
    },

    clearCart(state) {
      state.products = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addProduct, removeProduct, updateProductQuantity, clearCart } = cartSlice.actions;
export default cartSlice;
