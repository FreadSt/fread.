import { ShoppingCart } from "@mui/icons-material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {addProduct} from "../store/cart-slice.ts";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store";

interface ProductProps {
  id: string;
  title: string;
  price: number;
  image: string;
}

export const Product: React.FC<ProductProps> = React.memo(
  ({id, title, price, image,}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const handleAddToCart = () => {
      dispatch(
        addProduct({
          _id: id,
          title,
          price,
          image,
          quantity: 1,
          size: 'default',
        })
      );
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate(`#${id}`, { replace: true });
      navigate(`/products/${id}`);
    };

    return (
        <div className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
          <Link to={`/products/${id}`} onClick={handleClick}>
            <div className="relative overflow-hidden h-72 bg-gradient-to-br from-teal-300 to-teal-800">
              <img
                loading='lazy'
                decoding='async'
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            </div>
          </Link>

          <div className="p-6">
            <h3 className="text-base font-bold text-foreground mb-3 line-clamp-2">
              {title}
            </h3>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-teal-700">${price}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full border-2 border-black text-gray-700 py-4 px-6 font-semibold uppercase hover:bg-gray-900 hover:text-white transition ease-out duration-300"
            >
              <ShoppingCart size={18}/>
              Add to Cart
            </button>
          </div>
        </div>
    );
  }
)

Product.displayName = 'Product';
