import TestBase from '../testbase';

import AccordionCtrl, { __height__ } from './accordion-ctrl';

describe('common.AccordionCtrl', () => {
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    ctrl = new AccordionCtrl();
  });

  describe('onHeaderClick', () => {
    it('should flip the expansion state and update the height', () => {
      let height = 123;
      let isExpanded = ctrl.isExpanded;
      let contentEl = jasmine.createSpyObj('contentEl', ['getBoundingClientRect']);
      contentEl.getBoundingClientRect.and.returnValue({ 'height': height });
      contentEl.style = {};
      ctrl.onLink(contentEl);

      ctrl.onHeaderClick();
      expect(ctrl.isExpanded).toEqual(false);
      expect(contentEl.style.height).toEqual('0');

      ctrl.onHeaderClick();
      expect(ctrl.isExpanded).toEqual(true);
      expect(contentEl.style.height).toEqual(`${height}px`);
    });

    it('should throw error if onLink has not been called', () => {
      expect(() => { ctrl.onHeaderClick(); }).toThrowError(/element found/);
    });
  });

  describe('onLink', () => {
    it('should initialize the element height', () => {
      let height = 123;
      let contentEl = jasmine.createSpyObj('contentEl', ['getBoundingClientRect']);
      contentEl.getBoundingClientRect.and.returnValue({ 'height': height });
      contentEl.style = {};

      ctrl.onLink(contentEl);
      expect(contentEl.style.height).toEqual(`${height}px`);
    });
  });
});
