import TestBase from '../testbase';
TestBase.init();

import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import { DataCtrl } from './data';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';


describe('data.DataCtrl', () => {
  let mockAssetPipelineService;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    let scope = FakeScope.create();
    ctrl = new DataCtrl(scope, mockAssetPipelineService, mockAssetService);
  });

  describe('$onChanges', () => {
    it('should handle asset change correctly', () => {
      let assetId = 'assetId';
      let fnString = 'fnString';
      let mockDataProcessor = { fnString: fnString };
      let mockAsset = { dataProcessor: mockDataProcessor, id: assetId };

      let mockProcessNode = Mocks.object('ProcessNode');
      let mockPipeline = { processNode: mockProcessNode };
      mockAssetPipelineService.getPipeline.and.returnValue(mockPipeline);

      ctrl.$onChanges({ 'asset': { currentValue: mockAsset } });

      expect(ctrl.asset).toEqual(mockAsset);
      expect(ctrl['processorString_']).toEqual(fnString);
      expect(ctrl['processNode_']).toEqual(mockProcessNode);
      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
    });
  });

  describe('$onInit', () => {
    it('should initialize with the correct process node', () => {
      let assetId = 'assetId';
      let fnString = 'fnString';
      let mockDataProcessor = { fnString: fnString };
      let mockAsset = { dataProcessor: mockDataProcessor, id: assetId };

      let mockProcessNode = Mocks.object('ProcessNode');
      let mockPipeline = { processNode: mockProcessNode };
      mockAssetPipelineService.getPipeline.and.returnValue(mockPipeline);

      ctrl.asset = mockAsset;
      ctrl.$onInit();

      expect(ctrl['processorString_']).toEqual(fnString);
      expect(ctrl['processNode_']).toEqual(mockProcessNode);
      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
    });
  });

  describe('onRefreshClick', () => {
    it('should invalidate the preview data', () => {
      spyOn(Cache, 'clear');
      ctrl.onRefreshClick();
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
    });
  });

  describe('get preview', () => {
    it('should return the provider with the correct data', (done: jasmine.IDoneFn) => {
      let processResults = ['a', 'b'];
      let mockProcessNode = Mocks.object('ProcessNode');
      mockProcessNode.result = Promise.resolve(processResults);

      spyOn(Math, 'random').and.returnValue(0.5);

      ctrl['processNode_'] = mockProcessNode;
      ctrl.preview.promise
          .then((previewData: any) => {
            expect(previewData).toEqual('"b"');
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      let mockProcessNode = Mocks.object('ProcessNode');
      mockProcessNode.result = Promise.resolve(['a', 'b']);

      ctrl['processNode_'] = mockProcessNode;
      expect(ctrl.preview).toBe(ctrl.preview);
    });
  });

  describe('set processorString', () => {
    it('should update the data processor and save the asset if non null', () => {
      let newValue = 'newValue';
      let mockDataProcessor = Mocks.object('DataProcessor');
      let mockAsset = Mocks.object('Asset');
      mockAsset.dataProcessor = mockDataProcessor;

      let mockProcessNode = jasmine.createSpyObj('ProcessNode', ['refresh']);

      spyOn(Cache, 'clear');
      ctrl['processNode_'] = mockProcessNode;
      ctrl.asset = mockAsset;
      ctrl.processorString = newValue;

      expect(ctrl.processorString).toEqual(newValue);
      expect(mockDataProcessor.fnString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockProcessNode.refresh).toHaveBeenCalledWith();
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
    });

    it('should not update the data processor or save the asset if null', () => {
      let oldValue = 'oldValue';
      let mockDataProcessor = Mocks.object('DataProcessor');
      mockDataProcessor.fnString = oldValue;

      let mockAsset = Mocks.object('Asset');
      mockAsset.dataProcessor = mockDataProcessor;

      let mockProcessNode = jasmine.createSpyObj('ProcessNode', ['refresh']);

      spyOn(Cache, 'clear');
      ctrl['processNode_'] = mockProcessNode;
      ctrl.asset = mockAsset;
      ctrl.processorString = null;

      expect(ctrl.processorString).toEqual(null);
      expect(mockDataProcessor.fnString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
      expect(mockProcessNode.refresh).not.toHaveBeenCalled();
      expect(Cache.clear).not.toHaveBeenCalled();
    });
  });
});
