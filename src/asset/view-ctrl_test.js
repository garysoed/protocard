import TestBase from '../testbase';

import Asset from '../data/asset';
import ViewCtrl from './view-ctrl';

describe('asset.ViewCtrl', () => {
  let asset;
  let routeParams;
  let mockAssetService
  let mockNavigateService;
  let ctrl;
  let $scope;

  beforeEach(() => {
    $scope = {};
    routeParams = {};
    asset = new Asset('test');
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toHome', 'toAsset']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    ctrl = new ViewCtrl(
        $scope,
        routeParams,
        mockAssetService,
        mockNavigateService);
  });

  describe('onInit', () => {
    it('should redirect to home page if the asset does not exist', () => {
      let assetId = 'assetId';
      mockAssetService.getAsset.and.returnValue(null);
      routeParams['assetId'] = assetId;
      ctrl.onInit();

      expect(mockNavigateService.toHome).toHaveBeenCalledWith();
      expect(mockAssetService.getAsset).toHaveBeenCalledWith(assetId);
    });

    it('should not redirect to home page if the asset exists and initialize the current helper', () => {
      let helperName = 'helperName';
      let helper = {};
      asset.helpers[helperName] = helper;
      routeParams['assetId'] = 'assetId';
      routeParams['section'] = 'helper-editor';
      routeParams['helper'] = helperName;
      mockAssetService.getAsset.and.returnValue(asset);
      ctrl.onInit();

      expect(mockNavigateService.toHome).not.toHaveBeenCalled();
      expect(ctrl.subview).toEqual('helper-editor');
      expect(ctrl.currentHelper).toEqual(helper);
    });
  });

  describe('get assetName', () => {
    it('should return the asset name', () => {
      mockAssetService.getAsset.and.returnValue(asset);
      ctrl.onInit();
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
      mockAssetService.getAsset.and.returnValue(asset);
      ctrl.onInit();

      let newSubview = 'newSubview';
      ctrl.onNavigateClick(newSubview);

      expect(mockNavigateService.toAsset).toHaveBeenCalledWith(asset.id, newSubview);
    });
  });
});
