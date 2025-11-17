import React from 'react';

import Carousel from '../components/Carousel.tsx';
import Categories from '../components/Categories.tsx';
import Products from '../components/Products.tsx';

const Home: React.FC = () => {
  return (
    <>
      <Carousel />
      <Categories />
      <Products />
    </>
  );
};

export default Home;
