import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import Link from './Link';

import styles from './Breadcrumb.scss';
import { NAME, PATH } from '../../constants';
import * as helper from './helper';
import { localize } from '../../utils';


class Breadcrumb extends React.Component {
  state = {
    selected: helper.pathnameToEventKey(this.props.location.pathname),
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: helper.pathnameToEventKey(nextProps.location.pathname),
    });
  }

  setSelected = (key) => {
    this.setState({ selected: key });
  };

  render() {
    const { t } = this.props;
    return (
      <div styleName="root">
        <div styleName="tab-container">
          <Link
            to={helper.stripFromStart(`${PATH.CHANCE_SEARCH}/1`, `/${NAME}/`)}
            eventKey={1}
            selected={this.state.selected === 1}
            onSelect={this.setSelected}
          >
            { t('adSearch') }
          </Link>
          <Link
            to={helper.stripFromStart(`${PATH.AD_POD_SEARCH}/1`, `/${NAME}/`)}
            eventKey={2}
            selected={this.state.selected === 2}
            onSelect={this.setSelected}
          >
            { t('adPod') }
          </Link>
        </div>
        <div styleName="warning">
          <i className="fa fa-exclamation" styleName="icon" aria-hidden="true" />
          { t('adBlockWarning') }
        </div>
      </div>
    );
  }
}

Breadcrumb.propTypes = {
  location: PropTypes.object,
  t: PropTypes.func,
};

export default localize(CSSModules(Breadcrumb, styles));
