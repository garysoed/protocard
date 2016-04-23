import TestBase from '../testbase';
TestBase.init();

import { PreviewableCodeEditorCtrl } from './previewable-code-editor';


describe('editor.PreviewableCodeEditorCtrl', () => {
  let ctrl;

  beforeEach(() => {
    ctrl = new PreviewableCodeEditorCtrl();
  });

  describe('set codeString', () => {
    it('should update the model controller', () => {
      let newCodeString = 'newCodeString';
      let mockNgModel = jasmine.createSpyObj('NgModel', ['$setViewValue']);
      ctrl.ngModel = mockNgModel;

      ctrl.codeString = newCodeString;
      expect(mockNgModel.$setViewValue).toHaveBeenCalledWith(newCodeString);
    });
  });
});
