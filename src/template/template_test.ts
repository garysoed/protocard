import TestBase from '../testbase';
TestBase.init();

import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import { TemplateCtrl } from './template';

describe('template.TemplateCtrl', () => {
  const ASSET_ID = 'assetId';

  let mock$scope;
  let mockAsset;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockGeneratorService;
  let mockLabelNode;
  let mockLocalDataList;
  let mockTemplateNode;
  let ctrl;

  beforeEach(() => {
    mockAsset = { id: ASSET_ID };
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockLabelNode = jasmine.createObj('LabelNode');
    mockLocalDataList = [];
    mockTemplateNode = jasmine.createSpyObj('TemplateNode', ['refresh']);

    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['generateNames']);
    mockGeneratorService.generateNames.and.returnValue(mockLocalDataList);

    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({
      labelNode: mockLabelNode,
      templateNode: mockTemplateNode,
    });

    mockLabelNode.result = Promise.resolve();

    mock$scope = FakeScope.create();
    mock$scope['asset'] = mockAsset;

    ctrl = new TemplateCtrl(
        mock$scope, mockAssetPipelineService, mockAssetService, mockGeneratorService);
  });

  it('should get the correct asset pipeline', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('showSearch_', () => {
    it('should start the timeout that sets the search to be visible', () => {
      let setTimeoutSpy = spyOn(window, 'setTimeout');
      setTimeoutSpy.and.returnValue(3);
      spyOn(mock$scope, '$apply');

      ctrl.showSearch_();

      expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));

      setTimeoutSpy.calls.argsFor(0)[0]();
      expect(ctrl.isSearchVisible_).toEqual(false);
      expect(ctrl.searchVisibleTimeoutId_).toEqual(null);
      expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should not set the search to be invisible if the search is focused', () => {
      let timeoutId = 123;
      let setTimeoutSpy = spyOn(window, 'setTimeout');
      setTimeoutSpy.and.returnValue(timeoutId);
      spyOn(mock$scope, '$apply');

      ctrl.isSearchVisible_ = true;

      ctrl.onSearchFocus();
      ctrl.showSearch_();

      expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));

      setTimeoutSpy.calls.argsFor(0)[0]();
      expect(ctrl.isSearchVisible_).toEqual(true);
      expect(ctrl.searchVisibleTimeoutId_).toEqual(timeoutId);
      expect(mock$scope.$apply).not.toHaveBeenCalled();
    });

    it('should clear the timeout of the previous setTimeout', () => {
      let timeoutId = 123;
      let setTimeoutSpy = spyOn(window, 'setTimeout');
      setTimeoutSpy.and.returnValue(timeoutId);
      spyOn(mock$scope, '$apply');

      ctrl.showSearch_();

      spyOn(window, 'clearTimeout');

      ctrl.showSearch_();
      expect(window.clearTimeout).toHaveBeenCalledWith(timeoutId);
    });
  });

  describe('setQuery_', () => {
    it('should randomly select a query', (done: jasmine.IDoneFn) => {
      let labels = { 'label1': 'data', 'label2': 'data' };
      mockLabelNode.result = Promise.resolve({ data: labels });

      spyOn(Math, 'random').and.returnValue(0.5);
      spyOn(Cache, 'clear');
      spyOn(mock$scope, '$apply');

      ctrl.setQuery_()
          .then(() => {
            expect(ctrl.query).toEqual('label2');
            expect(Cache.clear).toHaveBeenCalledWith(ctrl);
            expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
            done();
          }, done.fail);
    });
  });

  describe('get isPreviewLoading', () => {
    it('should return true until it is loaded', (done: jasmine.IDoneFn) => {
      let query = 'query';
      mockTemplateNode.result = Promise.resolve({
        [query]: {
          dataUriTicket: {
            promise: Promise.resolve('dataUri'),
          },
        },
      });

      ctrl.query = query;

      let provider = ctrl.isPreviewLoading;
      expect(ctrl.isPreviewLoading.value).toEqual(true);

      provider.promise
          .then(() => {
            expect(ctrl.isPreviewLoading.value).toEqual(false);
            done();
          }, done.fail);
    });

    it('should return false if there are no rendered data', (done: jasmine.IDoneFn) => {
      mockTemplateNode.result = Promise.resolve({ });

      ctrl.isPreviewLoading.promise
          .then(() => {
            expect(ctrl.isPreviewLoading.value).toEqual(false);
            done();
          }, done.fail);
    });
  });

  describe('onCodeChange', () => {
    it('should update the asset and saves it if the input is non null', () => {
      let newValue = 'newValue';

      spyOn(Cache, 'clear');

      ctrl.onCodeChange(newValue);

      expect(ctrl.templateString).toEqual(newValue);
      expect(mockAsset.templateString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(mockTemplateNode.refresh).toHaveBeenCalledWith();
    });

    it('should update the template string but not the asset if the input is null', () => {
      let oldValue = 'oldValue';
      mockAsset.templateString = oldValue;

      spyOn(Cache, 'clear');

      ctrl.onCodeChange(null);

      expect(ctrl.templateString).toEqual(null);
      expect(mockAsset.templateString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
      expect(Cache.clear).not.toHaveBeenCalled();
      expect(mockTemplateNode.refresh).not.toHaveBeenCalled();
    });
  });

  describe('get preview', () => {
    it('should return a provider that resolves with the selected preview data',
        (done: jasmine.IDoneFn) => {
      let zoom = 123;
      let htmlSource = 'htmlSource';
      let query = 'query';
      mockTemplateNode.result = Promise.resolve({
        [query]: { htmlSource: htmlSource },
        'otherQuery': 'otherData',
      });

      ctrl.zoom = zoom;
      ctrl.query = query;

      ctrl.preview.promise
          .then((previewSource: any) => {
            expect(previewSource).toEqual(jasmine.stringMatching(new RegExp(htmlSource)));
            expect(previewSource).toEqual(jasmine.stringMatching(/scale\(1.23\)/));
            done();
          }, done.fail);
    });

    it('should resolve with empty string if the query is null', (done: jasmine.IDoneFn) => {
      mockTemplateNode.result = Promise.resolve({
        'query': 'data',
        'otherQuery': 'otherData',
      });

      ctrl.preview.promise
          .then((previewSource: any) => {
            expect(previewSource).toEqual('');
            done();
          }, done.fail);
    });

    it('should resolve with empty string if the query is invalid', (done: jasmine.IDoneFn) => {
      mockTemplateNode.result = Promise.resolve({
        'query': 'data',
        'otherQuery': 'otherData',
      });

      ctrl.query = 'invalidQuery';

      ctrl.preview.promise
          .then((previewSource: any) => {
            expect(previewSource).toEqual('');
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      mockTemplateNode.result = Promise.resolve({});

      expect(ctrl.preview).toBe(ctrl.preview);
    });
  });

  describe('get previewDataUri', () => {
    it('should empty string until the data uri is loaded', (done: jasmine.IDoneFn) => {
      let query = 'query';
      let dataUri = 'dataUri';
      mockTemplateNode.result = Promise.resolve({
        [query]: {
          dataUriTicket: {
            promise: Promise.resolve(dataUri),
          },
        },
      });

      ctrl.query = query;

      let provider = ctrl.previewDataUri;
      expect(ctrl.previewDataUri.value).toEqual('');

      provider.promise
          .then(() => {
            expect(ctrl.previewDataUri.value).toEqual(dataUri);
            done();
          }, done.fail);
    });

    it('should return empty string if there are no rendered data', (done: jasmine.IDoneFn) => {
      mockTemplateNode.result = Promise.resolve({ });

      ctrl.previewDataUri.promise
          .then(() => {
            expect(ctrl.previewDataUri.value).toEqual('');
            done();
          }, done.fail);
    });
  });

  describe('get and set query', () => {
    it('should return the set value if set', () => {
      let query = 'query';

      ctrl.query = query;
      expect(ctrl.query).toEqual(query);
    });

    it('should clear the cache when query is set', () => {
      spyOn(Cache, 'clear');

      ctrl.query = 'query';

      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
    });
  });

  describe('onRefreshClick', () => {
    it('should update the input element srcdoc', () => {
      spyOn(Cache, 'clear');
      spyOn(ctrl, 'setQuery_');

      ctrl.onRefreshClick();

      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(ctrl.setQuery_).toHaveBeenCalledWith();
    });
  });

  describe('onSearchBlur', () => {
    it('should call show search and set the search as focused', () => {
      spyOn(ctrl, 'showSearch_');
      ctrl.isSearchFocused_ = true;

      ctrl.onSearchBlur();

      expect(ctrl.isSearchFocused_).toEqual(false);
      expect(ctrl.showSearch_).toHaveBeenCalledWith();
    });
  });

  describe('onSearchMouseOvr', () => {
    it('should call show search', () => {
      spyOn(ctrl, 'showSearch_');

      ctrl.onSearchMouseOver();

      expect(ctrl.showSearch_).toHaveBeenCalledWith();
    });
  });
});
