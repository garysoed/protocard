import TestBase from '../testbase';
TestBase.init();

import HelperEditorCtrl from './helper-editor-ctrl';

describe('asset.subview.HelperEditorCtrl', () => {
  let asset;
  let helper;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    asset = {};
    helper = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    let scope = <angular.IScope> {};
    scope['asset'] = asset;
    scope['helper'] = helper;
    ctrl = new HelperEditorCtrl(scope, mockAssetService);
  });

  describe('set helperString', () => {
    it('should update the value in the helper object and saves it if non null', () => {
      let helperString = 'helperString';
      ctrl.helperString = helperString;

      expect(ctrl.helperString).toEqual(helperString);
      expect(helper.fnString).toEqual(helperString);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
    });

    it('should update the value but not the helper if null', () => {
      let oldValue = 'oldValue';
      helper.fnString = oldValue;
      ctrl.helperString = null;

      expect(ctrl.helperString).toEqual(null);
      expect(helper.fnString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });
});
