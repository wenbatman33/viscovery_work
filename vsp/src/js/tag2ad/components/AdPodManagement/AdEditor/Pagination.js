import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'vidya/Button';
import CSSModules from 'react-css-modules';
import styles from './Pagination.scss';

const Pagination = props => (
  <div styleName="container">
    <Button
      vdStyle="secondary"
      vdSize="icon"
      onClick={() => props.onSelect(props.selected - 1)}
      disable={props.selected === 1}
    >
      &lt;
    </Button>
    <div styleName="number">{`${props.selected} / ${props.total}`}</div>
    <Button
      vdStyle="secondary"
      vdSize="icon"
      onClick={() => props.onSelect(props.selected + 1)}
      disable={props.selected === props.total}
    >
      &gt;
    </Button>
  </div>
);

Pagination.propTypes = {
  total: PropTypes.number,
  selected: PropTypes.number,
  onSelect: PropTypes.func,
};


export default CSSModules(Pagination, styles);
