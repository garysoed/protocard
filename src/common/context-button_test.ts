import TestBase from '../testbase';
TestBase.init();

import { ContextButtonCtrl } from './context-button';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';


describe('common.ContextButtonCtrl', () => {
  let mock$element;
  let mock$transclude;
  let ctrl;

  beforeEach(() => {
    mock$element = Mocks.builder('$element', ['find', 'replaceWith']);
    mock$transclude = jasmine.createSpy('$transclude');
    ctrl = new ContextButtonCtrl(mock$element, mock$transclude);
  });

  describe('$onInit', () => {
    it('should replace the ng transclude element with the transclude clone', () => {
      let mockClone = Mocks.object('Clone');

      spyOn(mock$element, 'find').and.callThrough();
      spyOn(mock$element, 'replaceWith').and.callThrough();

      ctrl.$onInit();

      expect(mock$transclude).toHaveBeenCalledWith(jasmine.any(Function));
      mock$transclude.calls.argsFor(0)[0](mockClone);

      expect(mock$element.find).toHaveBeenCalledWith('ng-transclude');
      expect(mock$element.replaceWith).toHaveBeenCalledWith(mockClone);
    });
  });
});
