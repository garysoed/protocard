import TestBase from '../testbase';

import FakeScope from '../testing/fake-scope';
import File, { FileTypes } from '../model/file';
import FunctionObject from '../model/function-object';
import RenderCtrl from './render-ctrl';

describe('render.RenderCtrl', () => {
  let mock$scope;
  let mockAsset;
  let mockDownloadService;
  let mockGeneratorService;
  let mockJszipService;
  let mockRenderService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mock$scope = new FakeScope();
    mock$scope['asset'] = mockAsset;
    mockDownloadService = jasmine.createSpyObj('DownloadService', ['download']);
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['generate', 'localDataList']);
    mockJszipService = jasmine.createSpy('JszipService');
    mockRenderService = jasmine.createSpyObj('RenderService', ['render']);
    ctrl = new RenderCtrl(
        mock$scope,
        mockDownloadService,
        mockGeneratorService,
        mockJszipService,
        mockRenderService);
  });

  describe('renderNext_', () => {
    it('should render the next entry to load', done => {
      let dataUri = 'dataUri';
      let toRender = {
        content: 'content',
        key: 'key'
      };
      ctrl.toRender_ = [toRender];

      spyOn(mock$scope, '$apply');

      mockRenderService.render.and.returnValue(Promise.resolve(dataUri));

      ctrl.renderNext_()
          .then(() => {
            expect(ctrl.images.length).toEqual(1);

            let newImage = ctrl.images[0];
            expect(newImage.alias).toEqual(toRender.key);
            expect(newImage.url).toEqual(dataUri);

            expect(mockRenderService.render)
                .toHaveBeenCalledWith(toRender.content, jasmine.any(Number), jasmine.any(Number));
            expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
            done();
          }, done.fail);
    });

    it('should do nothing if there are no entries to load', done => {
      ctrl.renderNext_()
          .then(() => {
            expect(mockRenderService.render).not.toHaveBeenCalled();
            done();
          }, done.fail);
    });

    it('should do nothing if the controller is destroyed', done => {
      ctrl.onDestroy_();
      ctrl.renderNext_()
          .then(() => {
            expect(mockRenderService.render).not.toHaveBeenCalled();
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

  describe('isRendering', () => {
    it('should return true if there are items to render', () => {
      ctrl.toRender_ = [{ content: 'content', key: 'key' }];
      expect(ctrl.isRendering()).toEqual(true);
    });

    it('should return false if there are no items to render', () => {
      ctrl.toRender_ = [];
      expect(ctrl.isRendering()).toEqual(false);
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
    beforeEach(() => {
      mockAsset.data = new File(FileTypes.TSV, 'a\tb\tc');
      mockAsset.dataProcessor =
          new FunctionObject('return function(data) { return { name: data[0] }; }');
      mockAsset.helpers = {};
      mockAsset.globals = {};
      mockAsset.templateString = '{{_.name}}';
    });

    it('should initialize correctly', () => {
      let templateString = 'templateString';
      let templateName = 'templateName';
      mockAsset.templateString = templateString;
      mockAsset.templateName = templateName;

      spyOn(ctrl, 'renderNext_').and.returnValue();

      let generatedHtml = { 'html1': 'content' };
      mockGeneratorService.generate.and.returnValue(generatedHtml);

      let localDataList = ['localData'];
      mockGeneratorService.localDataList.and.returnValue(localDataList);

      ctrl.onInit();
      expect(ctrl.toRender_).toEqual([{ key: 'html1', content: 'content' }]);
      expect(ctrl.totalCount).toEqual(1);
      expect(mockGeneratorService.generate).toHaveBeenCalledWith(
          mockAsset, localDataList, templateString, templateName);
      expect(mockGeneratorService.localDataList).toHaveBeenCalledWith(mockAsset);
    });

    it('should mark itself as destroyed when getting $destroy event', () => {
      spyOn(mock$scope, '$on');

      ctrl.onInit();
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
