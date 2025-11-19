import React from 'react';
import shoes from '../assets/images/shoes.jpg';
import pants from '../assets/images/pants.webp';
import sport from '../assets/images/sport_wear.jpeg';
import woman from '../assets/images/woman_wear.jpg';
import man from '../assets/images/man_fits.jpg';

import Category from './Category.tsx';
import Title from './Title.tsx';

const Categories: React.FC = () => {
  return (
    <article>
      <Title>Search by category</Title>
      <section className='px-8 pb-8' id='categories'>
        <div className='grid gap-4 md:grid-cols-3 mb-4'>
          <Category name='man' image={man as string} />
          <Category name='shoes' image={shoes as string} />
          <Category name='pants' image={pants as string} />
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <Category name='woman' image={woman as string} />
          <Category name='sport' image={sport as string} />
        </div>
      </section>
    </article>
  );
};

export default Categories;
