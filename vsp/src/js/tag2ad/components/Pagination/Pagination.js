import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import PageButton from './PageButton';

import styles from './Pagination.scss';


class Pagination extends React.PureComponent {

  handlePrevClick = (e) => {
    if (this.props.onPrev) {
      this.props.onPrev(this.props.activePage - 1, e);
    }
  };

  handleNextClick = (e) => {
    if (this.props.onNext) {
      this.props.onPrev(this.props.activePage + 1, e);
    }
  };

  render() {
    const { totalPages, activePage } = this.props;
    return (
      <div
        styleName="container"
      >
        <div>
          {this.props.children}
        </div>
        <PageButton
          disabled={this.props.disabled || activePage === 1}
          onClick={this.handlePrevClick}
        >
          <i className="fa fa-angle-left" aria-hidden="true" />
        </PageButton>
        <PageButton
          disabled={this.props.disabled || activePage === totalPages}
          onClick={this.handleNextClick}
        >
          <i className="fa fa-angle-right" aria-hidden="true" />
        </PageButton>
      </div>
    );
  }
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool,
};


export default CSSModules(Pagination, styles);
