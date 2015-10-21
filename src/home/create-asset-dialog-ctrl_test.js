import TestBase from '../testbase';

import Asset from '../data/asset';
import CreateAssetDialogCtrl from './create-asset-dialog-ctrl';

describe('home.CreateAssetDialogCtrl', () => {
  let mock$mdDialog;
  let $scope;
  let ctrl;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['hide', 'cancel']);
    $scope = {};
    ctrl = new CreateAssetDialogCtrl(mock$mdDialog, $scope);
  });

  describe('isValid', () => {
    it('should return true if the form is valid', () => {
      $scope.mainForm = { $valid: true };
      expect(ctrl.isValid()).toEqual(true);
    });

    it('should return false if the form is invalid', () => {
      $scope.mainForm = { $valid: false };
      expect(ctrl.isValid()).toEqual(false);
    });

    it('should return false if there are no forms', () => {
      expect(ctrl.isValid()).toEqual(false);
    });
  });

  describe('onCreateClick', () => {
    it('should hide the dialog with the new asset', () => {
      let name = 'name';
      $scope.name = name;
      ctrl.onCreateClick();

      expect(mock$mdDialog.hide).toHaveBeenCalledWith(jasmine.any(Asset));
      expect(mock$mdDialog.hide.calls.argsFor(0)[0].name).toEqual(name);
    });
  });

  describe('onCancelClick', () => {
    it('should cancel the dialog', () => {
      ctrl.onCancelClick();

      expect(mock$mdDialog.cancel).toHaveBeenCalledWith();
    });
  });
});
