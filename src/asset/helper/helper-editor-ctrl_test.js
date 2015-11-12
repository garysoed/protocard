import TestBase from '../../testbase';

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
    ctrl = new HelperEditorCtrl({ asset: asset, helper: helper }, mockAssetService);
  });

  describe('set helperString', () => {
    it('should update the value in the helper object', () => {
      let helperString = 'helperString';
      ctrl.helperString = helperString;

      expect(helper.fnString).toEqual(helperString);
    });
  });

  describe('isValid', () => {
    it('should return true is the helper string is not null', () => {
      helper.fnString = 'fnString';
      expect(ctrl.isValid()).toEqual(true);
    });

    it('should return false if the helper string is null', () => {
      helper.fnString = null;
      expect(ctrl.isValid()).toEqual(false);
    });
  });

  describe('onSaveClick', () => {
    it('should save the asset', () => {
      ctrl.onSaveClick();
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
    });
  });
});
