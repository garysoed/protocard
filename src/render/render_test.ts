import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import { RenderCtrl } from './render';


describe('render.RenderCtrl', () => {
  let mock$scope;
  let mockAssetPipelineService;
  let mockDownloadService;
  let mockJszipService;
  let mockRenderService;
  let ctrl;

  beforeEach(() => {
    mock$scope = FakeScope.create();
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockDownloadService = jasmine.createSpyObj('DownloadService', ['download']);
    mockJszipService = jasmine.createSpy('JszipService');
    mockRenderService = jasmine.createSpyObj('RenderService', ['render']);

    ctrl = new RenderCtrl(
        mock$scope,
        mockAssetPipelineService,
        mockDownloadService,
        mockJszipService,
        mockRenderService);
  });

  describe('renderAll_', () => {
    let mockExportNode;

    beforeEach(() => {
      mockExportNode = Mocks.object('ExportNode');
      ctrl['exportNode_'] = mockExportNode;
    });

    it('should add all the rendered images', (done: jasmine.IDoneFn) => {
      let imageResource1 = jasmine.createObj('imageResource1');
      let imageResource2 = jasmine.createObj('imageResource2');
      let results = [Promise.resolve(imageResource1), Promise.resolve(imageResource2)];

      mockExportNode.result = Promise.resolve(results);

      spyOn(mock$scope, '$apply');

      ctrl.renderAll_()
          .then(() => {
            expect(ctrl.images).toEqual([imageResource1, imageResource2]);
            expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
            expect(mock$scope.$apply.calls.count()).toBeGreaterThan(2);

            expect(ctrl.totalRender_).toEqual(2);
            done();
          }, done.fail);
    });

    it('should set the last error if the export node throws error', (done: jasmine.IDoneFn) => {
      let error = jasmine.createObj('error');

      mockExportNode.result = Promise.reject(error);

      spyOn(mock$scope, '$apply');

      ctrl.renderAll_()
          .then(() => {
            expect(ctrl.lastError).toEqual(error);
            expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
            done();
          }, done.fail);
    });

    it('should set the last error if one of the image resource promises throws error',
        (done: jasmine.IDoneFn) => {
      let error = jasmine.createObj('error');
      let results = [Promise.reject(error)];

      mockExportNode.result = Promise.resolve(results);

      spyOn(mock$scope, '$apply');

      ctrl.renderAll_()
          .then(() => {
            expect(ctrl.lastError).toEqual(error);
            expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
            done();
          }, done.fail);
    });
  });

  describe('$onInit', () => {
    it('should get the correct asset pipeline', () => {
      let assetId = 'assetId';
      let mockAsset = Mocks.object('Asset');
      mockAsset.id = assetId;

      let mockExportNode = Mocks.object('ExportNode');
      let mockPipeline = Mocks.object('Pipeline');
      mockPipeline.exportNode = mockExportNode;

      mockAssetPipelineService.getPipeline.and.returnValue(mockPipeline);
      spyOn(mock$scope, '$on');
      spyOn(ctrl, 'renderAll_');

      ctrl.asset = mockAsset;
      ctrl.$onInit();

      expect(ctrl.renderAll_).toHaveBeenCalledWith();
      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
      expect(ctrl['exportNode_']).toEqual(mockExportNode);
    });
  });

  describe('hasSelectedImages', () => {
    it('should return true if there are images selected', () => {
      ctrl.selectedImages = ['selected'];
      expect(ctrl.hasSelectedImages()).toEqual(true);
    });

    it('should return false if there are no images selected', () => {
      ctrl.selectedImages = [];
      expect(ctrl.hasSelectedImages()).toEqual(false);
    });
  });

  describe('get isRendering', () => {
    it('should return true if there are items to render', () => {
      ctrl.totalRender_ = 2;
      ctrl.rendered_ = ['2'];
      expect(ctrl.isRendering).toEqual(true);
    });

    it('should return false if there are no items to render', () => {
      ctrl.totalRender_ = 2;
      ctrl.rendered_ = ['1', '2'];
      expect(ctrl.isRendering).toEqual(false);
    });
  });

  describe('onDownloadClick', () => {
    let mockAsset;

    beforeEach(() => {
      mockAsset = Mocks.object('Asset');
      ctrl.asset = mockAsset;
    });

    it('should create the zip file and downloads it', () => {
      let content = 'blobContent';
      let mockZip = jasmine.createSpyObj('Zip', ['file', 'generate']);
      mockZip.generate.and.returnValue(content);

      mockJszipService.and.returnValue(mockZip);
      mockAsset.name = 'assetName';

      let selectedImages = [
        { alias: 'imageAlias1', url: 'data:image/png,base64data1' },
      ];
      ctrl.selectedImages = selectedImages;

      ctrl.onDownloadClick();

      expect(mockZip.file)
          .toHaveBeenCalledWith('imageAlias1.png', 'base64data1', { base64: true });
      expect(mockZip.generate).toHaveBeenCalledWith({ type: 'blob' });
      expect(mockDownloadService.download).toHaveBeenCalledWith(content, `${mockAsset.name}.zip`);
      expect(ctrl.selectedImages).toEqual([]);
    });
  });

  describe('onSelectAllClick', () => {
    it('should select all rendered images', () => {
      let renderedImages = ['image1', 'image2'];
      renderedImages.forEach((image: any) => ctrl.images.push(image));

      ctrl.onSelectAllClick();
      expect(ctrl.selectedImages).toEqual(renderedImages);
    });

    it('should unselect selected images, then select all rendered images', () => {
      let renderedImages = ['image1', 'image2'];
      renderedImages.forEach((image: any) => ctrl.images.push(image));
      ctrl.selectedImages.push('image1');

      ctrl.onSelectAllClick();
      expect(ctrl.selectedImages).toEqual(renderedImages);
    });
  });

  describe('onUnselectAllClick', () => {
    it('should unselect all selected images', () => {
      ctrl.selectedImages.push('image');

      ctrl.onUnselectAllClick();
      expect(ctrl.selectedImages).toEqual([]);
    });
  });

  describe('get renderedCount', () => {
    it('should return the correct number of rendered items', () => {
      ctrl.images.push('a');
      ctrl.images.push('b');

      expect(ctrl.renderedCount).toEqual(2);
    });
  });

  describe('get percentDone', () => {
    it('should return the correct percentage of rendered items', () => {
      ctrl.images.push('a');
      ctrl.images.push('b');

      ctrl.totalRender_ = 5;
      expect(ctrl.percentDone).toEqual(40);
    });
  });
});
