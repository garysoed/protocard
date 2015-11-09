import TestBase from '../../testbase';

import FakeScope from '../../testing/fake-scope';
import HelperItemCtrl, { Events } from './helper-item-ctrl';

describe('asset.subview.HelperItemCtrl', () => {
  let helper;
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    helper = {};
    mock$scope = new FakeScope();
    mock$scope.helper = helper;
    ctrl = new HelperItemCtrl(mock$scope);
  });

  describe('set name', () => {
    it('should emit changed event', () => {
      let newName = 'newName';

      spyOn(mock$scope, '$emit');
      ctrl.name = newName;

      expect(helper.name).toEqual(newName);
      expect(mock$scope.$emit).toHaveBeenCalledWith(Events.CHANGED);
    });
  });
});
