import React from 'react';
import CSSModules from 'react-css-modules';
import TextInputDemo from './TextInputDemo';
import SwitchDemo from './SwitchDemo';
import DropdownListDemo from './DropdownListDemo';
import MultiLevelDLDemo from './MultiLevelDLDemo';


import styles from './Main.scss';

const Form = () => (
  <div>
    <a
      href="http://awsgit.viscovery.co/Product_Center/vsp/blob/develop/src/js/core/document/Form.md"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2>Form</h2>
    </a>
    <TextInputDemo />
    <SwitchDemo />
    <DropdownListDemo />
    <MultiLevelDLDemo />
  </div>
);


export default CSSModules(Form, styles);
