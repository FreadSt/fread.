import React from 'react';
import {useNavigate} from "react-router-dom";

const Orders: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>Success</div>
      <button onClick={() => navigate('/')}> Return home</button>
    </>
  )
};

export default Orders;
