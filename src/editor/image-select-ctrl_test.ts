import TestBase from '../testbase';
TestBase.init();

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
      let mockNgModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']);
      mockNgModelCtrl.$viewValue = [];
      ctrl.onLink(mockNgModelCtrl);
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
      mockNgModelCtrl.$viewValue = [];
      ctrl.onLink(mockNgModelCtrl);
    });

    it('should select the image if it is not selected', () => {
      let image = 'image';
      ctrl.select(image);
      expect(mockNgModelCtrl.$viewValue).toEqual([image]);
    });

    it('should unselect the image if it is selected', () => {
      let image = 'image';
      ctrl.select(image);
      ctrl.select(image);
      expect(mockNgModelCtrl.$viewValue).toEqual([]);
    });
  });

  describe('selectedCssFor', () => {
    beforeEach(() => {
      let mockNgModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']);
      mockNgModelCtrl.$viewValue = [];
      ctrl.onLink(mockNgModelCtrl);
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
