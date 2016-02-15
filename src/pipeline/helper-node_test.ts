import TestBase from '../testbase';
TestBase.init();

import HelperNode from './helper-node';

describe('pipeline.HelperNode', () => {
  let mockAsset;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');
    node = new HelperNode(mockAsset);
  });

  describe('runHandler_', () => {
    it('should return the helpers object from the asset', (done: jasmine.IDoneFn) => {
      let helpers = jasmine.createObj('helpers');
      mockAsset.helpers = helpers;
      node.runHandler_()
          .then((result: any) => {
            expect(result).toEqual(helpers);
            done();
          }, done.fail);
    });
  });
});
