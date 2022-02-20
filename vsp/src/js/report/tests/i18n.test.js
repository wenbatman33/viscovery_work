/**
 * Created by amdis on 2017/3/22.
 */
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import locales from '../i18n';

const { fallback, ...otherLanguages } = locales;
describe('Report module i18n', () => {
  before(() => expect(fallback).to.exist);

  const locale = Object.keys(otherLanguages);
  for (const localeProperty of locale) {
    describe(localeProperty, () => {
      it('components existence check', () => {
        for (const compName of Object.keys(fallback)) {
          expect(otherLanguages[localeProperty]).to.have.ownProperty(compName);
        }
      });

      it('component key existence check', () => {
        for (const compName of Object.keys(fallback)) {
          const componentKeys = Object.keys(fallback[compName]);
          for (const key of componentKeys) {
            expect(otherLanguages[localeProperty][compName]).to.have.ownProperty(key);
          }
        }
      });
    });
  }
});
