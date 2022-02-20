import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { localize } from '../../../../utils';

import styles from './SearchBox.scss';

class SearchBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleEnterSearchText = this.handleEnterSearchText.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  handleEnterSearchText(event) {
    this.props.setSearchText(event.target.value.trim());
  }

  handleSubmitSearch(event) {
    // Prevent page refresh for form onSubmit
    event.preventDefault();

    this.props.handleSubmitSearch();
  }

  render() {
    const { t } = this.props;
    return (
      <form
        styleName="search-form"
        onSubmit={this.handleSubmitSearch}
      >
        <button type="submit" styleName="submit-btn">
          <i className="fa fa-search" aria-hidden="true" />
        </button>
        <input
          type="text"
          styleName="search-input"
          placeholder={t('search_campaign')}
          onChange={this.handleEnterSearchText}
        />
      </form>
    );
  }
}

SearchBox.propTypes = {
  t: PropTypes.func,
  setSearchText: PropTypes.func,
  handleSubmitSearch: PropTypes.func,
};

export default localize(CSSModules(SearchBox, styles));
