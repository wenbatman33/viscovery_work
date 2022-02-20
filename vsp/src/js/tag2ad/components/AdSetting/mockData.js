import { Ad } from '../../models';

export const adSearchResult = [
  {
    video_id: 10,
    video_name: 'Game of Thrones',
    video_fps: 30,
    video_url: 'http://www.w3schools.com/html/mov_bbb.mp4',
    chances: [
      {
        start: 130,
        end: 166,
        thumbnail: 'http://www.tinygiantz.com/assets/video-placeholder.jpg',
        tags: [1, 4, 5],
      },
      {
        start: 2000,
        end: 2300,
        thumbnail: 'http://www.tinygiantz.com/assets/video-placeholder.jpg',
        tags: [1, 4, 5],
      },
    ],
  },
  {
    video_id: 156,
    video_name: 'Walking Dead SE 6, EP2',
    video_fps: 30,
    video_url: 'http://www.w3schools.com/html/mov_bbb.mp4',
    chances: [
      {
        start: 100,
        end: 190,
        thumbnail: 'http://www.tinygiantz.com/assets/video-placeholder.jpg',
        tags: [1, 4, 5],
      },
    ],
  },
];

export const adResult = [
  {
    id: 1,
    video_id: 10,
    video_fps: 30,
    content: {
      start_position: 151,
      end_position: 301,
      category: 1,
      form: 1,
    },
  },
  {
    id: 2,
    video_id: 10,
    video_fps: 30,
    content: {
      start_position: 301,
      end_position: 601,
      category: 1,
      form: 1,
    },
  },
  {
    id: 3,
    video_id: 10,
    video_fps: 30,
    content: {
      start_position: 2101,
      end_position: 2401,
      category: 1,
      form: 1,
    },
  },
].map(ad => new Ad(ad));
