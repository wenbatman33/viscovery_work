import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { toGray } from 'utils/classNameUtil';

import styles from './DropdownList.scss';

const makeHash = (length = 5) => (
  Math.random().toString(36).substring(2, length)
);

const getOptions = (value) => {
  const values = Array.isArray(value) ? value : [value];

  return options => (
    options.filter(option =>
      values.indexOf(option.value) !== -1
    )
  );
};

const isReverse = bottom =>
  window.innerHeight - bottom < 200;

class DropdownList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getDisplay = this.getDisplay.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleExpand = this.handleExpand.bind(this);

    this.placeholder = {
      label: props.placeholder,
      value: makeHash(),
    };

    this.state = {
      collapse: true,
      selected: {
        value: 0,
        label: this.props.placeholder,
      },
    };
  }

  getDisplay() {
    let { options } = this.props;
    const { value } = this.props;
    options = getOptions(value)(options);

    if (options.length === 0) {
      return [
        this.placeholder,
      ];
    }

    return options;
  }

  handleSelected(option) {
    return () => {
      this.props.onChange(option);
    };
  }

  handleCollapse() {
    this.setState({
      collapse: true,
    });
  }

  handleExpand() {
    this.setState({
      collapse: false,
    });
  }

  render() {
    const collapseStyle = this.container
                          && isReverse(this.container.getBoundingClientRect().bottom)
    ? { bottom: '100%' }
    : null;

    return (
      <div
        styleName={toGray(this.props.gray)('container')}
        tabIndex="0"
        onBlur={this.handleCollapse}
        ref={(node) => { this.container = node; }}
      >
        <div
          styleName={toGray(this.props.gray)('displayZone')}
          onClick={this.state.collapse ? this.handleExpand : this.handleCollapse}
        >
          {this.getDisplay().map(option =>
            <div
              key={option.value}
              title={option.label}
              styleName={
                option.value === this.placeholder.value ?
                  toGray(this.props.gray)('placeholder') :
                  toGray(this.props.gray)('selected')
              }
            >
              <p>{option.label}</p>
            </div>
          )}
        </div>
        <div
          styleName={this.state.collapse ? 'collapse' : 'expand'}
          style={collapseStyle}
        >
          <div styleName="zBox">
            <div
              styleName={toGray(this.props.gray)('options')}
            >
              {this.props.options.map((option, index) => (
                <div
                  styleName={toGray(this.props.gray)('option')}
                  key={index}
                  title={option.label}
                  onClick={() => {
                    this.handleSelected(option)();
                    this.handleCollapse();
                  }}
                >
                  <p>{option.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


DropdownList.propTypes = {
  value: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.any),
    ]
  ),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  gray: PropTypes.bool,
};

DropdownList.defaultProps = {
  options: [
    {
      label: '',
      value: 0,
    },
  ],
  placeholder: '------------',
  gray: false,
};

export default CSSModules(DropdownList, styles);
