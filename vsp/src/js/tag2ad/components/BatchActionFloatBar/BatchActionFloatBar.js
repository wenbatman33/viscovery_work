import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'vidya/Button';
import CSSModules from 'react-css-modules';
import { translate, Interpolate } from 'react-i18next';
import BatchAdvertisingDialog from './BatchAdvertisingDialog';

import styles from './BatchActionFloatBar.scss';

import { NAME } from '../../constants';

const getDefaultState = () => ({
  showDialog: false,
  formOption: null,
  categoryOption: null,
});

const AdCountComponent = CSSModules(({ adNumber }) => (
  <span styleName="number">{adNumber}</span>
), styles);

class BatchActionFloatBar extends React.PureComponent {
  state = getDefaultState(this.props);

  render() {
    const props = this.props;
    const adTotal = <AdCountComponent adNumber={props.adNumber} />;
    return (
      <div styleName="container">
        <div styleName="description">
          <Interpolate i18nKey="adPointsAreSelected" total={adTotal} />
        </div>
        <div>
          <Button
            vdStyle={'secondary'}
            onClick={props.onCancelSelect}
          >
            {props.t('cancelSelected')}
          </Button>
          {
            props.hideDelete ?
            null :
            <Button
              vdStyle={'secondary'}
              onClick={props.onDelete}
            >
              {props.t('delete')}
            </Button>
          }
          {
            props.showReport ?
              <Button
                vdStyle={'secondary'}
                onClick={props.onReport}
              >
                {props.t('reportWrongTags')}
              </Button>
              : null
          }
          <Button
            vdStyle={'secondary'}
            onClick={() => { this.setState({ showDialog: true }); }}
          >
            {props.t('batchManage')}
          </Button>
          {
            props.showExport ?
              <Button
                vdStyle={'secondary'}
                onClick={props.onExport}
              >
                {props.t('publishAdPod')}
              </Button>
              :
              null
          }
          {
            props.hideDownload ?
              null :
              <Button
                vdStyle={'secondary'}
                onClick={props.onDownload}
              >
                {props.t('downloadAdPod')}
              </Button>
          }
        </div>
        { this.state.showDialog ?
          <BatchAdvertisingDialog
            categories={props.adCategories}
            categoryOption={this.state.categoryOption}
            forms={props.adForms}
            formOption={this.state.formOption}
            onCancel={() => {
              this.setState(getDefaultState(this.props));
            }}
            onSave={() => {
              props.onBatchUpdate(this.state.categoryOption.value, this.state.formOption.value);
            }}
            t={props.t}
            onCategoryChange={(option) => {
              this.setState({ categoryOption: option });
            }}
            onFormChange={(option) => {
              this.setState({ formOption: option });
            }}
            locale={this.props.locale}
          /> :
          <span />
        }
      </div>
    );
  }
}

BatchActionFloatBar.propTypes = {
  adNumber: PropTypes.number.isRequired,
  hideDelete: PropTypes.bool,
  hideDownload: PropTypes.bool,
  onCancelSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onDownload: PropTypes.func,
  onBatchUpdate: PropTypes.func,
  t: PropTypes.func,
  adCategories: PropTypes.array.isRequired,
  adForms: PropTypes.array.isRequired,
  defaultCategory: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  locale: PropTypes.string,
  showExport: PropTypes.bool,
  showReport: PropTypes.bool,
  onExport: PropTypes.func,
  onReport: PropTypes.func,
};

const localize = component => translate([NAME])(component);

export default localize(CSSModules(BatchActionFloatBar, styles));
