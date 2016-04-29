import TestBase from '../testbase';
TestBase.init();

import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import { PartialCtrl } from './partial';


describe('partial.PartialCtrl', () => {
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    ctrl = new PartialCtrl(mockAssetService);
  });

  describe('onAddClick', () => {
    it('should create a new unique partial and saves it', () => {
      let mockAsset = Mocks.object('Asset');
      mockAsset.partials = {};

      ctrl.asset = mockAsset;
      ctrl.onAddClick();

      expect(mockAsset.partials).toEqual({ 'partial': jasmine.any(String) });
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });
  });
});
