import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';

import PageButton from './PageButton';

import styles from '../../styles/pagination.scss';

class Pagination extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.renderPageButtons = this.renderPageButtons.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(pageNumber) {
    if (this.props.onSelect) {
      this.props.onSelect(pageNumber);
    }
  }

  renderPageButtons() {
    const { total, visiblePages, activePage } = this.props;

    const startPage = ((Math.ceil(activePage / visiblePages) - 1) * visiblePages) + 1;
    const endPage = Math.min((startPage + visiblePages) - 1, total);
    const pageButtons = [];

    for (let pagenumber = startPage; pagenumber <= endPage; pagenumber += 1) {
      pageButtons.push(
        <PageButton
          key={pagenumber}
          label={pagenumber}
          active={pagenumber === activePage}
          eventKey={pagenumber}
          onSelect={this.handleSelect}
        />
      );
    }

    return pageButtons;
  }

  render() {
    const { prev, next, activePage, total } = this.props;
    return (
      <ul styleName="paginate">
        {prev &&
          <PageButton
            label={'<'}
            disabled={activePage === 1}
            eventKey={activePage - 1}
            onSelect={this.handleSelect}
          />
        }
        {this.renderPageButtons()}
        { next &&
          <PageButton
            label={'>'}
            disabled={activePage === total}
            eventKey={activePage + 1}
            onSelect={this.handleSelect}
          />
        }
      </ul>
    );
  }
}

Pagination.defaultProps = {
  total: 1,
  prev: true,
  next: true,
  activePage: 1,
  visiblePages: 10,
};
Pagination.propTypes = {
  // total pages count
  total: PropTypes.number.isRequired,
  // show previous page button
  prev: PropTypes.bool,
  // show next page button
  next: PropTypes.bool,
  // current active(selected) page
  activePage: PropTypes.number.isRequired,
  // maximum page buttons (pages with number, prev & next not included) in row
  visiblePages: PropTypes.number,
  onSelect: PropTypes.func,
};

export default CSSModules(Pagination, styles);
