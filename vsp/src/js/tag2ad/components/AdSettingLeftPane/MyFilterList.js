import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from '../SharedCustomItemSelector/CustomList.scss';
import FilterListItem from '../FilterListItem';

const MyFilterList = props => (
  <div styleName="container">
    {
      props.options.map(option => (
        <FilterListItem
          key={option.value}
          eventKey={option.value}
          onItemClick={props.onItemClick}
          onIconClick={props.onIconClick}
          icon={'cog'}
          hoverIcon={'trash'}
          onHoverIconClick={props.onHoverIconClick}
        >
          {option.label}
        </FilterListItem>
      ))
    }
  </div>
);

MyFilterList.propTypes = {
  options: PropTypes.array,
  onItemClick: PropTypes.func,
  onIconClick: PropTypes.func,
  onHoverIconClick: PropTypes.func,
};


export default CSSModules(MyFilterList, styles);
