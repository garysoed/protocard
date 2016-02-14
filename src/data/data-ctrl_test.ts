import TestBase from '../testbase';
TestBase.init();

import DataCtrl from './data-ctrl';
import FakeScope from '../testing/fake-scope';

describe('data.DataCtrl', () => {
  const ASSET_ID = 'assetId';

  let asset;
  let dataProcessor;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockProcessNode;
  let ctrl;

  beforeEach(() => {
    dataProcessor = jasmine.createObj('dataProcessor');
    asset = { dataProcessor: dataProcessor, id: ASSET_ID };
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockProcessNode = jasmine.createSpyObj('ProcessNode', ['refresh']);

    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({ processNode: mockProcessNode });

    let scope = <any>(new FakeScope());
    scope['asset'] = asset;
    ctrl = new DataCtrl(scope, mockAssetPipelineService, mockAssetService);
  });

  it('should initialize with the correct process node', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('onRefreshClick', () => {
    it('should invalidate the preview data', () => {
      mockProcessNode.result = Promise.resolve([1, 2]);

      let firstProvider = ctrl.preview;
      ctrl.onRefreshClick();
      expect(ctrl.preview).not.toBe(firstProvider);
    });
  });

  describe('get preview', () => {
    it('should return the provider with the correct data', done => {
      let processResults = ['a', 'b'];
      mockProcessNode.result = Promise.resolve(processResults);

      spyOn(Math, 'random').and.returnValue(0.5);

      ctrl.preview.promise
          .then(previewData => {
            expect(previewData).toEqual('"b"');
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      mockProcessNode.result = Promise.resolve(['a', 'b']);
      expect(ctrl.preview).toBe(ctrl.preview);
    });
  });

  describe('set processorString', () => {
    beforeEach(() => {
      mockProcessNode.result = Promise.resolve([1, 2]);
    });

    it('should update the data processor and save the asset if non null', () => {
      let firstProvider = ctrl.preview;
      let newValue = 'newValue';
      ctrl.processorString = newValue;

      expect(ctrl.processorString).toEqual(newValue);
      expect(dataProcessor.fnString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
      expect(mockProcessNode.refresh).toHaveBeenCalledWith();
      expect(ctrl.preview).not.toBe(firstProvider);
    });

    it('should not update the data processor or save the asset if null', () => {
      let firstProvider = ctrl.preview;
      let oldValue = 'oldValue';
      dataProcessor.fnString = oldValue;

      ctrl.processorString = null;
      expect(ctrl.processorString).toEqual(null);
      expect(dataProcessor.fnString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
      expect(mockProcessNode.refresh).not.toHaveBeenCalled();
      expect(ctrl.preview).toBe(firstProvider);
    });
  });
});
