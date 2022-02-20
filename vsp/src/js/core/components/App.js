import React from 'react';
import CSSModules from 'react-css-modules';

import ButtonDemo from './demo/Button';
import FormDemo from './demo/Form';
import FeedbackDemo from './demo/Feedback';
import DialogsDemo from './demo/Dialogs';
import OthersDemo from './demo/Others';
import PaginationDemo from './demo/Pagination';


import app from './App.scss';

const App = () => (
  <div
    styleName="container"
  >
    <a
      href="http://awsgit.viscovery.co/Product_Center/vsp/blob/develop/src/js/core/document/DevelopmentGuide.md"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h1>
        Vidya Development Guide
      </h1>
    </a>
    <ButtonDemo />
    <FormDemo />
    <FeedbackDemo />
    <DialogsDemo />
    <OthersDemo />
    <PaginationDemo />
  </div>
);

export default CSSModules(App, app);
