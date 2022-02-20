export const arrayToObject = (key = 'id') => array => (
  array.reduce(
    (pV, cV) => (
      {
        ...pV,
        [cV[key]]: cV,
      }
    ),
    {}
  )
);

export const objectToArray = (key = 'id') => obj => (
  Object.keys(obj).map(k => (
    {
      ...obj[k],
      [key]: k,
    }
  ))
);

export const objectToForm = (jobsObj) => {
  const formData = new FormData();
  Object.keys(jobsObj).forEach((key) => {
    formData.append(key, jobsObj[key]);
  });

  return formData;
};
