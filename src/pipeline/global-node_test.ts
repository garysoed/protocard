import TestBase from '../testbase';
TestBase.init();

import GlobalNode from './global-node';

describe('pipeline.GlobalNode', () => {
  let mockAsset;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');
    node = new GlobalNode(mockAsset);
  });

  describe('runHandler_', () => {
    it('should parse the globals string from the asset', done => {
      let globals = { 'a': 1, 'b': 2 };
      mockAsset.globalsString = JSON.stringify(globals);
      node.runHandler_()
          .then(result => {
            expect(result).toEqual(globals);
            done();
          }, done.fail);
    });
  });
});
