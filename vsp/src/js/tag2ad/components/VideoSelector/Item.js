import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Checkbox } from 'vidya/Form';
import styles from './Item.scss';

class Item extends React.PureComponent {
  render() {
    return (
      <div styleName="item">
        <div>
          <Checkbox
            checked={this.props.checked}
            onChange={(checked) => {
              this.props.onChange(checked, this.props.value);
            }
            }
            disabled={this.props.disabled}
          />
        </div>
        <div styleName={`label-${this.props.disabled ? 'disabled' : 'normal'}`}>{this.props.label}</div>
      </div>
    );
  }
}

Item.defaultProps = {};
Item.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};


export default CSSModules(Item, styles);
