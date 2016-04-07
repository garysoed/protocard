import TestBase from '../testbase';
TestBase.init();

import ImageNode from './image-node';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';


describe('pipeline.ImageNode', () => {
  let mockAsset;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');
    node = new ImageNode(mockAsset);
    TestDispose.add(node);
  });

  describe('runHandler_', () => {
    it('should return the images object from the asset', (done: jasmine.IDoneFn) => {
      let images = jasmine.createObj('images');
      mockAsset.images = images;
      node.runHandler_()
          .then((result: any) => {
            expect(result).toEqual(images);
            done();
          }, done.fail);
    });
  });
});
