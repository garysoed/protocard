import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import { ImageCtrl } from './image';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';


describe('image.ImageCtrl', () => {

  let mock$scope;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockDriveDialogService;
  let ctrl;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockDriveDialogService = jasmine.createSpyObj('DriveDialogService', ['show']);

    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);

    mock$scope = FakeScope.create();

    ctrl = new ImageCtrl(
        mock$scope,
        mockAssetPipelineService,
        mockAssetService,
        mockDriveDialogService);
  });

  describe('$onInit', () => {
    it('should get the correct imageNode', () => {
      let assetId = 'assetId';
      let mockAsset = Mocks.object('Asset');
      mockAsset.id = assetId;

      let mockImageNode = Mocks.object('ImageNode');
      let mockPipeline = Mocks.object('Pipeline');
      mockPipeline.imageNode = mockImageNode;
      mockAssetPipelineService.getPipeline.and.returnValue(mockPipeline);

      ctrl.asset = mockAsset;
      ctrl.$onInit();

      expect(ctrl['imageNode_']).toEqual(mockImageNode);
      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
    });
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
      let mockImageNode = Mocks.object('ImageNode');
      mockImageNode.result = Promise.resolve(imageMap);

      ctrl['imageNode_'] = mockImageNode;
      ctrl.images.promise
          .then((images: any) => {
            expect(images).toEqual([image1, image2]);
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      let mockImageNode = Mocks.object('ImageNode');
      mockImageNode.result = Promise.resolve(null);
      ctrl['imageNode_'] = mockImageNode;
      expect(ctrl.images).toBe(ctrl.images);
    });
  });

  describe('onDeleteClick', () => {
    it('should delete the images from the asset and save it', () => {
      let mockAsset = Mocks.object('Asset');
      mockAsset.images = {'image1': 'image1', 'image2': 'image2'};

      ctrl.asset = mockAsset;
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
      let mockAsset = Mocks.object('Asset');
      mockAsset.images = {};
      mockDriveDialogService.show.and.returnValue(Promise.resolve(images));

      ctrl.asset = mockAsset;
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
