import React from 'react';
import CSSModules from 'react-css-modules';
import { Redirect, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';

import io from 'socket.io-client';

import Sidebar from './Sidebar';

import styles from './AdminApp.scss';

import EpisodeContainer from '../../containers/AdminAppContainer/EpisodeContainer';
import OneEpisodeContainer from '../../containers/AdminAppContainer/OneEpisodeContainer';
import SystemContainer from '../../containers/AdminAppContainer/SystemContainer';
import MemberContainer from '../../containers/AdminAppContainer/MemberContainer';
import OneMemberContainer from '../../containers/AdminAppContainer/OneMemberContainer';
import HrsMonitorContainer from '../../containers/AdminAppContainer/HrsMonitorContainer';

const withProps = addProps => Component => props => (<Component {...props} {...addProps} />);

class AdminApp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);
    this.wrapRender = this.wrapRender.bind(this);
  }

  componentDidMount() {
    this.getData();
    this.socketio = io.connect(`${process.env.SIO_HOST}/socketio/hrs_operation`, {
      transports: ['polling'],
    });

    this.socketio.on('connect', () => {
      this.socketio.emit('request_online_list');
    });

    this.socketio.on('online_list', (onlineUserIds) => {
      // const preOnlineUserIds = this.props.onlineUserIds.sort();
      // const newOnlineUserIds = onlineUserIds.sort();

      // if (!R.equals(preOnlineUserIds, newOnlineUserIds)) {
      //   this.getData();
      // }
      this.props.receiveOnlineUserIds(onlineUserIds);
    });
    this.props.requestTagsMapping();
  }

  componentWillUnmount() {
    this.socketio.disconnect();
  }

  getData() {
    this.props.getAdminTasks();
    this.props.getAllUsers();
    this.props.getAllVideos();
  }

  wrapRender(Component) {
    const addProps = { getData: this.getData };
    return withProps(addProps)(Component);
  }

  render() {
    const { match } = this.props;
    return (
      <div styleName="container">
        <div styleName="left">
          <Sidebar
            pathname={this.props.location.pathname}
            getData={this.getData}
          />
        </div>
        <div styleName="right">
          <Switch>
            <Route exact path={`${match.url}/system`} component={SystemContainer} />
            <Route exact path={`${match.url}/episode`} render={this.wrapRender(EpisodeContainer)} />
            <Route exact path={`${match.url}/member`} render={this.wrapRender(MemberContainer)} />
            <Route exact path={`${match.url}/member/:uid`} component={OneMemberContainer} />
            <Route exact path={`${match.url}/episode/:videoId`} render={this.wrapRender(OneEpisodeContainer)} />
            <Route exact path={`${match.url}`} component={HrsMonitorContainer} />
            <Redirect to={`${match.url}`} />
          </Switch>
        </div>
      </div>
    );
  }
}

AdminApp.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  getAdminTasks: PropTypes.func,
  getAllUsers: PropTypes.func,
  getAllVideos: PropTypes.func,
  requestTagsMapping: PropTypes.func,
  receiveOnlineUserIds: PropTypes.func,
  onlineUserIds: PropTypes.arrayOf(PropTypes.number),
};

export default CSSModules(AdminApp, styles);
