import React from 'react';

interface TitleProps {
  children: React.ReactNode;
}

const Title = ({children} : TitleProps) => {
  return <h1 className='p-8 font-bold text-4xl'>{children}</h1>;
};

export default Title;
