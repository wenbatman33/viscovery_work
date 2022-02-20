import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../styles/layout.scss';
import Divider from './../HorizontalDivider';

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.computeRender = this.computeRender.bind(this);
  }

  computeRender() {
    if (this.props.divider) {
      return this.props.elements.map((datum, index) =>
        (<div key={index}>{datum} <Divider /></div>)
      );
    }
    return this.props.elements;
  }

  render() {
    return (
      <div styleName="lv-container">
        {this.computeRender()}
      </div>
    );
  }
}

ListView.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.element).isRequired,
  divider: PropTypes.bool,
};

export default CSSModules(ListView, styles);
