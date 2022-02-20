import R from 'ramda';

const advancedConfigKeyMapping = {
  hrs: 'hrs',
  playViews: 'views',
  genre: 'genre',
  runningTime: 'duration',
  videoYear: 'year',
};

export const mapAdvancedFilterKey = R.compose(
  R.reduce(
    (pO, [cK, cV]) => (
      {
        ...pO,
        [advancedConfigKeyMapping[cK]]: cV,
      }
    ),
    {}
  ),
  R.toPairs
);
