import { expect } from 'chai';
import {
  mergeIndexList,
  videoFinder,
  reduceMergeDisabledList,
  flatSelectedChances,
  mapChancesToData,
} from './feedbackHrs';

describe('mergeIndexList testing', () => {
  it('merge for unique element list well', () => {
    const preList = [1, 2, 3];
    const list = [4, 5, 6];

    expect(mergeIndexList(preList)(list)).to.deep.equal([1, 2, 3, 4, 5, 6]);
  });

  it('merge and exclued duplicate value', () => {
    const preList = [1, 2, 3, 4];
    const list = [4, 5, 6];

    expect(mergeIndexList(preList)(list)).to.deep.equal([1, 2, 3, 4, 5, 6]);
  });
});

describe('videoFinder testing', () => {
  it('find the right video', () => {
    const videoId = 10;

    const item = {
      videoId: 10,
    };

    const finder = videoFinder(videoId);

    expect(finder(item)).to.be.true;
  });
});

describe('reduceMergeDisabledList testing', () => {
  it('reduce to get right merged result', () => {
    const preDisabledList = [
      {
        videoId: 1,
        index: [0, 1, 2],
      },
      {
        videoId: 3,
        index: [2, 3],
      },
    ];

    const disabledList = [
      {
        videoId: 1,
        index: [2, 3],
      },
      {
        videoId: 2,
        index: [0, 3, 5],
      },
      {
        videoId: 3,
        index: [4, 6],
      },
    ];

    const merged = [
      {
        videoId: 1,
        index: [0, 1, 2, 3],
      },
      {
        videoId: 2,
        index: [0, 3, 5],
      },
      {
        videoId: 3,
        index: [2, 3, 4, 6],
      },
    ];


    const actualValue = reduceMergeDisabledList(preDisabledList)(disabledList);

    expect(actualValue).to.have.lengthOf(merged.length);
    expect(actualValue).to.have.deep.members(merged);
  });
});

describe('flatSelectedChances testing', () => {
  const selectedValues = [
    {
      videoId: 0,
      index: [0, 1, 2],
    },
    {
      videoId: 1,
      index: [4, 9],
    },
    {
      videoId: 2,
      index: [1, 2],
    },
  ];

  it('flat well', () => {
    const expectValue = [
      {
        videoId: 0,
        index: 0,
      },
      {
        videoId: 0,
        index: 1,
      },
      {
        videoId: 0,
        index: 2,
      },
      {
        videoId: 1,
        index: 4,
      },
      {
        videoId: 1,
        index: 9,
      },
      {
        videoId: 2,
        index: 1,
      },
      {
        videoId: 2,
        index: 2,
      },
    ];

    expect(flatSelectedChances(selectedValues)).to.have.deep.members(expectValue);
  });
});

describe('mapChancesToData testing', () => {
  const videosDict = {
    1: {
      video_id: 1,
      chances: [
        {
          start: 0,
          end: 3,
          tag_infos: [
            {
              tag_id: 0,
            },
            {
              tag_id: 3,
            },
          ],
        },
        {
          start: 4,
          end: 6,
          tag_infos: [
            {
              tag_id: 2,
            },
          ],
        },
      ],
    },
    2: {
      video_id: 2,
      chances: [
        {
          start: 6,
          end: 9,
          tag_infos: [
            {
              tag_id: 2,
            },
          ],
        },
        {
          start: 10,
          end: 12,
          tag_infos: [
            {
              tag_id: 3,
            },
          ],
        },
      ],
    },
    3: {
      video_id: 3,
      chances: [
        {
          start: 10,
          end: 15,
          tag_infos: [
            {
              tag_id: 1,
            },
          ],
        },
        {
          start: 16,
          end: 19,
          tag_infos: [
            {
              tag_id: 0,
            },
          ],
        },
        {
          start: 20,
          end: 22,
          tag_infos: [
            {
              tag_id: 9,
            },
          ],
        },
      ],
    },
  };
  it('map chances for api payload', () => {
    const chances = [
      {
        videoId: 1,
        index: 0,
      },
      {
        videoId: 1,
        index: 1,
      },
      {
        videoId: 2,
        index: 0,
      },
      {
        videoId: 3,
        index: 2,
      },
    ];

    const expectedValue = [
      {
        video_id: 1,
        brand_ids: [0, 3],
        key_moment: {
          start: 0,
          end: 3,
        },
      },
      {
        video_id: 1,
        brand_ids: [2],
        key_moment: {
          start: 4,
          end: 6,
        },
      },
      {
        video_id: 2,
        brand_ids: [2],
        key_moment: {
          start: 6,
          end: 9,
        },
      },
      {
        video_id: 3,
        brand_ids: [9],
        key_moment: {
          start: 20,
          end: 22,
        },
      },
    ];

    expect(mapChancesToData(videosDict)(chances)).to.have.deep.members(expectedValue);
  });
});

