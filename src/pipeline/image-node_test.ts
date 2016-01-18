import TestBase from '../testbase';
TestBase.init();

import ImageNode from './image-node';

describe('pipeline.ImageNode', () => {
  let mockAsset;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');
    node = new ImageNode(mockAsset);
  });

  describe('runHandler_', () => {
    it('should return the images object from the asset', done => {
      let images = jasmine.createObj('images');
      mockAsset.images = images;
      node.runHandler_()
          .then(result => {
            expect(result).toEqual(images);
            done();
          }, done.fail);
    });
  });
});
