import TestBase from '../testbase';
TestBase.init();

import { PartialCtrl } from './partial';

describe('partial.PartialCtrl', () => {
  let mockAsset;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    ctrl = new PartialCtrl(
        jasmine.cast<angular.IScope>({ 'asset': mockAsset }),
        mockAssetService);
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
