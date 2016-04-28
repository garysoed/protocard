import TestBase from '../testbase';
TestBase.init();

import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import { NavigateButtonCtrl } from './navigate-button';

describe('navigate.NavigateButtonCtrl', () => {
  let mock$scope;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    mock$scope = FakeScope.create();

    mockNavigateService = jasmine.createSpyObj('NavigateService', ['getSubview', 'toSubview']);

    ctrl = new NavigateButtonCtrl(mock$scope, mockNavigateService);
    TestDispose.add(ctrl);
  });

  describe('selectedCss', () => {
    it(`should return 'selected' for exact match`, () => {
      let subview = 'subview';

      mockNavigateService.getSubview.and.returnValue(subview);

      ctrl.subview = subview;
      expect(ctrl.selectedCss).toEqual('selected');
    });

    it(`should return 'selected' for parent hierarchy match`, () => {
      let subview = 'subview';

      mockNavigateService.getSubview.and.returnValue(`${subview}.subsubview`);

      ctrl.subview = subview;
      expect(ctrl.selectedCss).toEqual('selected');
    });

    it(`should return '' if there are no subviews`, () => {
      mockNavigateService.getSubview.and.returnValue(null);
      ctrl.subview = 'subview';
      expect(ctrl.selectedCss).toEqual('');
    });

    it(`should return '' for no match`, () => {
      mockNavigateService.getSubview.and.returnValue('othersubview');
      ctrl.subview = 'subview';
      expect(ctrl.selectedCss).toEqual('');
    });

    it(`should return '' for parent hierarchy unmatch`, () => {
      mockNavigateService.getSubview.and.returnValue('subviewblah');
      ctrl.subview = 'subview';
      expect(ctrl.selectedCss).toEqual('');
    });
  });

  describe('onClick', () => {
    it('should navigate to the correct subview', () => {
      let subview = 'subview';

      ctrl.subview = subview;
      ctrl.onClick();

      expect(mockNavigateService.toSubview).toHaveBeenCalledWith(subview);
    });
  });
});
