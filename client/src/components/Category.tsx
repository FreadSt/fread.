import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryProps {
  name: string;
  image: string;
}

const Category: React.FC<CategoryProps> = ({ name, image }) => {
  return (
    <Link to={`/categories/${name.toLowerCase()}`} className='block group'>
      <figure className='relative w-full h-[300px] md:h-[45vh] overflow-hidden rounded-lg'>
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
        />
        <figcaption className='bg-black/40 absolute z-10 top-0 left-0 w-full h-full flex flex-col justify-center items-center p-4 group-hover:bg-black/60 transition-colors duration-500'>
          <h2 className='mb-4 p-2 uppercase text-xl sm:text-2xl md:text-3xl text-white font-bold text-center drop-shadow-lg'>
            {name}
          </h2>
          <button className='border-2 border-white px-4 py-2 bg-white text-black text-sm md:text-base font-semibold hover:bg-teal-600 hover:border-teal-600 hover:text-white transition ease-out duration-500 rounded'>
            Shop Now
          </button>
        </figcaption>
      </figure>
    </Link>
  );
};

export default Category;
