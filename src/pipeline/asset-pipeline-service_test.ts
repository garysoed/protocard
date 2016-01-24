import TestBase from '../testbase';
TestBase.init();

import AssetPipelineService from './asset-pipeline-service';

describe('pipeline.AssetPipelineService', () => {
  let mockAssetService;
  let mockGeneratorService;
  let service;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    mockGeneratorService = jasmine.createObj('GeneratorService');
    service = new AssetPipelineService(mockAssetService, mockGeneratorService);
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
