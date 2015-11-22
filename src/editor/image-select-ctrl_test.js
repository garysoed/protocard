import TestBase from '../testbase';

import ImageSelectCtrl from './image-select-ctrl';

describe('editor.ImageSelectCtrl', () => {
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    mock$scope = {};
    ctrl = new ImageSelectCtrl(mock$scope);
  });

  describe('isSelected', () => {
    beforeEach(() => {
      ctrl.onLink(jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']));
    });

    it('should return true if the given image is selected', () => {
      let image = 'image';
      ctrl.select(image);
      expect(ctrl.isSelected(image)).toEqual(true);
    });

    it('should return false if the given image is not selected', () => {
      expect(ctrl.isSelected('image')).toEqual(false);
    });
  });

  describe('select', () => {
    let mockNgModelCtrl;

    beforeEach(() => {
      mockNgModelCtrl = jasmine.createSpyObj('NgModelCtrl', ['$setViewValue']);
      ctrl.onLink(mockNgModelCtrl);
    });

    it('should select the image if it is not selected', () => {
      let image = 'image';
      ctrl.select(image);
      expect(mockNgModelCtrl.$setViewValue).toHaveBeenCalledWith([image]);
    });

    it('should unselect the image if it is selected', () => {
      let image = 'image';
      ctrl.select(image);

      mockNgModelCtrl.$setViewValue.calls.reset();
      ctrl.select(image);
      expect(mockNgModelCtrl.$setViewValue).toHaveBeenCalledWith([]);
    });
  });
});
