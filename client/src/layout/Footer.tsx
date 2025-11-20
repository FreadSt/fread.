import React from 'react';
import { Place, MailOutline, LocalPhone } from '@mui/icons-material';

interface ContactItem {
  icon: React.ReactNode;
  text: string;
}

interface Link {
  label: string;
  href: string;
}

const Footer: React.FC = () => {
  const usefulLinks: Link[] = [
    { label: 'Home', href: '' },
    { label: 'Man Fashion', href: '' },
    { label: 'Accessories', href: '' },
    { label: 'Order Tracking', href: '' },
    { label: 'Cart', href: '' },
    { label: 'My Account', href: '' },
    { label: 'Wishlist', href: '' },
    { label: 'Terms', href: '' },
  ];

  const contactItems: ContactItem[] = [
    { icon: <Place className='mr-4' />, text: 'Kyiv, Ukraine' },
    { icon: <LocalPhone className='mr-4' />, text: '+380999999999' },
    { icon: <MailOutline className='mr-4' />, text: 'kholiawkodev@gmail.com' },
  ];

  return (
    <footer className='p-8 grid gap-x-16 gap-y-4 md:grid-cols-3'>
      <div>
        <h1 className='font-bold text-3xl uppercase mb-4 tracking-wider'>
          <a href=''>fread.</a>
        </h1>
        <p className='text-justify'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione
          recusandae nobis sunt aliquid tempore vitae sapiente ea voluptatibus
          ab repellat asperiores eius cum laboriosam facilis eos, maiores
          deleniti nemo consequuntur assumenda sed consectetur culpa voluptatum
          quisquam quibusdam? Saepe, soluta quibusdam.
        </p>
      </div>
      <div>
        <h2 className='font-bold text-2xl mb-4 tracking-wider'>Useful Links</h2>
        <div className='grid grid-cols-2'>
          <ul>
            {usefulLinks.slice(0, 4).map((link, index) => (
              <li key={index}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <ul>
            {usefulLinks.slice(4).map((link, index) => (
              <li key={index}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2 className='font-bold text-2xl mb-4 tracking-wider'>Contact</h2>
        <ul>
          {contactItems.map((item, index) => (
            <li key={index} className='flex items-center'>
              {item.icon}
              <span className='truncate max-w-[150px] md:maxw-[200px] lg:max-w-none'>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
