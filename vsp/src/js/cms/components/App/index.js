import PropTypes from 'prop-types';
import React from 'react';

import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { cookieUtil, routerUtil } from 'utils';

import { NAME } from '../../constants';
import { SeriesContainer, UploadContainer } from '../../containers';

import styles from './styles.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  children: PropTypes.node,
};

class App extends React.Component {
  static propTypes = {
    single: React.PropTypes.bool,
  };

  static defaultProps = {
    single: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      viewHrs: Boolean(cookieUtil.getViewHrs()),
    };
  }

  handleStatus = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    routerUtil.pushHistory(`/${NAME}/status`);
  };

  render() {
    const { single, children, t } = this.props;
    return single
      ? (
        <div styleName="page">
          {children}
        </div>
      )
      : (
        <div styleName="app">
          <div styleName="panel">
            {
              // why hide statusList when viewHrs === 0
              // `count` is computed in backend
              // difficult to know user's current role
              this.state.viewHrs ?
                <div styleName="tab" onClick={this.handleStatus}>
                  <h3>{t('statusReport')}</h3>
                </div>
              : null
            }

            <div styleName="menu">
              <SeriesContainer />
            </div>
          </div>
          <div styleName="content">
            {children}
          </div>
          <UploadContainer />
        </div>
      );
  }
}

App.propTypes = propTypes;

export default translate([NAME])(CSSModules(App, styles));
