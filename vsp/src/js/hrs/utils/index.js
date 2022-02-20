export const genResult = (status, newBrandId) => {
  if (status === 3 && newBrandId !== undefined) {
    return {
      status,
      new_brand_id: newBrandId,
    };
  }
  return {
    status,
  };
};

export const categorizeArray = key => arr =>
  arr.reduce(
    (pV, cV) => {
      if (!(key in cV)) {
        cV[key] = 'others'; // eslint-disable-line no-param-reassign
      }
      if (cV[key] in pV) {
        return {
          ...pV,
          [cV[key]]: [...pV[cV[key]], cV],
        };
      }
      return {
        ...pV,
        [cV[key]]: [cV],
      };
    },
    {}
  );

export const isHrsDisptach = user => user.permissions.find(permission => permission.mpids.includes('/hrs/dispatch'));

export const combineModelIdBrandId = modelId => brandId =>
  ((modelId && brandId) ? `${modelId}-${brandId}`.toLowerCase() : '');

export const transferDict = dict =>
  Object.keys(dict).reduce((pV, cV) => {
    const result = pV;
    result[combineModelIdBrandId(dict[cV].model_id)(dict[cV].name)] = dict[cV];
    return result;
  }, {});
