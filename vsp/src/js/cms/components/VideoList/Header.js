import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { NAME } from '../../constants';

import styles from './styles.scss';

class Header extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,
    onChange: PropTypes.func,
  };

  state = {
    checked: this.props.checked,
    indeterminate: this.props.indeterminate,
  };

  componentDidMount() {
    const { indeterminate } = this.state;
    this.checkbox.indeterminate = indeterminate;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.checked,
      indeterminate: nextProps.indeterminate,
    });
  }

  componentDidUpdate() {
    const { indeterminate } = this.state;
    this.checkbox.indeterminate = indeterminate;
  }

  handleChange = (event) => {
    this.setState({
      checked: event.target.checked,
      indeterminate: false,
    });

    const { onChange } = this.props;
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  render() {
    const { t } = this.props;
    const { checked } = this.state;
    return (
      <div styleName="header">
        <div styleName="checkbox">
          <input type="checkbox" ref={(node) => { this.checkbox = node; }} checked={checked} onChange={this.handleChange} />
        </div>
        <div styleName="thumbnail" />
        <div styleName="name">{t('videoTitle')}</div>
        <div styleName="status">{t('videoStatus')}</div>
        <div styleName="report">{t('videoReport')}</div>
        <div styleName="uploader">{t('videoUploader')}</div>
        <div styleName="action" />
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(Header, styles));
