import React from 'react';
import PropTypes from 'prop-types';
import { Interpolate } from 'react-i18next';

import { helper } from '../AdChanceConfig';
import { localize } from '../../utils';
import { AD_CHANCE_SPACE_UNIT as UNIT_OPTIONS } from '../../constants';


class ChanceConfigContent extends React.PureComponent {

  render() {
    const { chanceConfig } = this.props;
    return (
      <div
        style={{
          fontSize: '14px',
          color: 'rgba(26, 10, 10, 0.5)',
        }}
      >
        {
          !helper.isIntervalEmpty(chanceConfig) ?
            <div>
              <Interpolate i18nKey="chanceInterval" second={chanceConfig.interval} />
            </div>
            :
          null
        }
        {
          !helper.isLimitEmpty(chanceConfig) ?
            <div>
              <Interpolate i18nKey="maxChanceNum" limit={chanceConfig.limit} />
            </div>
          :
          null
        }
        {
          !helper.isDurationStartEmpty(chanceConfig) ?
            <div>
              <Interpolate
                i18nKey={chanceConfig.duration.unit === UNIT_OPTIONS.TIME ? 'chanceDSInMinute' : 'chanceDSInPercent'}
                number={chanceConfig.duration.start}
              />
            </div>
            :
          null
        }
        {
          !helper.isDurationEndEmpty(chanceConfig) ?
            <div>
              <Interpolate
                i18nKey={chanceConfig.duration.unit === UNIT_OPTIONS.TIME ? 'chanceDEInMinute' : 'chanceDEInPercent'}
                number={chanceConfig.duration.end}
              />
            </div>
          :
          null
        }
      </div>
    );
  }
}

ChanceConfigContent.propTypes = {
  chanceConfig: PropTypes.object,
  t: PropTypes.func,
};


export default localize(ChanceConfigContent);
