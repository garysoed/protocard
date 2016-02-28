import TestBase from '../testbase';
TestBase.init();

import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import FakeScope from '../testing/fake-scope';
import LabelCtrl from './label-ctrl';

describe('label.LabelCtrl', () => {
  const ASSET_ID = 'assetId';

  let mock$scope;
  let mockAsset;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockLabelNode;
  let ctrl;

  beforeEach(() => {
    mockAsset = { id: ASSET_ID };
    mock$scope = new FakeScope({ 'asset': mockAsset });
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockLabelNode = jasmine.createSpyObj('LabelNode', ['refresh']);

    mockAssetPipelineService.getPipeline.and.returnValue({ labelNode: mockLabelNode });

    ctrl = new LabelCtrl(mock$scope, mockAssetPipelineService, mockAssetService);
  });

  it('should initialize with the correct node', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('set assetLabel', () => {
    it('should update the value and clear the cache', () => {
      let newLabel = 'newLabel';

      spyOn(Cache, 'clear');

      ctrl.assetLabel = newLabel;

      expect(mockAsset.templateName).toEqual(newLabel);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockLabelNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('preview', () => {
    it('should return a provider which resolves with the correct value',
        (done: jasmine.IDoneFn) => {
      mockLabelNode.result = Promise.resolve({ 'label1': 'obj', 'label2': 'obj' });

      spyOn(Math, 'random').and.returnValue(0.5);

      ctrl.preview.promise
          .then((result: any) => {
            expect(result).toEqual('label2');
            done();
          }, done.fail);
    });

    it('should return empty string if there are no labels', (done: jasmine.IDoneFn) => {
      mockLabelNode.result = Promise.resolve({});

      ctrl.preview.promise
          .then((result: any) => {
            expect(result).toEqual('');
            done();
          }, done.fail);

    });

    it('should cache the provider', () => {
      mockLabelNode.result = Promise.resolve({});
      expect(ctrl.preview).toBe(ctrl.preview);
    });
  });

  describe('onRefreshClick', () => {
    it('should clear the cache', () => {
      mockLabelNode.result = Promise.resolve({});
      let firstProvider = ctrl.preview;

      ctrl.onRefreshClick();

      expect(ctrl.preview).not.toBe(firstProvider);
    });
  });
});
