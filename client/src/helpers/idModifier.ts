import {CartProduct} from "../types";

export const getCartItemKey = (product: CartProduct): string => {
  return `${product._id}-${product.size || 'default'}`;
};