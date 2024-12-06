import React from 'react';
import '../styles/components/button.css';

const Button = ({ children, ...props }) => {
 return (
   <button className="button" {...props}>
     {children}
   </button>
 );
};

export default Button;