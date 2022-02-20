import { expect } from 'chai';
import { describe, it } from 'mocha';

import reducer from '../reducer';
import * as types from '../types';
import Filter from '../models/Filter';

describe('Tag2Ad reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(
      {
        models: [],
        classes: [],
        brands: [],
        briefResults: [],
        sharedFilters: [],
        customFilters: [],
        filter: null,
        series: [],
        seriesIds: [],
        errorMessage: '',
        adForms: [],
        adCategories: [],
        briefSearchEmpty: false,
        ratios: [],
        tags: [],
        tag_brands: [],
        ad_search_total: 0,
      }
    );
  });

  it(`handle action ${types.RECEIVE_AD_FORMS}`, () => {
    const forms = [
      {
        id: 1,
        name: 'cornor1',
      },
      {
        id: 2,
        name: 'cornor2',
      },
    ];

    const nextState = reducer(
      undefined,
      {
        type: types.RECEIVE_AD_FORMS,
        adForms: forms,
      }
    );
    expect(nextState.adForms).to.equal(forms);
  });

  it(`handle action ${types.RECEIVE_AD_CATEGORIES}`, () => {
    const data = [
      {
        id: 1,
        name: 'Automobile',
      },
      {
        id: 2,
        name: 'Cosmetics',
      },
    ];

    const nextState = reducer(
      undefined,
      {
        type: types.RECEIVE_AD_CATEGORIES,
        categories: data,
      }
    );

    expect(nextState.adCategories).to.equal(data);
  });

  it(`handle action ${types.RECEIVE_RATIO_LIST}`, () => {
    const data = [
      {
        level: 0,
        name: 'non-limit',
      },
      {
        level: 1,
        name: 'full shot',
      },
      {
        level: 2,
        name: 'medium shot',
      },
    ];

    const nextState = reducer(
      undefined,
      {
        type: types.RECEIVE_RATIO_LIST,
        ratios: data,
      }
    );
    expect(nextState.ratios).to.equal(data);
  });

  describe('Filter operations, ', () => {
    const filter1 = new Filter({
      filter_id: '5881d0dfee9dcf002f2856d9',
      filter_name: 'Christmas',
    });

    const filter2 = new Filter({
      filter_id: '5881d0dfee9dcf002f285483',
      filter_name: "St. Patrick's Day",
    });

    const filter3 = new Filter({
      filter_id: '283740dfee9dcf002f285483',
      filter_name: 'Extreme sports',
    });

    it(`handle action ${types.CREATE_FILTER_SUCCESS}`, () => {
      const state1 = reducer(undefined,
        {
          type: types.CREATE_FILTER_SUCCESS,
          filter: filter1,
        }
      );

      expect(state1.customFilters).to.deep.equal([filter1]);
      expect(state1.filter).to.equal(filter1);

      const state2 = reducer(state1,
        {
          type: types.CREATE_FILTER_SUCCESS,
          filter: filter2,
        },
      );

      expect(state2.customFilters).to.deep.equal(
        [
          filter1,
          filter2,
        ]
      );
      expect(state2.filter).to.equal(filter2);
    });

    // update filter by filter id
    it(`handle action ${types.UPDATE_FILTER_SUCCESS}`, () => {
      const newFilter = filter2.clone().name(filter3.name());

      const nextState = reducer(
        {
          customFilters: [filter1, filter2],
        },
        {
          type: types.UPDATE_FILTER_SUCCESS,
          id: filter2.id(),
          filter: newFilter,
        }
      );

      expect(nextState.customFilters).to.have.lengthOf(2);
      expect(nextState.customFilters[1]).to.equal(newFilter);
      expect(nextState.filter).to.equal(newFilter);
    });

    it(`handle action ${types.DELETE_FILTER_SUCCESS}`, () => {
      const filters = [filter1, filter2, filter3];
      const initState = { customFilters: filters };

      // case #1 , delete first item
      let nextState = reducer(
        initState,
        {
          type: types.DELETE_FILTER_SUCCESS,
          id: filter1.id(),
        }
      );

      expect(nextState.customFilters).to.deep.equal([filter2, filter3]);

      // case #2 , delete middle item
      nextState = reducer(
        initState,
        {
          type: types.DELETE_FILTER_SUCCESS,
          id: filter2.id(),
        }
      );

      expect(nextState.customFilters).to.deep.equal([filter1, filter3]);

      // case #3, delete last item

      nextState = reducer(
        initState,
        {
          type: types.DELETE_FILTER_SUCCESS,
          id: filter3.id(),
        }
      );
      expect(nextState.customFilters).to.deep.equal([filter1, filter2]);
    });
    it(`handle action ${types.CLEAR_CUR_FILTER}`, () => {
      const nextState = reducer(
        {
          filter: filter2,
        },
        {
          type: types.CLEAR_CUR_FILTER,
        }
      );

      expect(nextState.filter).to.be.null;
    });

    it(`handle action ${types.SET_FILTER}`, () => {
      const nextState = reducer(
        {
          filter: filter1,
        },
        {
          type: types.SET_FILTER,
          filter: filter2,
        }
      );

      expect(nextState.filter).to.equal(filter2);
    });

    it(`handle action ${types.RECEIVE_FILTER_LIST}`, () => {
      const shared = [filter1, filter2, filter3];
      const custom = [filter3, filter2];
      const nextState = reducer(undefined,
        {
          type: types.RECEIVE_FILTER_LIST,
          sharedFilters: shared,
          customFilters: custom,
        }
      );

      expect(nextState.sharedFilters).to.equal(shared);
      expect(nextState.customFilters).to.equal(custom);
    });
  });

  it(`handle action ${types.RECEIVE_TAGS}`, () => {
    const brands = [
      {
        id: 3,
        in_use: 1,
        ipt_testing: 0,
        ipt_training: 0,
        memo: null,
        name: 'chen-hao-min',
        name_zh_cn: '陈浩民',
        name_zh_tw: '陳浩民',
        vcms_id: '100010000-914',
        vsp_id: 'F-26-3',
      },
      {
        id: 13,
        in_use: 1,
        ipt_testing: 0,
        ipt_training: 0,
        memo: null,
        name: 'TESTS',
        name_zh_cn: 'TESTS',
        name_zh_tw: 'TESTS',
        vcms_id: '100010000-888',
        vsp_id: 'F-26-6',
      },
    ];
    const data = [
      {
        classes: [
          {
            brands: [
              brands[0],
            ],
            create_time: '2016-12-02 17:02:08',
            id: 26,
            in_use: 1,
            name: 'celebrityface',
            name_zh_cn: '名人人脸',
            name_zh_tw: '名人人臉',
          },
          {
            brands: [
              brands[1],
            ],
            create_time: '2016-12-02 17:02:08',
            id: 55,
            in_use: 1,
            name: 'Car',
            name_zh_cn: '車',
            name_zh_tw: '車',
          },
        ],
        id: 1,
        name: 'face',
      },
    ];

    const nextState = reducer(
      undefined,
      {
        type: types.RECEIVE_TAGS,
        payload: data,
      }
    );

    expect(nextState.tags).to.equal(data);
    expect(nextState.tag_brands).to.have.lengthOf(2);
    expect(nextState.tag_brands).to.deep.equal(brands);
  });

  it(`handle action ${types.RECEIVE_BRIEF_RESULT_LIST}`, () => {
    const result = [
      {
        end: 69301,
        start: 1476,
        tags: [
          931,
        ],
      },
      {
        end: 1000,
        start: 500,
        tags: [
          500, 400,
        ],
      },
    ];
    const seriesIds = [11, 22, 33];
    const filter = new Filter();
    filter.id('43274927392');
    filter.name('whack-a-mole');
    const total = 110;

    const state1 = reducer(
      undefined,
      {
        results: result,
        type: types.RECEIVE_BRIEF_RESULT_LIST,
        seriesIds,
        filter,
        total,
      }
    );

    expect(state1.briefResults).to.equal(result);
    expect(state1.seriesIds).to.equal(seriesIds);
    expect(state1.filter).to.equal(filter);
    expect(state1.ad_search_total).to.equal(total);
    expect(state1.briefSearchEmpty).to.be.false;

    const state2 = reducer(
      state1,
      {
        results: [],
        type: types.RECEIVE_BRIEF_RESULT_LIST,
        seriesIds,
        filter,
        total: 0,
      }
    );

    expect(state2.briefResults).to.have.lengthOf(0);
    expect(state2.ad_search_total).to.equal(0);
    expect(state2.briefSearchEmpty).to.be.true;
  });
});
