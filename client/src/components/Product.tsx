import React, { useState } from 'react';

import { Link } from 'react-router-dom';

interface ProductProps {
    image: string
    id: string
}

export const Product: React.FC<ProductProps> = ({ image, id }) => {
  const [overlayIsShown, setOverlayIsShown] = useState(false);
  return (
    <figure
      className='relative'
      onMouseEnter={() => {
        setOverlayIsShown(true);
      }}
      onMouseLeave={() => {
        setOverlayIsShown(false);
      }}
    >
      <img src={image} alt='product-image' className='w-full h-[300px] object-cover' />
      {overlayIsShown && (
        <Link
          to={`/products/${id}`}
          className='cursor-pointer absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'
        />
      )}
    </figure>
  );
};
