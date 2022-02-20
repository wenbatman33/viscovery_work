/**
 * Created by amdis on 2017/7/25.
 */
export const responseDictToOptions = (dict) => {
  if (!dict) {
    return [];
  }

  return Object.keys(dict).map(key => (
    {
      label: dict[key],
      value: key,
    }
  ));
};
