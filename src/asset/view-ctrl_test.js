import TestBase from '../testbase';

import Asset from '../data/asset';
import ViewCtrl from './view-ctrl';

describe('asset.ViewCtrl', () => {
  let asset;
  let mockNavigateService;
  let ctrl;
  let $scope;

  beforeEach(() => {
    $scope = {};
    asset = new Asset('test');
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toHome', 'toAsset']);

    let mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    mockAssetService.getAsset.and.returnValue(asset);
    ctrl = new ViewCtrl(
        $scope,
        { assetId: 'assetId', section: 'section' },
        mockAssetService,
        mockNavigateService);
  });

  describe('onInit', () => {
    let mockAssetService;

    beforeEach(() => {
      mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    });

    it('should redirect to home page if the asset does not exist', () => {
      let assetId = 'assetId';
      mockAssetService.getAsset.and.returnValue(null);
      ctrl = new ViewCtrl(
          $scope,
          { assetId: 'assetId', section: 'section' },
          mockAssetService,
          mockNavigateService);
      ctrl.onInit();

      expect(mockNavigateService.toHome).toHaveBeenCalledWith();
      expect(mockAssetService.getAsset).toHaveBeenCalledWith(assetId);
    });

    it('should not redirect to home page if the asset exists', () => {
      mockAssetService.getAsset.and.returnValue(asset);
      ctrl.onInit();

      expect(mockNavigateService.toHome).not.toHaveBeenCalled();
    });

    it('should set the subview in the $scope', () => {
      ctrl.onInit();

      expect($scope['subview']).toEqual('section');
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
