import TestBase from '../../testbase';

import FakeScope from '../../testing/fake-scope';
import HelperCtrl from './helper-ctrl';
import { Events as HelperItemEvents } from './helper-item-ctrl';

describe('asset.subview.HelperCtrl', () => {
  let asset;
  let mock$scope;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    asset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mock$scope = new FakeScope();
    mock$scope.asset = asset;
    ctrl = new HelperCtrl(mock$scope, mockAssetService);
  });

  it('should save the asset on HelperItem CHANGED event', () => {
    spyOn(mock$scope, '$on');
    ctrl = new HelperCtrl(mock$scope, mockAssetService);

    expect(mock$scope.$on).toHaveBeenCalledWith(HelperItemEvents.CHANGED, jasmine.any(Function));
    mock$scope.$on.calls.argsFor(0)[1]();

    expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
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
