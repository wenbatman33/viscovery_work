/**
 * Created by Amdis on 2016/12/1.
 */

import { LOCALE_EN_US, LOCALE_ZH_CN, LOCALE_ZH_TW } from '../../../app/constants';

export const extractTabGroupData = (reports, t) => {
  const tabsData = [];
  reports.forEach((report) => {
    const tab = {};
    tab.model_name = report.model_name[0].toUpperCase() + report.model_name.slice(1);
    tab.model_id = report.model_id;
    tabsData.push(tab);
  });
  tabsData.push({
    model_name: t('detailReport'),
    model_id: -1,
  });

  return tabsData;
};

// make the # of brands to be maximum 10 and sorted
export const reportToTableData = (report, locale) => {
  if (!report) {
    return [];
  }

  const tableData = Object.assign({}, report);
  tableData.tags = tableData.tags.slice();
  // sort tags in descending order
  tableData.tags.sort((a, b) => (
    a.tags_amount !== b.tags_amount
      ? b.tags_amount - a.tags_amount
      : a.brand_id - b.brand_id
  )).splice(10);
  return convertToLabelValue(tableData, locale);
};

// expected the report is processed to have ten tags at most
const convertToLabelValue = (report, locale) => {
  if (!report || report.length === 0) {
    return [];
  }

  const key = ((l) => {
    switch (l) {
      case LOCALE_ZH_CN:
        return 'brand_name_zh_cn';
      case LOCALE_ZH_TW:
        return 'brand_name_zh_tw';
      case LOCALE_EN_US:
      default:
        return 'brand_name';
    }
  })(locale);
  const result = [];
  report.tags.forEach((brand) => {
    const obj = {};
    obj.value = brand.tags_amount;
    obj.label = brand[key];

    result.push(obj);
  });

  return result;
};
