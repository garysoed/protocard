import TestBase from '../testbase';
TestBase.init();

import { AssetPipelineService } from './asset-pipeline-service';

describe('pipeline.AssetPipelineService', () => {
  let mockAssetService;
  let mockFuseService;
  let mockGeneratorService;
  let mockRenderService;
  let service;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    mockFuseService = jasmine.createObj('FuseService');
    mockGeneratorService = jasmine.createObj('GeneratorService');
    mockRenderService = jasmine.createObj('RenderService');
    service = new AssetPipelineService(
        mockAssetService,
        mockFuseService,
        mockGeneratorService,
        mockRenderService);
  });

  describe('getPipeline', () => {
    it('should cache the pipeline', () => {
      let assetId = 'assetId';

      let pipeline = service.getPipeline(assetId);

      expect(mockAssetService.getAsset).toHaveBeenCalledWith(assetId);

      expect(service.getPipeline(assetId)).toEqual(pipeline);
    });
  });
});
