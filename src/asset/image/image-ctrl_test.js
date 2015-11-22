import TestBase from '../../testbase';

import ImageCtrl from './image-ctrl';

describe('asset.image.ImageCtrl', () => {
  let mockAsset;
  let mockAssetService;
  let mockDriveDialogService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockDriveDialogService = jasmine.createSpyObj('DriveDialogService', ['show']);
    ctrl = new ImageCtrl({ 'asset': mockAsset }, mockAssetService, mockDriveDialogService);
  });

  describe('onDriveClick', () => {
    it('should return a Promise that updates the asset', done => {
      let $event = {};
      let images = ['image1', 'image2'];
      mockAsset.images = [];
      mockDriveDialogService.show.and.returnValue(Promise.resolve(images));

      ctrl.onDriveClick($event)
          .then(() => {
            expect(mockDriveDialogService.show).toHaveBeenCalledWith($event);
            expect(mockAsset.images).toEqual(images);
            expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
            done();
          }, done.fail);
    });
  });
});
