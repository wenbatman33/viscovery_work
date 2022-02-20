import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { Button } from 'vidya/Button';

import { routerUtil } from 'utils';
import { NAME } from '../../constants';

import DateBubble from './DateBubble';

import styles from './row.scss';

class Row extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateStatus: 1,
    };

    if (Date.parse(props.data.start_time) > Date.now() &&
      Date.parse(props.data.expire_time) > Date.now()) {
      this.state = {
        dateStatus: 0,
      };
    } else if (Date.parse(this.props.data.start_time) < Date.now() &&
      Date.parse(this.props.data.expire_time) < Date.now()) {
      this.state = {
        dateStatus: 2,
      };
    } else {
      this.state = {
        dateStatus: 1,
      };
    }

    this.modifiedGroup = this.modifiedGroup.bind(this);
    this.dateShow = this.dateShow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (Date.parse(nextProps.data.start_time) > Date.now() &&
        Date.parse(nextProps.data.expire_time) > Date.now()) {
      this.setState({ dateStatus: 0 });
    } else if (Date.parse(nextProps.data.start_time) < Date.now() &&
      Date.parse(nextProps.data.expire_time) < Date.now()) {
      this.setState({ dateStatus: 2 });
    } else {
      this.setState({ dateStatus: 1 });
    }
  }

  dateShow() {
    const dateStatus = this.state.dateStatus;

    switch (dateStatus) {
      case 0:
        return (
          <DateBubble
            wording="尚未生效"
            startTime={this.props.data.start_time}
            endTime={this.props.data.expire_time}
          />
        );
      case 1:
        return (
          <div>
            <div styleName="subContent">{this.props.data.start_time}</div>
            <div styleName="subContent">|</div>
            <div styleName="subContent">{this.props.data.expire_time}</div>
          </div>
        );
      case 2:
        return (
          <DateBubble
            wording="已過期"
            startTime={this.props.data.start_time}
            endTime={this.props.data.expire_time}
          />
        );
      default:
        return null;
    }
  }

  modifiedGroup() {
    routerUtil.pushHistory(`/${NAME}/group/${this.props.data.id}`);
  }

  render() {
    let place = '';
    const { data } = this.props;
    if (this.props.countries.length !== 0 && data.country != null) {
      place = this.props.countries.find(country => country.id === Number(data.country));
    }
    return (
      <div styleName="container">
        <div styleName="name">{data.name}</div>
        <div styleName="maxUpload">{data.max_upload}</div>
        <div styleName="vip">
          {data.is_vip === 1 ? (<p styleName="wording">VIP</p>) : null}
        </div>
        <div styleName="hrs">
          {data.enable_hrs === 1 ? (<p styleName="wording">HRS</p>) : null}
        </div>
        <div styleName="members">
          <i className="fa fa-user-circle-o" aria-hidden="true">
            <span styleName="memberCount">
              {data.members.length}
            </span>
          </i>
        </div>
        <div styleName="validTime">
          {this.dateShow()}
        </div>
        <div styleName="creator">
          <div styleName="subContent">{data.creator}</div>
          <div styleName="subContent">{data.create_time}</div>
        </div>
        <div styleName="country">{place === null ? '' : place.country_zh_tw}</div>
        <div styleName="manipulate">
          <Button vdSize="function" vdStyle="secondary" onClick={this.modifiedGroup}>
            <i className="fa fa-cog" />
          </Button>
        </div>
      </div>
    );
  }
}

Row.propTypes = {
  countries: PropTypes.array,
  data: PropTypes.object,
};

export default CSSModules(Row, styles);
