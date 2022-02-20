import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { Button } from 'vidya/Button';
import { NAME } from '../../constants';

import styles from './styles.scss';

class SeriesRemoveForm extends React.Component {
  state = {
    checked: false,
  };

  handleCheckBoxChange = () => {
    this.setState({ checked: !this.state.checked });
  };

  handleCancel = () => {
    this.props.onCancel();
    this.setState({ checked: false });
  };

  handleDelete = () => {
    this.props.onDelete();
    this.setState({ checked: false });
  };

  render() {
    const { series, t } = this.props;
    const { checked } = this.state;
    return (
      <div styleName="container">
        <div styleName="title"><h2>{t('deleteFolderTitle')}</h2></div>
        <div styleName="name"><h2>{series.series_name}</h2></div>
        <div styleName="description">{t('deleteFolderDetail')}</div>
        <div>
          <input type="checkbox" checked={checked} onChange={this.handleCheckBoxChange} />
          <span styleName="checkbox-text">{t('deleteFolderConfirmation')}</span>
        </div>
        <div styleName="buttons">
          <Button vdStyle={'secondary'} vdSize={'normal'} onClick={this.handleCancel}>
            {t('keep')}
          </Button>
          <Button vdStyle={'primary'} vdSize={'normal'} onClick={this.handleDelete} disable={!checked}>
            {t('delete')}
          </Button>
        </div>
      </div>
    );
  }
}

SeriesRemoveForm.propTypes = {
  t: PropTypes.func.isRequired,
  series: PropTypes.shape({
    series_id: PropTypes.number,
    series_name: PropTypes.string.isRequired,
    is_default: PropTypes.number,
  }),
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


export default translate([NAME])(CSSModules(SeriesRemoveForm, styles));
