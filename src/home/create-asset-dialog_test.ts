import TestBase from '../testbase';
TestBase.init();

import Asset from '../model/asset';
import { CreateAssetDialogCtrl, CreateAssetDialogService } from './create-asset-dialog';

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
      $scope.createForm = { $valid: true };
      expect(ctrl.isValid()).toEqual(true);
    });

    it('should return false if the form is invalid', () => {
      $scope.createForm = { $valid: false };
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

describe('home.CreateAssetDialogService', () => {
  let mock$mdDialog;
  let service;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['show']);
    service = new CreateAssetDialogService(mock$mdDialog);
  });

  describe('show', () => {
    it('should call the $mdDialog service', () => {
      let $event = {};
      let promise = Promise.resolve();
      mock$mdDialog.show.and.returnValue(promise);

      expect(service.show($event)).toEqual(promise);
      expect(mock$mdDialog.show).toHaveBeenCalledWith(jasmine.objectContaining({
        targetEvent: $event
      }));
    });
  });
});
