import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import { ListView } from 'vidya';
import { Button } from 'vidya/Button';
import FileItem from './FileItem';
import { NAME } from '../../constants';

import styles from './styles.scss';

class MoveVideoForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: -1, // selected video id
    };
  }

  showList = () => {
    const items = this.props.series.map(series =>
      <FileItem
        series={series}
        selected={series.series_id === this.state.selected}
        onSelect={() => this.setState({ selected: series.series_id })}
      />
    );

    return <ListView divider elements={items} />;
  };

  handleSubmit = () => {
    const { series } = this.props;
    const { selected } = this.state;
    if (this.props.onSubmit) {
      const folder = series.find(s => s.series_id === selected);
      this.props.onSubmit(folder);
    }
    this.resetSelected();
  };

  handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }

    this.resetSelected();
  };

  resetSelected = () => {
    this.setState({
      selected: -1,
    });
  };

  render() {
    const { t } = this.props;
    return (
      <div styleName="container">
        <h3 styleName="header">{t('moveVideo')}</h3>
        <p styleName="sub-header">{t('chooseFolder')}</p>
        <div styleName="list">{this.showList()}</div>
        <div styleName="control-btn-group">
          <Button
            vdStyle={'secondary'}
            vdSize={'normal'}
            onClick={this.handleCancel}
          >
            {t('cancel')}
          </Button>
          <Button
            vdStyle={'primary'}
            vdSize={'normal'}
            disable={this.state.selected < 0}
            onClick={this.handleSubmit}
          >
            {t('submit')}
          </Button>
        </div>
      </div>
    );
  }
}

MoveVideoForm.propTypes = {
  t: PropTypes.func.isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      series_id: PropTypes.number,
      series_name: PropTypes.string.isRequired,
      is_default: PropTypes.number,
      summary: PropTypes.shape({
        total: PropTypes.number.isRequired,
      }),
    })
  ).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default translate([NAME])(CSSModules(MoveVideoForm, styles));
