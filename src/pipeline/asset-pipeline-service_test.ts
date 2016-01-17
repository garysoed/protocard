import TestBase from '../testbase';
TestBase.init();

import AssetPipelineService from './asset-pipeline-service';

describe('pipeline.AssetPipelineService', () => {
  let mockAssetService;
  let service;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    service = new AssetPipelineService(mockAssetService);
  });

  describe('getPipeline', () => {
    it('should cache the pipeline', () => {
      let assetId = 'assetId';
      let mockAsset = jasmine.createObj('Asset');

      let pipeline = service.getPipeline(assetId);

      expect(mockAssetService.getAsset).toHaveBeenCalledWith(assetId);

      expect(service.getPipeline(assetId)).toEqual(pipeline);
    });
  });
});
