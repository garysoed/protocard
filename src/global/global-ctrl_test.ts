import TestBase from '../testbase';

import GlobalCtrl from './global-ctrl';

describe('asset.subview.GlobalCtrl', () => {
  let mockAssetService;
  let mockAsset;
  let mock$mdToast;
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mock$mdToast = jasmine.createSpyObj('$mdToast', ['show', 'simple']);
    mock$scope = jasmine.createSpyObj('$scope', ['$on']);
    mock$scope['asset'] = mockAsset;

    ctrl = new GlobalCtrl(mock$mdToast, mock$scope, mockAssetService);
  });

  it('should initialize globalsString to the value in the asset', () => {
    let globalsString = 'globalsString';
    mockAsset.globalsString = globalsString;
    ctrl = new GlobalCtrl(mock$mdToast, mock$scope, mockAssetService);
    expect(ctrl.globalsString).toEqual(globalsString);
  });

  describe('isValid', () => {
    beforeEach(() => {
      let $mdToastBuilder =
          jasmine.createSpyBuilder('$mdToastBuilder', ['textContent', 'position']);
      mock$mdToast.simple.and.returnValue($mdToastBuilder);
    });

    it('should return true if the globals string is non null', () => {
      ctrl.globalsString = 'blah';
      expect(ctrl.isValid()).toEqual(true);
    });

    it('should return false if the globals string is null', () => {
      ctrl.globalsString = null;
      expect(ctrl.isValid()).toEqual(false);
    });
  });

  describe('set globalsString', () => {
    it('should update the asset and save it if set to non null', () => {
      let newValue = 'newValue';
      let $mdToastBuilder =
          jasmine.createSpyBuilder('$mdToastBuilder', ['textContent', 'position']);
      mock$mdToast.simple.and.returnValue($mdToastBuilder);

      ctrl.globalsString = newValue;

      expect(ctrl.globalsString).toEqual(newValue);
      expect(mockAsset.globalsString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mock$mdToast.show).toHaveBeenCalledWith($mdToastBuilder);
    });

    it('should update the globalsString but not save it if null', () => {
      let oldValue = 'oldValue';
      mockAsset.globalsString = oldValue;

      ctrl.globalsString = null;

      expect(ctrl.globalsString).toEqual(null);
      expect(mockAsset.globalsString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });
});
