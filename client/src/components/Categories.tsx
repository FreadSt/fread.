import React from 'react';
import shoes from '../assets/images/shoes.jpg';
import phone from '../assets/images/iphone.jpg';
import clothes from '../assets/images/clothes.jpg';
import furniture from '../assets/images/furniture.jpg';
import toys from '../assets/images/toys.jpg';

import Category from './Category.tsx';

const Categories: React.FC = () => {
    return (
        <section className='p-8' id='categories'>
            <div className='grid gap-2 md:grid-cols-3 mb-2'>
                <Category name='man' image={clothes as string} />
                <Category name='shoes' image={shoes as string} />
                <Category name='pants' image={phone as string} />
            </div>
            <div className='grid gap-2 md:grid-cols-2'>
                <Category name='woman' image={furniture as string} />
                <Category name='sport' image={toys as string} />
            </div>
        </section>
    );
};

export default Categories;