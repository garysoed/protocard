import TestBase from '../testbase';
TestBase.init();

import { ImageSelectCtrl } from './image-select';

describe('editor.ImageSelectCtrl', () => {
  let ctrl;

  beforeEach(() => {
    ctrl = new ImageSelectCtrl();
  });

  describe('isSelected', () => {
    beforeEach(() => {
      let mockNgModel = jasmine.createSpyObj('ngModel', ['$setViewValue']);
      mockNgModel.$viewValue = [];
      ctrl.ngModel = mockNgModel;
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
    let mockNgModel;

    beforeEach(() => {
      mockNgModel = jasmine.createSpyObj('NgModel', ['$setViewValue']);
      mockNgModel.$viewValue = [];
      ctrl.ngModel = mockNgModel;
    });

    it('should select the image if it is not selected', () => {
      let image = 'image';
      ctrl.select(image);
      expect(mockNgModel.$viewValue).toEqual([image]);
    });

    it('should unselect the image if it is selected', () => {
      let image = 'image';
      ctrl.select(image);
      ctrl.select(image);
      expect(mockNgModel.$viewValue).toEqual([]);
    });
  });

  describe('selectedCssFor', () => {
    beforeEach(() => {
      let mockNgModel = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']);
      mockNgModel.$viewValue = [];
      ctrl.ngModel = mockNgModel;
    });

    it('should return selected if the image is selected', () => {
      let image = 'image';
      ctrl.select(image);
      expect(ctrl.selectedCssFor(image)).toEqual('selected');
    });

    it('should return empty string if the image is not selected', () => {
      expect(ctrl.selectedCssFor('image')).toEqual('');
    });
  });
});
