import TestBase from '../../testbase';

import PartialCtrl from './partial-ctrl';

describe('asset.partial.PartialCtrl', () => {
  let mockAsset;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    ctrl = new PartialCtrl({ 'asset': mockAsset }, mockAssetService);
  });

  describe('onAddClick', () => {
    it('should create a new unique partial and saves it', () => {
      mockAsset.partials = {};
      ctrl.onAddClick();

      expect(mockAsset.partials).toEqual({ 'partial': jasmine.any(String) });
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });
  });
});
