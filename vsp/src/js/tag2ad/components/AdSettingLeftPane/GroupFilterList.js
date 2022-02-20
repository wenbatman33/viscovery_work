import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from '../SharedCustomItemSelector/CustomList.scss';
import FilterListItem from '../FilterListItem';

const GroupFilterList = props => (
  <div styleName="container">
    {
      props.options.map(option => (
        <FilterListItem
          key={option.value}
          eventKey={option.value}
          onItemClick={props.onItemClick}
          onIconClick={props.onIconClick}
          icon={null}
          hoverIcon={'none'}
          onHoverIconClick={props.onHoverIconClick}
        >
          {option.label}
        </FilterListItem>
      ))
    }
  </div>
);

GroupFilterList.propTypes = {
  options: PropTypes.array,
  onItemClick: PropTypes.func,
  onIconClick: PropTypes.func,
  onHoverIconClick: PropTypes.func,
};


export default CSSModules(GroupFilterList, styles);
