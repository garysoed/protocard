import TestBase from '../testbase';

import GlobalCtrl from './global-ctrl';

describe('global.GlobalCtrl', () => {
  const ASSET_ID = 'assetId';
  let mock$scope;
  let mockAsset;
  let mockAssetPipelineService
  let mockAssetService;
  let mockGlobalNode;
  let ctrl;

  beforeEach(() => {
    mockAsset = { id: ASSET_ID };
    mock$scope = jasmine.createSpyObj('$scope', ['$on']);
    mock$scope['asset'] = mockAsset;
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockGlobalNode = jasmine.createSpyObj('GlobalNode', ['refresh']);

    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({ globalNode: mockGlobalNode });

    ctrl = new GlobalCtrl(mock$scope, mockAssetPipelineService, mockAssetService);
  });

  it('should initialize globalsString to the value in the asset', () => {
    let globalsString = 'globalsString';
    mockAsset.globalsString = globalsString;
    ctrl = new GlobalCtrl(mock$scope, mockAssetPipelineService, mockAssetService);
    expect(ctrl.globalsString).toEqual(globalsString);
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('isValid', () => {
    it('should return true if the globals string is non null', () => {
      ctrl.globalsString = 'blah';
      expect(ctrl.isValid()).toEqual(true);
    });

    it('should return false if the globals string is null', () => {
      ctrl.globalsString = null;
      expect(ctrl.isValid()).toEqual(false);
    });
  });

  describe('set globalsString', () => {
    it('should update the asset and save it if set to non null', () => {
      let newValue = 'newValue';

      ctrl.globalsString = newValue;

      expect(ctrl.globalsString).toEqual(newValue);
      expect(mockAsset.globalsString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockGlobalNode.refresh).toHaveBeenCalledWith();
    });

    it('should update the globalsString but not save it if null', () => {
      let oldValue = 'oldValue';
      mockAsset.globalsString = oldValue;

      ctrl.globalsString = null;

      expect(ctrl.globalsString).toEqual(null);
      expect(mockAsset.globalsString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
      expect(mockGlobalNode.refresh).not.toHaveBeenCalled();
    });
  });
});
