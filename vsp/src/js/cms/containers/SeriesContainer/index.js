import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Button } from 'vidya/Button';
import { Modal } from 'vidya/Dialogs';
import { routerUtil } from 'utils';
import {
  prepareUploadWithRecognition,
  processSeriesCreation,
  processSeriesList,
  processSeriesRemoval,
  processSeriesUpdate,
  reqCountryList,
} from '../../actions';
import { SeriesForm, SeriesList, SeriesRemoveForm } from '../../components';
import { NAME } from '../../constants';
import { getCountries, getSeries } from '../../selectors';
import { getUploadEnabled } from '../../../auth/selectors';

import styles from './styles.scss';

class SeriesContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    countries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    series: PropTypes.arrayOf(
      PropTypes.shape({
        series_id: PropTypes.number,
        series_name: PropTypes.string.isRequired,
        is_default: PropTypes.number,
        summary: PropTypes.shape({
          total: PropTypes.number.isRequired,
        }).isRequired,
      })
    ).isRequired,
    uploadEnabled: PropTypes.number.isRequired,
  };

  componentDidMount() {
    let action = reqCountryList();
    this.props.dispatch(action);
    action = processSeriesList();
    this.props.dispatch(action);
  }

  handleFormShow = (event, series) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const form = (
      <SeriesForm
        countries={this.props.countries}
        uploadEnabled={!!this.props.uploadEnabled}
        series={series}
        onCancel={this.handleFormCancel}
        onSubmit={this.handleFormSubmit}
      />
    );
    this.form.switchContent(form);
    this.form.toShow();
  };

  handleFormCancel = () => {
    this.form.toHide();
  };

  handleFormSubmit = (name, aliases, countryId, series, modelIds, faceModel) => {
    const update = series && !Array.isArray(series);
    if (update) {
      const action = processSeriesUpdate(series, name, aliases, countryId);
      this.props.dispatch(action);
    } else {
      let action = processSeriesCreation(name, aliases, countryId);
      const promise = this.props.dispatch(action);
      if (series) {
        const files = series;
        promise.then((s) => {
          for (const file of files) {
            action = prepareUploadWithRecognition(file, s.series_id, modelIds, faceModel);
            this.props.dispatch(action);
          }
        });
      }
    }

    this.form.toHide();
  };

  handleSelect = (id) => {
    routerUtil.pushHistory(`/${NAME}/series/${id}`);
  };

  handleUpdate = (id) => {
    const series = this.props.series.find(s => s.series_id === id);
    if (series) {
      this.handleFormShow(null, series);
    }
  };

  handleDelete = (id) => {
    const series = this.props.series.find(s => s.series_id === id);
    const confirmation = (
      <SeriesRemoveForm
        series={series}
        onCancel={() => this.form.toHide()}
        onDelete={() => this.doDelete(series)}
      />
    );

    this.form.switchContent(confirmation);
    this.form.toShow();
  };

  doDelete = (series) => {
    this.form.toHide();
    if (series) {
      const action = processSeriesRemoval(series);
      this.props.dispatch(action);
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div styleName="container">
        <Modal headerHide hideWhenBackground ref={(node) => { this.form = node; }} />
        <Button
          vdSize="normal"
          vdStyle="secondary"
          onClick={event => this.handleFormShow(event, null)}
        >
          {t('createFolder')}
        </Button>
        <SeriesList
          series={this.props.series}
          onSelect={this.handleSelect}
          onUpdate={this.handleUpdate}
          onDelete={this.handleDelete}
        />
      </div>
    );
  }
}

export default translate([NAME])(connect(
  createStructuredSelector({
    countries: getCountries,
    series: getSeries,
    uploadEnabled: getUploadEnabled,
  })
)(CSSModules(SeriesContainer, styles)));

