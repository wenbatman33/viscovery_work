import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'vidya/Button';
import { localize } from '../../utils';

class ActionButtons extends React.PureComponent {
  render() {
    return (
      <div>
        <Button
          vdStyle={'secondary'}
          onClick={this.props.onClearSearch}
        >
          {this.props.t('clearSearchCriteria')}
        </Button>
        <Button
          vdStyle={'secondary'}
          onClick={this.props.onSearch}
          disable={this.props.disableSearch}
        >
          {this.props.t('search')}
        </Button>
      </div>
    );
  }
}

ActionButtons.propTypes = {
  onClearSearch: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  t: PropTypes.func,
  disableSearch: PropTypes.bool,
};


export default localize(ActionButtons);
