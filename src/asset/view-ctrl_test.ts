import TestBase from '../testbase';
TestBase.init();

import Asset from '../model/asset';
import { EventType as AssetServiceEventType } from '../asset/asset-service';
import DisposableFunction from '../util/disposable-function';
import FakeScope from '../testing/fake-scope';
import ViewCtrl from './view-ctrl';


describe('asset.ViewCtrl', () => {
  let asset;
  let routeParams;
  let mock$location;
  let mockAssetService;
  let mockNavigateService;
  let mockSettingsDialogService;
  let ctrl;
  let $scope;

  beforeEach(() => {
    $scope = new FakeScope();
    spyOn($scope, '$on').and.callThrough();

    routeParams = { 'assetId': 'assetId' };
    asset = new Asset('test');
    mock$location = jasmine.createSpyObj('$location', ['search']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['getSubview', 'toHome']);
    mockSettingsDialogService = jasmine.createSpyObj('SettingsDialogService', ['show']);

    mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset', 'on']);
    mockAssetService.getAsset.and.returnValue(asset);
    mockAssetService.on.and.returnValue(new DisposableFunction(() => {}));

    ctrl = new ViewCtrl(
        mock$location,
        $scope,
        routeParams,
        mockAssetService,
        mockNavigateService,
        mockSettingsDialogService);
    jasmine.addDisposable(ctrl);
  });

  it('should initialize correctly', () => {
    expect(ctrl.asset).toEqual(asset);
    expect(mockAssetService.getAsset).toHaveBeenCalledWith(routeParams['assetId']);
    expect(mockAssetService.on)
        .toHaveBeenCalledWith(AssetServiceEventType.SAVED, jasmine.any(Function));
  });

  describe('onAssetSaved_', () => {
    it('should set asset saved correctly and start a timer to reset it', () => {
      let setTimeoutSpy = spyOn(window, 'setTimeout');
      spyOn($scope, '$apply');

      mockAssetService.on.calls.argsFor(0)[1]();

      expect(ctrl.isAssetSaved).toEqual(true);
      expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));

      setTimeoutSpy.calls.argsFor(0)[0]();

      expect(ctrl.isAssetSaved).toEqual(false);
      expect($scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
    });
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

  describe('onSettingsClick', () => {
    it('should show the settings dialog', () => {
      let event = jasmine.createObj('mouseEvent');
      ctrl.onSettingsClick(event);

      expect(mockSettingsDialogService.show).toHaveBeenCalledWith(event, asset);
    });
  });
});
