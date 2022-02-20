import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';

import Header from './Header';
import Tag from './Tag';
import Chart from '../RecognitionReport/DonutChart';
import { DONUT_COLORS, NAME } from '../../constants';
import { LOCALE_EN_US, LOCALE_ZH_CN, LOCALE_ZH_TW } from '../../../app/constants';

import styles from './styles.scss';

class TagChart extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    brands: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        frames: PropTypes.array.isRequired,
      })
    ).isRequired,
    locale: PropTypes.string,
  };

  static defaultProps = {
    brands: [],
  };

  render() {
    const { locale, t } = this.props;
    const key = ((l) => {
      switch (l) {
        case LOCALE_ZH_CN:
          return 'name_zh_cn';
        case LOCALE_ZH_TW:
          return 'name_zh_tw';
        case LOCALE_EN_US:
        default:
          return 'name';
      }
    })(locale);
    const brands = this.props.brands.map(brand => ({
      id: brand.id,
      label: brand[key],
      value: brand.frames.length,
    })).sort((a, b) => (a.value !== b.value ? b.value - a.value : a.id - b.id)).slice(0, 10);
    return (
      <div styleName="component">
        <div styleName="header">
          <Header />
        </div>
        <div styleName="body">
          <div styleName="tags">
            {brands.length
              ? brands.map((brand, index) => (
                <Tag
                  key={index}
                  color={DONUT_COLORS[(index + 1) % DONUT_COLORS.length]}
                  label={brand.label}
                  value={brand.value}
                />
              ))
              : t('tagsUnavailable')
            }
          </div>
          <div styleName="chart">
            <Chart innerRadius={72} outerRadius={96} data={brands} />
          </div>
        </div>
      </div>
    );
  }
}

export default translate([NAME])(CSSModules(TagChart, styles));
