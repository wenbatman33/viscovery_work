import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { toGray } from 'utils/classNameUtil';

import styles from './ButtonGroupElement.scss';

class ButtonGroupElement extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.props.onChange(this.props.option);
  }

  render() {
    return (
      <div
        styleName={this.props.checked ? toGray(this.props.gray)('checked') : toGray(this.props.gray)('unchecked')}
        onClick={this.onChange}
      >
        <label
          htmlFor={this.props.id}
          styleName="label"
        >

          <p>{this.props.label}</p>
          <input
            type="radio"
            id={this.props.id}
            name={this.props.name}
            defaultChecked={this.props.checked}
            hidden
          />
        </label>
      </div>
    );
  }
}


ButtonGroupElement.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  option: PropTypes.object,
  name: PropTypes.string,
  checked: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  gray: PropTypes.bool,
};

export default CSSModules(ButtonGroupElement, styles);
