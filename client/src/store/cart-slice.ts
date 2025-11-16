import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CartProduct {
  _id: string
  title: string
  description: string
  image: string
  price: number
  quantity: number
  size: string
}

interface CartState {
  products: CartProduct[]
  totalQuantity: number
  totalPrice: number
}

interface ProductBase {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

interface AddProductPayload {
  product: ProductBase
  quantity: number
  size: string
}

const initialState = {
  products: [],
  totalQuantity: 0,
  totalPrice: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct(state: CartState, action: PayloadAction<AddProductPayload>) {
      const newProduct: CartProduct = {
        _id: action.payload.product._id,
        title: action.payload.product.title,
        description: action.payload.product.description,
        image: action.payload.product.image,
        price: action.payload.product.price,
        quantity: action.payload.quantity,
        size: action.payload.size
      };
      let added = false;

      for (let oldProduct of state.products) {
        // Check if the product already added before
        if (oldProduct._id === newProduct._id) {
          // If added before check if the same size
          if (oldProduct.size === newProduct.size) {
            // If the same size increase the quantity
            oldProduct.quantity += newProduct.quantity;
            added = true;
            break;
          }
        }
      }
      // If not added before or not the same size push it as a new product 
      if (!added) {
        state.products.push(newProduct);
      }
      state.totalQuantity += newProduct.quantity;
      state.totalPrice += newProduct.price * newProduct.quantity;
    },
  }
});

export const { addProduct } = cartSlice.actions;
export default cartSlice;