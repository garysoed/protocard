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

  describe('hasSelectedImages', () => {
    it('should return true if there are selected images', () => {
      ctrl.selectedImages = ['image1', 'image2'];
      expect(ctrl.hasSelectedImages()).toEqual(true);
    });

    it('should return false if there are no selected images', () => {
      ctrl.selectedImages = [];
      expect(ctrl.hasSelectedImages()).toEqual(false);
    });
  });

  describe('onDeleteClick', () => {
    it('should delete the images from the asset and save it', () => {
      mockAsset.images = new Set(['image1', 'image2']);
      ctrl.selectedImages = ['image2'];

      ctrl.onDeleteClick();
      expect(ctrl.images).toEqual(['image1']);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });
  });

  describe('onDriveClick', () => {
    it('should return a Promise that updates the asset', done => {
      let $event = {};
      let images = ['image1', 'image2'];
      mockAsset.images = new Set([]);
      mockDriveDialogService.show.and.returnValue(Promise.resolve(images));

      ctrl.onDriveClick($event)
          .then(() => {
            expect(mockDriveDialogService.show).toHaveBeenCalledWith($event);
            expect(Array.from(mockAsset.images)).toEqual(images);
            expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
            done();
          }, done.fail);
    });
  });
});
