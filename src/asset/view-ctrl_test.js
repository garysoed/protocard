import TestBase from '../testbase';

import Asset from '../data/asset';
import ViewCtrl from './view-ctrl';

describe('asset.ViewCtrl', () => {
  let asset;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    asset = new Asset('test');
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toHome', 'toAsset']);

    let mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    mockAssetService.getAsset.and.returnValue(asset);
    ctrl = new ViewCtrl({ assetId: 'assetId' }, mockAssetService, mockNavigateService);
  });

  describe('constructor', () => {
    let mockAssetService;

    beforeEach(() => {
      mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    });

    it('should redirect to home page if the asset does not exist', () => {
      let assetId = 'assetId';
      mockAssetService.getAsset.and.returnValue(null);
      new ViewCtrl({ assetId: assetId }, mockAssetService, mockNavigateService);

      expect(mockNavigateService.toHome).toHaveBeenCalledWith();
      expect(mockAssetService.getAsset).toHaveBeenCalledWith(assetId);
    });

    it('should not redirect to home page if the asset exists', () => {
      mockAssetService.getAsset.and.returnValue(asset);
      new ViewCtrl({ assetId: 'assetId' }, mockAssetService, mockNavigateService);

      expect(mockNavigateService.toHome).not.toHaveBeenCalled();
    });
  });

  describe('get assetName', () => {
    it('should return the asset name', () => {
      expect(ctrl.assetName).toEqual(asset.name);
    });
  });

  describe('onBackClick', () => {
    it('should redirect to the home page', () => {
      ctrl.onBackClick();
      expect(mockNavigateService.toHome).toHaveBeenCalledWith();
    });
  });

  describe('onNavigateClick', () => {
    it('should navigate to the right subview', () => {
      let newSubview = 'newSubview';
      ctrl.onNavigateClick(newSubview);

      expect(mockNavigateService.toAsset).toHaveBeenCalledWith(asset.id, newSubview);
    });
  });
});
