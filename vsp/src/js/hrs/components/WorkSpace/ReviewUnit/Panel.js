import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './Panel.scss';

import {
  genResult,
} from '../../../utils';

const Panel = ({ openPreviewModal, updateResult, handleBrandsEditor }) => (
  <div styleName="container">
    <div styleName="top">
      <i
        className="fa fa-upload"
        styleName="button"
        aria-hidden="true"
        onClick={updateResult(genResult(1))}
      />
      <i
        className="fa fa-pencil"
        styleName="button"
        aria-hidden="true"
        onClick={handleBrandsEditor}
      />
      <i
        className="fa fa-trash"
        styleName="button"
        onClick={updateResult(genResult(2))}
        aria-hidden="true"
      />
    </div>
    <div styleName="bottom">
      <div styleName="left-triangle">
        <i
          className="fa fa-search-plus"
          styleName="bottom-left-button"
          aria-hidden="true"
          onClick={openPreviewModal}
        />
      </div>
      <div styleName="right-triangle">
        { /* <i
          className="fa fa-unlock"
          styleName="bottom-right-button"
          aria-hidden="true"
          onClick={updateResult(genResult(4))}
        /> */ }
      </div>
    </div>
  </div>
);

Panel.propTypes = {
  openPreviewModal: PropTypes.func,
  updateResult: PropTypes.func,
  handleBrandsEditor: PropTypes.func,
};

export default CSSModules(Panel, styles);
