import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import { mapForRender, handleIndent } from './utils';

import styles from './Folder.scss';

class Folder extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleHide = this.handleHide.bind(this);
    this.toggleHide = this.toggleHide.bind(this);

    this.state = {
      hide: true,
    };
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
    const {
      label,
      items,
      level,
      selectFunc,
    } = this.props;

    return (
      <div>
        <div
          styleName="container"
          onClick={this.toggleHide}
          style={{
            textIndent: `${handleIndent(level)}px`,
          }}
        >

          <p>
            <i
              className="fa fa-caret-right"
              styleName={this.state.hide ? 'icon' : 'display__icon'}
            />
            {label}
          </p>
        </div>
        <div styleName={this.state.hide ? 'hide' : 'items__area'}>
          {
            items.map(mapForRender(selectFunc))
          }
        </div>
      </div>
    );
  }
}

Folder.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  level: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.object),
  selectFunc: PropTypes.func,
};

export default CSSModules(Folder, styles);
