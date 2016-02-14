import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../testing/fake-scope';
import RenderCtrl from './render-ctrl';

describe('render.RenderCtrl', () => {
  const ASSET_ID = 'assetId';

  let mock$scope;
  let mockAsset;
  let mockAssetPipelineService;
  let mockDownloadService;
  let mockExportNode;
  let mockJszipService;
  let mockRenderService;
  let ctrl;

  beforeEach(() => {
    mockAsset = { id: ASSET_ID };
    mock$scope = new FakeScope();
    mock$scope['asset'] = mockAsset;
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockDownloadService = jasmine.createSpyObj('DownloadService', ['download']);
    mockExportNode = jasmine.createObj('ExportNode');
    mockJszipService = jasmine.createSpy('JszipService');
    mockRenderService = jasmine.createSpyObj('RenderService', ['render']);

    mockAssetPipelineService.getPipeline.and.returnValue({ exportNode: mockExportNode });

    ctrl = new RenderCtrl(
        mock$scope,
        mockAssetPipelineService,
        mockDownloadService,
        mockJszipService,
        mockRenderService);
  });

  it('should get the correct asset pipeline', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('renderAll_', () => {
    it('should add all the rendered images', done => {
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

    it('should set the last error if the export node throws error', done => {
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

    it('should set the last error if one of the image resource promises throws error', done => {
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
    it('should create the zip file and downloads it', () => {
      let content = 'blobContent';
      let mockZip = jasmine.createSpyObj('Zip', ['file', 'generate']);
      mockZip.generate.and.returnValue(content);

      mockJszipService.and.returnValue(mockZip);
      mockAsset.name = 'assetName';

      let selectedImages = [
        { alias: 'imageAlias1', url: 'data:image/png,base64data1' }
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

  describe('onInit', () => {
    it('should initialize correctly', () => {
      spyOn(mock$scope, '$on');
      spyOn(ctrl, 'renderAll_');

      ctrl.onInit();

      expect(ctrl.renderAll_).toHaveBeenCalledWith();
      expect(mock$scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
      mock$scope.$on.calls.argsFor(0)[1]();
      expect(ctrl.destroyed_).toEqual(true);
    });
  });

  describe('onSelectAllClick', () => {
    it('should select all rendered images', () => {
      let renderedImages = ['image1', 'image2'];
      renderedImages.forEach(image => ctrl.images.push(image));

      ctrl.onSelectAllClick();
      expect(ctrl.selectedImages).toEqual(renderedImages);
    });

    it('should unselect selected images, then select all rendered images', () => {
      let renderedImages = ['image1', 'image2'];
      renderedImages.forEach(image => ctrl.images.push(image));
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
