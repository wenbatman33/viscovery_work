import React from 'react';
import CSSModules from 'react-css-modules';

import PaginationDemo from './PaginationDemo';

import styles from './Main.scss';


const Pagination = () => (
  <div>
    <a
      href="http://awsgit.viscovery.co/Product_Center/vsp/blob/develop/src/js/core/document/Pagination.md"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2>Pagination</h2>
    </a>
    <PaginationDemo />
  </div>
);

export default CSSModules(Pagination, styles);
