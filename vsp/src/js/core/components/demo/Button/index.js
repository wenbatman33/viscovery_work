import React from 'react';

import ButtonDemo from './ButtonDemo';
import ButtonGroupDemo from './ButtonGroupDemo';


const buttonStyles = [
  'primary',
  'secondary',
  'disable',
  'link',
];

const buttonSize = [
  'function',
  'normal',
  'big',
  'icon',
  'label',
];

const Button = () => (
  <div>
    <a
      href="http://awsgit.viscovery.co/Product_Center/vsp/blob/develop/src/js/core/document/Button.md"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2>Button</h2>
    </a>
    {
      buttonSize.map((size, index) => (
        <ButtonDemo
          key={index}
          size={size}
          buttonStyles={buttonStyles}
        />
      ))
    }
    <ButtonGroupDemo />
  </div>
);

export default Button;
