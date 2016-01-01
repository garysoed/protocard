import TestBase from '../testbase';

import Asset from '../model/asset';
import FakeScope from '../testing/fake-scope';
import ViewCtrl from './view-ctrl';

describe('asset.ViewCtrl', () => {
  let asset;
  let routeParams;
  let mock$location;
  let mockAssetService;
  let mockNavigateService;
  let ctrl;
  let $scope;

  beforeEach(() => {
    $scope = new FakeScope();
    spyOn($scope, '$on');

    routeParams = { 'assetId': 'assetId' };
    asset = new Asset('test');
    mock$location = jasmine.createSpyObj('$location', ['search']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['getSubview', 'toHome']);

    mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    mockAssetService.getAsset.and.returnValue(asset);

    ctrl = new ViewCtrl(
        mock$location,
        $scope,
        routeParams,
        mockAssetService,
        mockNavigateService);
  });

  it('should load the correct asset', () => {
    expect(ctrl.asset).toEqual(asset);
    expect(mockAssetService.getAsset).toHaveBeenCalledWith(routeParams['assetId']);
  });

  describe('onRouteUpdate_', () => {
    it('should setup correctly for partial editor', () => {
      let partialName = 'partialName';

      mockNavigateService.getSubview.and.returnValue('partial.editor');
      mock$location.search.and.returnValue({ 'subitem': partialName });

      expect($scope.$on).toHaveBeenCalledWith('$routeUpdate', jasmine.any(Function));
      $scope.$on.calls.argsFor(0)[1]();

      expect(ctrl.subview).toEqual('partial.editor');
      expect(ctrl.currentPartialName).toEqual(partialName);
    });

    it('should setup correctly for helper editor', () => {
      let helperId = 'helperId';
      let helper = jasmine.createObj('helper');
      asset.helpers[helperId] = helper;

      mockNavigateService.getSubview.and.returnValue('helper.editor');
      mock$location.search.and.returnValue({ 'subitem': helperId });

      expect($scope.$on).toHaveBeenCalledWith('$routeUpdate', jasmine.any(Function));
      $scope.$on.calls.argsFor(0)[1]();

      expect(ctrl.subview).toEqual('helper.editor');
      expect(ctrl.currentHelper).toEqual(helper);
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

  describe('onMenuClick', () => {
    it('should flip the sidebar open status', () => {
      ctrl.isSidebarOpen = false;
      ctrl.onMenuClick();
      expect(ctrl.isSidebarOpen).toEqual(true);

      ctrl.onMenuClick();
      expect(ctrl.isSidebarOpen).toEqual(false);
    });
  });
});
