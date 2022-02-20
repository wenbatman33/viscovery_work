import React, { PureComponent } from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';

import { debounce } from 'utils/streamUtil';

import Button from 'vidya/Button/Button';

import styles from './AdvancedFilter.scss';

import OptionsArea from './OptionsArea';

import { localize } from '../../utils';


class AdvancedFilter extends PureComponent {
  componentDidMount() {
    this.props.getAdvancedOptions();
  }

  setAdvancedValues = key => (...params) => {
    this.props.setAdvancedValues(key)(...params);
    this.debounceSubmit();
  }

  submit = () =>
    this.props.submit(this.props.filterValues)

  debounceSubmit = debounce(
    this.submit,
    1000
  )

  clearFilter = () => {
    this.props.setAdvancedValues('hrs')([]);
    this.props.setAdvancedValues('playViews')([]);
    this.props.setAdvancedValues('genre')([]);
    this.props.setAdvancedValues('runningTime')([]);
    this.props.setAdvancedValues('videoYear')([]);

    return this.props.submit({});
  }

  render() {
    const {
      t,
      hrsOptions,
      playViewsOptions,
      genreOptions,
      runningTimeOptions,
      videoYearOptions,
      hrsValues,
      playViewsValues,
      genreValues,
      runningTimeValues,
      videoYearValues,
    } = this.props;

    return (
      <div
        styleName="container"
      >
        <OptionsArea
          options={hrsOptions}
          optionTitle={t('filter_by_hrs')}
          onChange={this.setAdvancedValues('hrs')}
          values={hrsValues}
        />
        <OptionsArea
          options={playViewsOptions}
          optionTitle={t('filter_by_play_views')}
          onChange={this.setAdvancedValues('playViews')}
          values={playViewsValues}
        />
        <OptionsArea
          options={genreOptions}
          optionTitle={t('filter_by_genre')}
          onChange={this.setAdvancedValues('genre')}
          values={genreValues}
        />
        <OptionsArea
          options={runningTimeOptions}
          optionTitle={t('filter_by_running_time')}
          onChange={this.setAdvancedValues('runningTime')}
          values={runningTimeValues}
        />
        <OptionsArea
          options={videoYearOptions}
          optionTitle={t('filter_by_video_year')}
          onChange={this.setAdvancedValues('videoYear')}
          values={videoYearValues}
        />
        <section
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '40px',
            marginBottom: '27px',
            padding: '0 16px',
          }}
        >
          <Button
            vdStyle={'secondary'}
            vdSize={'normal'}
            onClick={this.clearFilter}
          >
            {t('clear_filter')}
          </Button>
          {/* <Button
            vdStyle={'primary'}
            vdSize={'normal'}
            onClick={() => (
              submit()
                .then(close)
            )}
            style={{
              marginLeft: '10px',
            }}
          >
            {t('confirm')}
          </Button> */}
        </section>
      </div>
    );
  }
}

AdvancedFilter.propTypes = {
  t: PropTypes.func,
  genreOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    text: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  })),
  playViewsOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    text: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  })),
  videoYearOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    text: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  })),
  runningTimeOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    text: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  })),
  hrsOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    text: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  })),
  genreValues: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  playViewsValues: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  videoYearValues: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  runningTimeValues: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  hrsValues: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  getAdvancedOptions: PropTypes.func,
  setAdvancedValues: PropTypes.func,
  close: PropTypes.func,
  submit: PropTypes.func,
  filterValues: PropTypes.object,
};

export default localize(CSSModules(AdvancedFilter, styles));
