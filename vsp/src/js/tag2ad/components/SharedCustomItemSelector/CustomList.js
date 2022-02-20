import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import FilterListItem from '../FilterListItem';
import styles from './CustomList.scss';
import { localize } from '../../utils';

class CustomList extends React.PureComponent {

  handleItemClick = (eventKey) => {
    const nextOptions = this.props.options.filter(option =>
      this.props.values.indexOf(option.value) > -1);
    const index = nextOptions.findIndex(o => o.value === eventKey);

    if (index > -1) {
      nextOptions.splice(index, 1);
    } else {
      const option = this.props.options.find(o => o.value === eventKey);
      if (option !== null) {
        nextOptions.push(option);
      }
    }

    this.props.onChange(nextOptions);
  };

  _optionFilter = option => !this.props.values.includes(option.value);

  render() {
    return (
      <div styleName="container">
        {
          this.props.options.filter(this._optionFilter).map(option => (
            <FilterListItem
              key={option.value}
              eventKey={option.value}
              onItemClick={this.handleItemClick}
            >
              {option.label}
            </FilterListItem>
          ))
        }
      </div>
    );
  }
}

CustomList.defaultProps = {
  options: [],
};
CustomList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      shared: PropTypes.bool,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  // array of option values, eg. array of filter IDs
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  t: PropTypes.func,
};


export default localize(CSSModules(CustomList, styles));
