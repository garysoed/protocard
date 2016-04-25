import TestBase from '../testbase';
TestBase.init();

import { HelperEditorCtrl } from './helper-editor';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';


describe('helper.HelperEditorCtrl', () => {
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    ctrl = new HelperEditorCtrl(mockAssetService);
  });

  describe('onCodeChange', () => {
    let mockAsset;
    let mockHelper;

    beforeEach(() => {
      mockAsset = Mocks.object('Asset');
      mockHelper = Mocks.object('Helper');

      ctrl.asset = mockAsset;
      ctrl.helper = mockHelper;
    });

    it('should update the value in the helper object and saves it if non null', () => {
      let helperString = 'helperString';
      ctrl.onCodeChange(helperString);

      expect(ctrl.helperString).toEqual(helperString);
      expect(mockHelper.fnString).toEqual(helperString);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });

    it('should update the value but not the helper if null', () => {
      let oldValue = 'oldValue';
      mockHelper.fnString = oldValue;
      ctrl.onCodeChange(null);

      expect(ctrl.helperString).toEqual(null);
      expect(mockHelper.fnString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });
});
