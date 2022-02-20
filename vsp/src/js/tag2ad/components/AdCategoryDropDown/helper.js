/**
 * Created by amdis on 2017/2/6.
 */

import {
  hasValue,
  findCategoryById,
} from '../../utils';

import { OPTIONS } from './AdCategoryDropDown';

export const toDropDownOptions = (categories, shared = true) => {
  if (!categories || categories.length < 1) { return []; }

  const list = categories.filter(c => c.isShared() === shared);
  return list.map(category => getOption(category));
};

export const getCategoryGroupByOption = (option, categories) => {
  if (hasValue(option) && hasValue(option.shared)) {
    return option.shared ? OPTIONS.DEFAULT : OPTIONS.CUSTOM;
  }

  if (!hasValue(option) || !hasValue(option.value)) {
    return OPTIONS.DEFAULT;
  }

  const category = findCategoryById(categories, option.value);

  return category.isShared() ? OPTIONS.DEFAULT : OPTIONS.CUSTOM;
};

const getOption = (category) => {
  if (!category) {
    return {
      label: 'Unknown',
      value: 'Unknown',
      shared: false,
    };
  }
  if (category.hasChildren()) {
    return {
      label: category.name(),
      value: category.id(),
      items: category.children().map(c => getOption(c)),
      shared: category.isShared(),
    };
  }
  return {
    label: category.name(),
    value: category.id(),
    shared: category.isShared(),
  };
};
