import TestBase from '../testbase';
TestBase.init();

import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import { LabelCtrl } from './label';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';


describe('label.LabelCtrl', () => {
  let mock$scope;
  let mockAssetPipelineService;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mock$scope = FakeScope.create();
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);

    ctrl = new LabelCtrl(mock$scope, mockAssetPipelineService, mockAssetService);
  });

  describe('$onInit', () => {
    it('should initialize with the correct node', () => {
      let assetId = 'assetId';
      let mockAsset = Mocks.object('Asset');
      mockAsset.id = assetId;
      let mockLabelNode = jasmine.createSpyObj('LabelNode', ['refresh']);
      mockAssetPipelineService.getPipeline.and.returnValue({ labelNode: mockLabelNode });

      ctrl.asset = mockAsset;
      ctrl.$onInit();
      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
      expect(ctrl['labelNode_']).toEqual(mockLabelNode);
    });
  });

  describe('set assetLabel', () => {
    it('should update the value and clear the cache', () => {
      let newLabel = 'newLabel';
      let mockLabelNode = jasmine.createSpyObj('LabelNode', ['refresh']);
      let mockAsset = Mocks.object('Asset');

      spyOn(Cache, 'clear');

      ctrl['labelNode_'] = mockLabelNode;
      ctrl.asset = mockAsset;
      ctrl.assetLabel = newLabel;

      expect(mockAsset.templateName).toEqual(newLabel);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockLabelNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('preview', () => {
    let mockLabelNode;

    beforeEach(() => {
      mockLabelNode = Mocks.object('LabelNode');
      ctrl['labelNode_'] = mockLabelNode;
    });

    it('should return a provider which resolves with the correct value',
        (done: jasmine.IDoneFn) => {
      mockLabelNode.result = Promise.resolve({ data: { 'label1': 'obj', 'label2': 'obj' } });

      spyOn(Math, 'random').and.returnValue(0.5);

      ctrl.preview.promise
          .then((result: any) => {
            expect(result).toEqual('label2');
            done();
          }, done.fail);
    });

    it('should return empty string if there are no labels', (done: jasmine.IDoneFn) => {
      mockLabelNode.result = Promise.resolve({ data: {} });

      ctrl.preview.promise
          .then((result: any) => {
            expect(result).toEqual('');
            done();
          }, done.fail);

    });

    it('should cache the provider', () => {
      mockLabelNode.result = Promise.resolve({ data: {} });
      expect(ctrl.preview).toBe(ctrl.preview);
    });
  });

  describe('onRefreshClick', () => {
    it('should clear the cache', () => {
      spyOn(Cache, 'clear');
      ctrl.onRefreshClick();
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
    });
  });
});
