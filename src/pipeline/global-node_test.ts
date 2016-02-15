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
    it('should parse the globals string from the asset', (done: jasmine.IDoneFn) => {
      let height = 123;
      let width = 456;
      let globals = { 'a': 1, 'b': 2 };

      mockAsset.globalsString = JSON.stringify(globals);
      mockAsset.height = height;
      mockAsset.width = width;

      node.runHandler_()
          .then((result: any) => {
            expect(result).toEqual({
              'a': 1,
              'b': 2,
              _pc: {
                size: {
                  height: `${height}px`,
                  width: `${width}px`,
                },
              },
            });
            done();
          }, done.fail);
    });
  });
});
