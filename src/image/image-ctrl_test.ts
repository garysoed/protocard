import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../testing/fake-scope';
import ImageCtrl from './image-ctrl';

describe('image.ImageCtrl', () => {
  const ASSET_ID = 'assetId';

  let mock$scope;
  let mockAsset;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockDriveDialogService;
  let mockImageNode;
  let ctrl;

  beforeEach(() => {
    mockAsset = { id: ASSET_ID };
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockDriveDialogService = jasmine.createSpyObj('DriveDialogService', ['show']);
    mockImageNode = jasmine.createSpyObj('ImageNode', ['refresh']);

    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({ imageNode: mockImageNode });

    mock$scope = new FakeScope({
      'asset': mockAsset
    });

    ctrl = new ImageCtrl(
        mock$scope,
        mockAssetPipelineService,
        mockAssetService,
        mockDriveDialogService);
  });

  it('should initialize correctly', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
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

  describe('get images', () => {
    it('should return provider which resolves with the correct image resources',
        (done: jasmine.IDoneFn) => {
      let image1 = jasmine.createObj('image1');
      let image2 = jasmine.createObj('image2');
      let imageMap = { 'a': image1, 'b': image2 };
      mockImageNode.result = Promise.resolve(imageMap);

      ctrl.images.promise
          .then((images: any) => {
            expect(images).toEqual([image1, image2]);
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      mockImageNode.result = Promise.resolve(null);
      expect(ctrl.images).toBe(ctrl.images);
    });
  });

  describe('onDeleteClick', () => {
    it('should delete the images from the asset and save it', () => {
      mockAsset.images = {'image1': 'image1', 'image2': 'image2'};
      ctrl.selectedImages = [{ alias: 'image2' }];

      ctrl.onDeleteClick();
      expect(mockAsset.images).toEqual({'image1': 'image1'});
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });
  });

  describe('onDriveClick', () => {
    it('should return a Promise that updates the asset', (done: jasmine.IDoneFn) => {
      let $event = {};
      let images = [{ alias: 'image1' }, { alias: 'image2' }];
      mockAsset.images = {};
      mockDriveDialogService.show.and.returnValue(Promise.resolve(images));

      ctrl.onDriveClick($event)
          .then(() => {
            expect(mockDriveDialogService.show).toHaveBeenCalledWith($event);
            expect(mockAsset.images)
                .toEqual({ 'image1': images[0], 'image2': images[1] });
            expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
            done();
          }, done.fail);
    });
  });
});
