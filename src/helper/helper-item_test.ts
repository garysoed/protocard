import TestBase from '../testbase';
TestBase.init();

import { HelperItemCtrl } from './helper-item';


describe('helper.HelperItemCtrl', () => {
  let ctrl;

  beforeEach(() => {
    ctrl = new HelperItemCtrl();
  });

  describe('$onInit', () => {
    it('should set the old name', () => {
      let name = 'name';
      ctrl.name = name;
      ctrl.$onInit();
      expect(ctrl['oldName_']).toEqual(name);
    });
  });

  describe('onDeleteClick', () => {
    it('should emit deleted event', () => {
      let name = 'name';
      let mockOnDelete = jasmine.createSpy('onDelete');
      ctrl.onDelete = mockOnDelete;

      ctrl.name = name;

      ctrl.onDeleteClick();

      expect(mockOnDelete).toHaveBeenCalledWith({ name: name });
    });
  });

  describe('onEditClick', () => {
    it('should emit edited event', () => {
      let name = 'name';
      let mockOnEdit = jasmine.createSpy('onEdit');
      ctrl.onEdit = mockOnEdit;

      ctrl.name = name;
      ctrl.onEditClick();

      expect(mockOnEdit).toHaveBeenCalledWith({ name: name });
    });
  });

  describe('onInputChange', () => {
    it('should call the onChanged handler', () => {
      let mockOnChange = jasmine.createSpy('onChange');
      ctrl.onChange = mockOnChange;

      let oldName = 'oldName';
      let newName = 'newName';

      ctrl['oldName_'] = oldName;

      ctrl.name = newName;
      ctrl.onInputChange();

      expect(mockOnChange).toHaveBeenCalledWith({ newName: newName, oldName: oldName });
    });
  });
});
