import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { Interpolate, translate } from 'react-i18next';

import { NAME } from '../../../constants';
import styles from './WarningArea.scss';

const isBrandFailed = (addBrandFailedList, editBrandFailedList) =>
  (addBrandFailedList && addBrandFailedList.length > 0) ||
    (editBrandFailedList && editBrandFailedList.length > 0);

const getRenderVars = (addBrandFailedList, editBrandFailedList) => {
  if (!isBrandFailed(addBrandFailedList, editBrandFailedList)) {
    return { modalAction: null, failedBrandList: [] };
  }

  const modalAction = addBrandFailedList && addBrandFailedList.length > 0 ? 'add' : 'edit';
  const failedBrandList = addBrandFailedList && addBrandFailedList.length > 0 ?
                            addBrandFailedList :
                            editBrandFailedList;

  return { modalAction, failedBrandList };
};

class WarningArea extends React.Component {
  render() {
    const { t } = this.props;
    const { addBrandFailedList, editBrandFailedList } = this.props;
    const { modalAction, failedBrandList } = getRenderVars(addBrandFailedList, editBrandFailedList);

    return (
      <div>
        <div styleName={`${isBrandFailed(addBrandFailedList, editBrandFailedList) ? 'add-brand-failed' : 'hide-add-failed'}`}>
          <i className="fa fa-exclamation" styleName="warning-icon" aria-hidden="true" />
          <p>
            <Interpolate
              i18nKey="dupBrandMsg"
              modalAction={t(modalAction)}
              dupBrandId={failedBrandList.map((brandItem, index) => {
                if (index > 0) {
                  return `, ${brandItem.vsp_id}`;
                }
                return brandItem.vsp_id;
              })}
            />
          </p>
        </div>
        <table styleName="dup-brands-table">
          <tbody styleName="dup-brands-tbody">
            {
              failedBrandList.map((failedBrand, index) => (
                <tr
                  key={failedBrand.vsp_id}
                >
                  <td>{index + 1}</td>
                  <td>
                    <div>{ failedBrand.class_name_zh_tw }</div>
                    <div>{ failedBrand.class_name_en_us }</div>
                    <div>{ failedBrand.class_name_zh_cn }</div>
                  </td>
                  <td>
                    <div>{ failedBrand.brand_name_zh_tw }</div>
                    <div>{ failedBrand.brand_name_en_us }</div>
                    <div>{ failedBrand.brand_name_zh_cn }</div>
                  </td>
                  <td>{ failedBrand.vsp_id }</td>
                  <td>{ failedBrand.memo }</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

WarningArea.propTypes = {
  t: PropTypes.func,
  addBrandFailedList: PropTypes.arrayOf(PropTypes.shape({
    vsp_id: PropTypes.string,
  })),
  editBrandFailedList: PropTypes.arrayOf(PropTypes.shape({
    vsp_id: PropTypes.string,
  })),
};

export default new translate([NAME])(CSSModules(WarningArea, styles));
