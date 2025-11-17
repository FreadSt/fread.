import React from 'react';

import { useParams } from 'react-router-dom';

import Products from '../components/Products.tsx';
import Title from '../components/Title.tsx';

const ShoppingCategories: React.FC = () => {
  const { category } = useParams<{category: string}>();

  return (
    <>
      <Title>{category
        ? `${category.charAt(0).toUpperCase()}${category.slice(1)}`
        : 'Categories'}</Title>
      <Products category={category} />
    </>
  );
};

export default ShoppingCategories;
