import { describe, it } from 'mocha';
import { expect } from 'chai';

import * as helper from '../../../components/AdPodManagement/helper';

describe('Tag2Ad AdPodManagement/helper.js test', () => {
  describe('helper.addHostPrefix()', () => {
    const noHostPath1 = '/static/videos/1234570';
    const noHostPath2 = 'static/videos/1234570';
    const httpPath = 'http://vsp-dev.viscovery.com/static/videos/09876';
    const httpsPath = 'https://vsp.viscovery.com/static/videos/fi03s';

    it('https path', () => {
      const httpsResult = helper.addHostPrefix(httpsPath);
      expect(httpsResult).to.be.equal(httpsPath);
    });

    it('http path', () => {
      const httpResult = helper.addHostPrefix(httpPath);
      expect(httpResult).to.be.equal(httpResult);
    });

    it('no host path starts with /', () => {
      const noHostResult = helper.addHostPrefix(noHostPath1);
      const withHost = noHostResult.startsWith('http') || noHostResult.startsWith('https');
      expect(withHost).to.be.true;
    });

    it('no host path starts with no /', () => {
      const noHostResult = helper.addHostPrefix(noHostPath2);
      const withHost = noHostResult.startsWith('http') || noHostResult.startsWith('https');
      const index = noHostResult.indexOf(noHostPath2);
      const isSlash = noHostResult.charAt(index - 1) === '/';
      expect(withHost).to.be.true;
      expect(isSlash).to.be.true;
    });
  });
});
