import React from 'react';
import './style.css';

const Inputbox = ({
  className,
  placeholder,
  value,
  handleChange,
  disable,
  type,
  name,
  autoComplete,
  maxData,
  onKeyDown,
  inputRef,
  handleAutoSubmit,
}) => {
  return (
    <input
      ref={inputRef}
      autoComplete={autoComplete}
      name={name}
      onKeyDown={onKeyDown}
      type={type}
      max={maxData}
      className={className}
      placeholder={placeholder}
      onChange={handleChange}
      disabled={disable}
      value={value}
    />
  );
};

export default Inputbox;
