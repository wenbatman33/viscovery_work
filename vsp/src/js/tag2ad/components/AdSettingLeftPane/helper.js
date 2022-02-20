import {
  getFilterById,
  getFilterOption,
} from '../../utils';


export const isChanceConfigValid = chanceConfig => (
  !chanceConfig || Object.values(chanceConfig.valid).every(valid => valid === true)
);

export const getFilterOptionsByIDs = (filters, filterIDs, userId) => {
  const selectedFilters = filterIDs.map(id => getFilterById(filters, id));
  return selectedFilters.map(f => getFilterOption(f, userId));
};

export const myFilterOption = filterOption => filterOption.creator === true;

export const groupFilterOption = filterOption => filterOption.creator === false;
