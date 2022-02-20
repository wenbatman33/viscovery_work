import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { mapForType, mapForRender } from './utils';

import styles from './MultiLevelDL.scss';

class MultiLevelDL extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleHide = this.handleHide.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clickHandler = this.clickHandler.bind(this);

    this.state = {
      hide: true,
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.clickHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.clickHandler);
  }

  onChange(option) {
    this.props.onChange(option);
    this.handleHide(true);
  }

  clickHandler(event) {
    if (!(this.container.contains(event.target))) {
      this.handleHide(true);
    }
  }

  handleHide(hide) {
    this.setState({
      hide,
    });
  }

  toggleHide() {
    const { hide } = this.state;
    this.handleHide(!hide);
  }

  render() {
    const typedData = this.props.options.map(mapForType());
    const selectedLabel = (this.props.selected && this.props.selected.label);
    return (
      <div
        ref={(node) => { this.container = node; }}
        styleName="container"
      >
        <div
          onClick={this.toggleHide}
          styleName="display__area"
        >
          {
            selectedLabel
              ? <p>{selectedLabel}</p>
              : <p styleName="placeholder">{this.props.placeholder}</p>
          }
          <div
            styleName="icon"
          >
            <i
              className="fa fa-angle-down"
            />
          </div>
        </div>
        <div
          styleName={this.state.hide ? 'hide' : 'options__area'}
        >
          {
            typedData.map(mapForRender(this.onChange))
          }
        </div>
      </div>
    );
  }
}

MultiLevelDL.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.object,
  placeholder: PropTypes.string,
};

MultiLevelDL.defaultProps = {
  selected: {
    label: '',
    value: 0,
  },
  options: [
    {
      label: '',
      value: 0,
    },
  ],
  placeholder: '------------',
};

export default CSSModules(MultiLevelDL, styles);
