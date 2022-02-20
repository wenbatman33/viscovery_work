import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { NAME } from './constants';
import i18n from './i18n';
import auth from '../auth';
import cms from '../cms';
import tag2ad from '../tag2ad';
import rims from '../rims';
import report from '../report';

const features = [
  auth,
  cms,
  tag2ad,
  rims,
  report,
];
const combinedResources = {
  'en-US': {},
  'zh-CN': {},
  'zh-TW': {},
};
for (const key in combinedResources) { // eslint-disable-line
  combinedResources[key][NAME] = i18n[key];
  for (const feature of features) {
    combinedResources[key][feature.constants.NAME] = feature.i18n[key];
  }
}

i18next
  .use(LanguageDetector)
  .init({
    resources: combinedResources,
    fallbackLng: 'zh-TW',
  });

export default i18next;
