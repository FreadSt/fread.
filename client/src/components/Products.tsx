import React, {useCallback, useEffect, useState} from 'react';

import { publicRequest } from '../request-methods.ts';

import {Product as ProductComponent} from './Product.tsx';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  categories?: string[];
  size?: string[];
  color?: string[];
  inStock?: boolean;
}

interface ProductProps {
  category?: string;
  filter?: Record<string, string>;
}

const Products: React.FC<ProductProps> = ({ category, filter }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [data, setData] = useState<Product[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const url = category 
        ? `/products?category=${encodeURIComponent(category)}` 
        : '/products';
      console.log('Request URL:', url);
      const response = await publicRequest<Product[]>(url);
      console.log('Response data:', response);
      setData(response || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setData([]);
    }
  }, [category]);

  const filteredProducts = React.useMemo(() => {
    if (!filter || Object.keys(filter).length === 0) {
      return data;
    }
    
    return data.filter((product) => {
      return Object.entries(filter).every(([key, value]) => {
        const productValue = product[key as keyof Product];
        return productValue?.toString().includes(value);
      });
    });
  }, [data, filter]);

  useEffect(() => {
    setProducts(filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
      <section
          className='pb-8 mx-8 grid gap-2 md:grid-cols-2 lg:grid-cols-4'
          id='products'
      >
        {products.map((product) => (
            <div key={product._id}>
              <ProductComponent image={product.image} id={product._id} />
            </div>
        ))}
      </section>
  );
};

export default Products;
