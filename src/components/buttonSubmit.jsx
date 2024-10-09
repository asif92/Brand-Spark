import React from 'react';
import Loader from './Loader';

const Button = ({ btnText, handleClick, className, loading, btntype }) => {
  return (
    <button type={btntype} onClick={handleClick} disable={loading} className={className}>
      {loading ? <Loader /> : btnText}
    </button>
  );
};

export default Button;
