import TestBase from '../testbase';
TestBase.init();

import Cache from '../decorators/cache';
import FakeScope from '../testing/fake-scope';
import PartialEditorCtrl from './partial-editor-ctrl';

describe('partial.PartialEditorCtrl', () => {
  const ASSET_ID = 'assetId';
  const NAME = 'partialName';
  const PARTIAL = 'partial';

  let mock$scope;
  let mockAsset;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockLabelNode;
  let mockPartialNode;
  let ctrl;

  beforeEach(() => {
    mockAsset = { id: ASSET_ID, partials: { [NAME]: PARTIAL } };
    mock$scope = new FakeScope({ 'asset': mockAsset, 'name': NAME });

    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockLabelNode = jasmine.createObj('LabelNode');
    mockPartialNode = jasmine.createSpyObj('PartialNode', ['refresh']);

    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and
        .returnValue({ labelNode: mockLabelNode, partialNode: mockPartialNode });

    ctrl = new PartialEditorCtrl(
        mock$scope,
        mockAssetPipelineService,
        mockAssetService);
  });

  it('should get the correct pipeline', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('setSelectedKey_', () => {
    it('should clear the cache and pick a selecteed key randomly', done => {
      let selectedKey = 'selectedLabel';
      let labelsMap = {
        'otherLabel': 'value',
        [selectedKey]: 'value2'
      };

      spyOn(mock$scope, '$apply');
      spyOn(Cache, 'clear');
      spyOn(Math, 'random').and.returnValue(0.5);

      mockLabelNode.result = Promise.resolve(labelsMap);

      ctrl.setSelectedKey_()
          .then(() => {
            expect(ctrl.selectedKey).toEqual(selectedKey);
            expect(Cache.clear).toHaveBeenCalledWith(ctrl);
            expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
            done();
          }, done.fail);
    });
  });

  describe('get preview', () => {
    it('should return a provider that resolves to the correct value', done => {
      let selectedKey = 'selectedKey';
      let renderedValue = 'renderedValue';
      mockPartialNode.result = Promise.resolve({
        [NAME]: {
          [selectedKey]: renderedValue
        }
      });

      ctrl.selectedKey = selectedKey;
      ctrl.preview.promise
          .then(previewValue => {
            expect(previewValue).toEqual(renderedValue);
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      mockLabelNode.result = Promise.resolve({});
      mockPartialNode.result = Promise.resolve({});
      expect(ctrl.preview).toBe(ctrl.preview);
    });

    it('should return empty string if there are no keys selected', done => {
      mockPartialNode.result = Promise.resolve({
        [NAME]: {
          'selectedKey': 'renderedValue'
        }
      });
      mockLabelNode.result = Promise.resolve({});

      ctrl.preview.promise
          .then(previewValue => {
            expect(previewValue).toEqual('');
            done();
          }, done.fail);
    });

    it('should return empty string if the partial name is incorrect', done => {
      let selectedKey = 'selectedKey';
      mockPartialNode.result = Promise.resolve({
        'otherName': {
          [selectedKey]: 'renderedValue'
        }
      });

      ctrl.selectedKey = selectedKey;
      ctrl.preview.promise
          .then(previewValue => {
            expect(previewValue).toEqual('');
            done();
          }, done.fail);
    });

    it('should return empty string if the selected key does not exist', done => {
      mockPartialNode.result = Promise.resolve({
        'otherName': {
          'selectedKey': 'renderedValue'
        }
      });

      ctrl.selectedKey = 'otherKey';
      ctrl.preview.promise
          .then(previewValue => {
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

    it('should call setSelectedKey_ if no key was set', () => {
      spyOn(ctrl, 'setSelectedKey_');

      expect(ctrl.selectedKey).toEqual(null);
      expect(ctrl.setSelectedKey_).toHaveBeenCalledWith();
    });

    it('should clear the cache when setting the key', () => {
      spyOn(Cache, 'clear');

      ctrl.selectedKey = 'newValue';

      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
    });
  });

  describe('set templateString', () => {
    it('should update the partial and save the asset', () => {
      let newString = 'newPartial';

      spyOn(Cache, 'clear');

      ctrl.templateString = newString;

      expect(ctrl.templateString).toEqual(newString);
      expect(mockAsset.partials).toEqual({ [NAME]: newString });
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(mockPartialNode.refresh).toHaveBeenCalledWith();
    });

    it('should not save the asset if the input is null', () => {
      ctrl.templateString = null;

      expect(ctrl.templateString).toEqual(null);
      expect(mockAsset.partials).toEqual({ [NAME]: PARTIAL });
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });

  describe('onRefreshClick', () => {
    it('should clear the cache for the preview data', () => {
      mockLabelNode.result = Promise.resolve({});

      spyOn(Cache, 'clear');

      ctrl.onRefreshClick();

      expect(ctrl.selectedKey).toEqual(null);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
    });
  });
});
