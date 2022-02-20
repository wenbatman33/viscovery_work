import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { Interpolate, translate } from 'react-i18next';

import { Button } from 'vidya/Button';

import { NAME } from '../../../../constants';
import styles from './DuplicateBrandsForm.scss';

const CountComponent = CSSModules(({ count }) => (
  <span style={{ color: '#E24522' }}>{count}</span>
), styles);

class DuplicateBrandsForm extends React.Component {
  render() {
    const { t } = this.props;
    const { duplicateBrands } = this.props;
    const uploadDupCountComponent = <CountComponent count={duplicateBrands.length} />;

    return (
      <div styleName="dup-brands-form-container">
        <h2 styleName="dup-brands-title">
          <Interpolate i18nKey="uploadDupBrandMsg" dupCount={uploadDupCountComponent} />
        </h2>
        <div styleName="table-container">
          <table styleName="dup-brands-table">
            <thead styleName="dup-brands-thead">
              <tr>
                <th />
                <th>Class{t('brandLocales')}</th>
                <th>Brand{t('brandLocales')}</th>
                <th>{t('vspId')}</th>
                <th>{t('memo')}</th>
              </tr>
            </thead>
            <tbody styleName="dup-brands-tbody">
              {
                duplicateBrands.map((duplicateBrand, index) => (
                  <tr
                    key={duplicateBrand.vsp_id}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <div>{ duplicateBrand.class_name_zh_tw }</div>
                      <div>{ duplicateBrand.class_name_en_us }</div>
                      <div>{ duplicateBrand.class_name_zh_cn }</div>
                    </td>
                    <td>
                      <div>{ duplicateBrand.brand_name_zh_tw }</div>
                      <div>{ duplicateBrand.brand_name_en_us }</div>
                      <div>{ duplicateBrand.brand_name_zh_cn }</div>
                    </td>
                    <td>{ duplicateBrand.vsp_id }</td>
                    <td>{ duplicateBrand.memo }</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <Button vdStyle="secondary" style={{ width: '360px', marginTop: '32px' }} onClick={this.props.onClickOkay}>
          {t('okay')}
        </Button>
      </div>
    );
  }
}

DuplicateBrandsForm.propTypes = {
  t: PropTypes.func,
  duplicateBrands: PropTypes.arrayOf(PropTypes.shape({
    vsp_id: PropTypes.string,
  })),
  onClickOkay: PropTypes.func,
};

export default new translate([NAME])(CSSModules(DuplicateBrandsForm, styles));
