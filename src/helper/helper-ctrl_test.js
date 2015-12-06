import TestBase from '../testbase';

import FakeScope from '../testing/fake-scope';
import HelperCtrl from './helper-ctrl';
import { Events as HelperItemEvents } from './helper-item-ctrl';

describe('asset.subview.HelperCtrl', () => {
  let asset;
  let mock$scope;
  let mockAssetService;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    asset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toAsset']);
    mock$scope = new FakeScope();
    mock$scope.asset = asset;

    spyOn(mock$scope, '$on');
    ctrl = new HelperCtrl(mock$scope, mockAssetService, mockNavigateService);
  });

  it('should update and save the asset on HelperItem CHANGED event', () => {
    let helper = jasmine.createObj('Helper');
    let oldName = 'oldName';
    let newName = 'newName';
    asset.helpers = { [oldName]: helper };

    expect(mock$scope.$on).toHaveBeenCalledWith(HelperItemEvents.CHANGED, jasmine.any(Function));
    mock$scope.$on.calls.argsFor(0)[1]({}, oldName, newName);

    expect(asset.helpers).toEqual({ [newName]: helper });
    expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
  });

  it('should delete the helper and save the asset on HelperItem DELETED event', () => {
    let helper = jasmine.createObj('Helper');
    let name = 'name';
    asset.helpers = { [name]: helper };

    expect(mock$scope.$on).toHaveBeenCalledWith(HelperItemEvents.DELETED, jasmine.any(Function));
    mock$scope.$on.calls.argsFor(1)[1]({}, name);

    expect(asset.helpers).toEqual({});
    expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
  });

  it('should navigate to the helper editor on HelperItem EDITED event', () => {
    let id = 'id';
    let name = 'name';
    asset.id = id;

    expect(mock$scope.$on).toHaveBeenCalledWith(HelperItemEvents.EDITED, jasmine.any(Function));
    mock$scope.$on.calls.argsFor(2)[1]({}, name);

    expect(mockNavigateService.toAsset).toHaveBeenCalledWith(id, 'helper-editor', name);
  });

  describe('onAddClick', () => {
    it('should create a new helper, add it to the asset, and save it', () => {
      asset.helpers = {};

      ctrl.onAddClick();

      expect(Object.keys(asset.helpers).length).toEqual(1);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
    });
  });
});
