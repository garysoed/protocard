import TestBase from '../../testbase';

import FakeScope from '../../testing/fake-scope';
import File, { Types as FileTypes } from '../../data/file';
import FunctionObject from '../../data/function-object';
import RenderCtrl from './render-ctrl';

describe('asset.render.RenderCtrl', () => {
  let mock$scope;
  let mockAsset;
  let mockGeneratorService;
  let mockRenderService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mock$scope = new FakeScope();
    mock$scope['asset'] = mockAsset;
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['generate']);
    mockRenderService = jasmine.createSpyObj('RenderService', ['render']);
    ctrl = new RenderCtrl(mock$scope, mockGeneratorService, mockRenderService);
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

      spyOn(ctrl, 'renderNext_').and.returnValue();

      let generatedHtml = { 'html1': 'content' };
      mockGeneratorService.generate.and.returnValue(generatedHtml);

      ctrl.onInit();
      expect(ctrl.toRender_).toEqual([{ key: 'html1', content: 'content' }]);
      expect(ctrl.totalCount).toEqual(1);
      expect(mockGeneratorService.generate).toHaveBeenCalledWith(
          mockAsset.templateString,
          jasmine.any(String),
          [{ name: 'a' }],
          {
            globals: mockAsset.globals,
            helpers: {},
            partials: jasmine.any(Object)
          });
    });

    it('should mark itself as destroyed when getting $destroy event', () => {
      spyOn(mock$scope, '$on');

      ctrl.onInit();
      expect(mock$scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
      mock$scope.$on.calls.argsFor(0)[1]();
      expect(ctrl.destroyed_).toEqual(true);
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
