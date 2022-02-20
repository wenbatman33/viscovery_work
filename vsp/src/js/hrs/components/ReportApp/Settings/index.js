import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Route, Switch } from 'react-router-dom';

import styles from './Settings.scss';
import ShiftInfoFormContainer from '../../../containers/ReportAppContainer/ShiftInfoFormContainer';
import ShiftMapFormContainer from '../../../containers/ReportAppContainer/ShiftMapFormContainer';

class Settings extends React.PureComponent {
  render() {
    const { match } = this.props;
    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <Switch>
          <Route exact path={`${match.url}/shift_info`} component={ShiftInfoFormContainer} />
          <Route path={`${match.url}`} component={ShiftMapFormContainer} />
        </Switch>
      </div>
    );
  }
}

Settings.propTypes = {
  match: PropTypes.object,
};

export default CSSModules(Settings, styles);
