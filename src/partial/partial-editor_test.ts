import TestBase from '../testbase';
TestBase.init();

import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import { PartialEditorCtrl } from './partial-editor';


describe('partial.PartialEditorCtrl', () => {
  let mock$scope;
  let mockAssetPipelineService;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mock$scope = FakeScope.create();
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);

    ctrl = new PartialEditorCtrl(
        mock$scope,
        mockAssetPipelineService,
        mockAssetService);
  });

  describe('$onInit', () => {
    it('should initialize correctly', () => {
      let name = 'name';
      let templateString = 'templateString';
      let assetId = 'assetId';
      let mockAsset = Mocks.object('Asset');
      mockAsset.id = assetId;
      mockAsset.partials = { [name]: templateString };

      let mockLabelNode = Mocks.object('LabelNode');
      let mockPartialNode = Mocks.object('PartialNode');
      let mockPipeline = Mocks.object('Pipeline');
      mockPipeline.labelNode = mockLabelNode;
      mockPipeline.partialNode = mockPartialNode;

      mockAssetPipelineService.getPipeline.and.returnValue(mockPipeline);

      spyOn(ctrl, 'setSelectedKey_');
      ctrl.asset = mockAsset;
      ctrl.initName = name;
      ctrl.$onInit();

      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
      expect(ctrl['labelNode_']).toEqual(mockLabelNode);
      expect(ctrl['partialNode_']).toEqual(mockPartialNode);
      expect(ctrl['setSelectedKey_']).toHaveBeenCalledWith();
    });
  });

  describe('setSelectedKey_', () => {
    it('should clear the cache and pick a selecteed key randomly', (done: jasmine.IDoneFn) => {
      let selectedKey = 'selectedLabel';
      let labelsMap = {
        'otherLabel': 'value',
        [selectedKey]: 'value2',
      };

      spyOn(mock$scope, '$apply');
      spyOn(Cache, 'clear');
      spyOn(Math, 'random').and.returnValue(0.5);

      let mockLabelNode = Mocks.object('LabelNode');
      mockLabelNode.result = Promise.resolve({ data: labelsMap });
      ctrl['labelNode_'] = mockLabelNode;

      ctrl.setSelectedKey_()
          .then(() => {
            expect(ctrl.selectedKey).toEqual(selectedKey);
            expect(Cache.clear).toHaveBeenCalledWith(ctrl);
            expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
            done();
          }, done.fail);
    });
  });

  describe('onCodeChange', () => {
    let mockAsset;
    let mockPartialNode;

    beforeEach(() => {
      mockAsset = Mocks.object('Asset');
      mockAsset.partials = {};

      mockPartialNode = jasmine.createSpyObj('PartialNode', ['refresh']);
      ctrl.asset = mockAsset;
      ctrl['partialNode_'] = mockPartialNode;
    });

    it('should update the partial and save the asset', () => {
      let name = 'name';
      let newString = 'newPartial';

      spyOn(Cache, 'clear');

      ctrl.name = name;
      ctrl.onCodeChange(newString);

      expect(ctrl.templateString).toEqual(newString);
      expect(mockAsset.partials).toEqual({ [name]: newString });
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(mockPartialNode.refresh).toHaveBeenCalledWith();
    });

    it('should not save the asset if the input is null', () => {
      let name = 'name';
      let mockPartials = Mocks.object('Partials');

      mockAsset.partials = mockPartials;

      ctrl.name = name;
      ctrl.onCodeChange(null);

      expect(ctrl.templateString).toEqual(null);
      expect(mockAsset.partials).toEqual(mockPartials);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });

  describe('get preview', () => {
    let mockLabelNode;
    let mockPartialNode;

    beforeEach(() => {
      mockLabelNode = Mocks.object('LabelNode');
      mockPartialNode = Mocks.object('PartialNode');
      ctrl['labelNode_'] = mockLabelNode;
      ctrl['partialNode_'] = mockPartialNode;
    });

    it('should return a provider that resolves to the correct value', (done: any) => {
      let name = 'name';
      let selectedKey = 'selectedKey';
      let renderedValue = 'renderedValue';
      mockPartialNode.result = Promise.resolve({
        [name]: {
          [selectedKey]: renderedValue,
        },
      });

      ctrl.name = name;
      ctrl.selectedKey = selectedKey;
      ctrl.preview.promise
          .then((previewValue: any) => {
            expect(previewValue).toEqual(renderedValue);
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      mockLabelNode.result = Promise.resolve({});
      mockPartialNode.result = Promise.resolve({});
      expect(ctrl.preview).toBe(ctrl.preview);
    });

    it('should return empty string if there are no keys selected', (done: any) => {
      let name = 'name';
      mockPartialNode.result = Promise.resolve({
        [name]: {
          'selectedKey': 'renderedValue',
        },
      });
      mockLabelNode.result = Promise.resolve({});

      ctrl.name = name;
      ctrl.preview.promise
          .then((previewValue: any) => {
            expect(previewValue).toEqual('');
            done();
          }, done.fail);
    });

    it('should return empty string if the partial name is incorrect', (done: jasmine.IDoneFn) => {
      let selectedKey = 'selectedKey';
      mockPartialNode.result = Promise.resolve({
        'otherName': {
          [selectedKey]: 'renderedValue',
        },
      });

      ctrl.selectedKey = selectedKey;
      ctrl.preview.promise
          .then((previewValue: any) => {
            expect(previewValue).toEqual('');
            done();
          }, done.fail);
    });

    it('should return empty string if the selected key does not exist', (done: jasmine.IDoneFn) => {
      mockPartialNode.result = Promise.resolve({
        'otherName': {
          'selectedKey': 'renderedValue',
        },
      });

      ctrl.selectedKey = 'otherKey';
      ctrl.preview.promise
          .then((previewValue: any) => {
            expect(previewValue).toEqual('');
            done();
          }, done.fail);
    });
  });

  describe('get and set selectedKey', () => {
    it('should return the previously set selected key', () => {
      let selectedKey = 'selectedKey';
      ctrl.selectedKey = selectedKey;

      expect(ctrl.selectedKey).toEqual(selectedKey);
    });

    it('should clear the cache when setting the key', () => {
      spyOn(Cache, 'clear');
      ctrl.selectedKey = 'newValue';
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
    });
  });

  describe('onRefreshClick', () => {
    it('should clear the cache for the preview data', () => {
      spyOn(ctrl, 'setSelectedKey_');
      spyOn(Cache, 'clear');

      ctrl.onRefreshClick();

      expect(ctrl['setSelectedKey_']).toHaveBeenCalledWith();
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
    });
  });
});
