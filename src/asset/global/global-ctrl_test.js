import TestBase from '../../testbase';

import { Events as CodeEditorEvents } from '../../editor/code-editor-ctrl';
import GlobalCtrl from './global-ctrl';

describe('asset.subview.GlobalCtrl', () => {
  let mockAssetService;
  let mockAsset;
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mock$scope = jasmine.createSpyObj('$scope', ['$on']);
    mock$scope['asset'] = mockAsset;

    ctrl = new GlobalCtrl(mock$scope, mockAssetService);
  });

  it('should initialize globalsString to the value in the asset', () => {
    let globalsString = 'globalsString';
    mockAsset.globalsString = globalsString;
    ctrl = new GlobalCtrl(mock$scope, mockAssetService);
    expect(ctrl.globalsString).toEqual(globalsString);
  });

  describe('isValid', () => {
    it('should return true if the globals string is non null', () => {
      ctrl.globalsString = 'blah';
      expect(ctrl.isValid()).toEqual(true);
    });

    it('should return false if the globals string is null', () => {
      ctrl.globalsString = null;
      expect(ctrl.isValid()).toEqual(false);
    });
  });

  describe('onSaveClick', () => {
    it('should update the asset and save it', () => {
      let newValue = 'newValue';
      ctrl.globalsString = newValue;
      ctrl.onSaveClick();

      expect(mockAsset.globalsString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });
  });
});
