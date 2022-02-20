import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { toGray } from 'utils/classNameUtil';

import ButtonGroupElement from './ButtonGroupElement';

import styles from './ButtonGroup.scss';

const makeName = (length = 5) => (
  Math.random().toString(36).substring(0, length)
);

class ButtonGroup extends React.PureComponent {
  render() {
    return (
      <div styleName={toGray(this.props.gray)('container')}>
        {
          this.props.options.map(ele => (
            <ButtonGroupElement
              key={ele.value}
              option={ele}
              name={makeName()}
              checked={ele.value === this.props.value}
              label={ele.label}
              onChange={this.props.onChange}
              gray={this.props.gray}
            />
          ))
        }
      </div>
    );
  }
}

ButtonGroup.propTypes = {
  value: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
    ]
  ),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape(
    {
      value: PropTypes.oneOfType(
        [
          PropTypes.string,
          PropTypes.number,
        ]
      ),
      label: PropTypes.oneOfType(
        [
          PropTypes.string,
          PropTypes.number,
        ]
      ),
    }
  )),
  gray: PropTypes.bool,
};

ButtonGroup.defaultProps = {
  options: [
    {
      label: '',
      value: 0,
    },
  ],
  gray: false,
};

export default CSSModules(ButtonGroup, styles);
