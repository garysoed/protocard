import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../testing/fake-scope';
import { Events, HelperItemCtrl } from './helper-item';

describe('helper.HelperItemCtrl', () => {
  let helper;
  let name;
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    helper = {};
    name = 'name';
    mock$scope = new FakeScope();
    mock$scope.helper = helper;
    mock$scope.name = name;
    ctrl = new HelperItemCtrl(mock$scope);
  });

  describe('set name', () => {
    it('should emit changed event', () => {
      let newName = 'newName';

      spyOn(mock$scope, '$emit');
      ctrl.name = newName;

      expect(ctrl.name).toEqual(newName);
      expect(mock$scope.$emit).toHaveBeenCalledWith(Events.CHANGED, name, newName);
    });
  });

  describe('onDeleteClick', () => {
    it('should emit deleted event', () => {
      spyOn(mock$scope, '$emit');

      ctrl.onDeleteClick();
      expect(mock$scope.$emit).toHaveBeenCalledWith(Events.DELETED, name);
    });
  });

  describe('onEditClick', () => {
    it('should emit edited event', () => {
      spyOn(mock$scope, '$emit');

      ctrl.onEditClick();
      expect(mock$scope.$emit).toHaveBeenCalledWith(Events.EDITED, name);
    });
  });
});
