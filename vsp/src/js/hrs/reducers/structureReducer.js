import * as types from '../actions/types';

const initialState = {
  models: {
    1: {
      name: 'face',
      classes: [0],
    },
    6: {
      name: 'object',
      classes: [1],
    },
    7: {
      name: 'scene',
      classes: [2],
    },
  },
  classes: {
    0: {
      name: '汽車',
      brands: [0, 1],
    },
    1: {
      name: '家具',
      brands: [2, 3],
    },
    2: {
      id: 2,
      name: '書籍',
      brands: [4, 5],
    },
  },
  brands: {
    0: {
      name: '汽車',
    },
    1: {
      name: 'TOYOTA',
    },
    2: {
      name: '家具',
    },
    3: {
      name: '花瓶',
    },
    4: {
      name: '書籍',
    },
    5: {
      name: '平裝書',
    },
  },
  brandsForBrandEditor: {
    0: {
      name: '汽車',
    },
    1: {
      name: 'TOYOTA',
    },
    2: {
      name: '家具',
    },
    3: {
      name: '花瓶',
    },
    4: {
      name: '書籍',
    },
    5: {
      name: '平裝書',
    },
  },
  classesForBrandEditorInUse: {
    1: {
      name: '汽車',
    },
  },
  brandsForBrandEditorInUse: {
    1: {
      name: '汽車',
    },
  },
};

const filterInUse = (dict) => {
  const reduced = Object.keys(dict).reduce((pV, cV) => {
    if (dict[cV].in_use === 0) return pV;

    return {
      ...pV,
      [cV]: dict[cV],
    };
  }, {});
  return reduced;
};

const structureReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_TAGS_MAPPING: {
      const {
        models,
        classes,
        brands,
        brandsForBrandEditor,
      } = action.tagsMapping;
      return {
        ...state,
        models,
        classes,
        brands,
        classesForBrandEditorInUse: filterInUse(classes),
        brandsForBrandEditorInUse: filterInUse(brandsForBrandEditor),
      };
    }
    default:
      return state;
  }
};

export default structureReducer;
