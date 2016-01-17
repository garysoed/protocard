import TestBase from '../testbase';

import FakeScope from '../testing/fake-scope';
import File, { FileTypes } from '../model/file';
import TextCtrl from './text-ctrl';

describe('text.TextCtrl', () => {
  const ASSET_ID = 'assetId';

  let mockAsset;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockTextNode;
  let ctrl;

  beforeEach(() => {
    mockAsset = { id: ASSET_ID };
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockTextNode = jasmine.createSpyObj('TextNode', ['refresh']);

    mockAssetPipelineService.getPipeline.and.returnValue({ textNode: mockTextNode });

    let scope = <any>(new FakeScope());
    scope['asset'] = mockAsset;
    ctrl = new TextCtrl(scope, mockAssetPipelineService, mockAssetService);
  });

  it('should initialize with the correct text node', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('set data', () => {
    it('should update the asset data and save it', () => {
      let data = {};
      ctrl.data = data;
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockTextNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('get parsedData', () => {
    it('should return the correct data', done => {
      let textNodeResult = 'textNodeResult';
      mockTextNode.result = Promise.resolve(textNodeResult);

      ctrl.parsedData.promise
          .then(result => {
            expect(result).toEqual(textNodeResult);
            done();
          }, done.fail);
    });
  });

  describe('hasData', () => {
    let file = new File(FileTypes.TSV, 'a\nb');

    it('should return true if the asset has data', () => {
      mockAsset.data = file;
      expect(ctrl.hasData()).toEqual(true);
    });

    it('should return false if the asset has no data', () => {
      mockAsset.data = null;
      expect(ctrl.hasData()).toEqual(false);
    });
  });
});
