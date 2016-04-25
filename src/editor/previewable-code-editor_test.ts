import TestBase from '../testbase';
TestBase.init();

import { PreviewableCodeEditorCtrl } from './previewable-code-editor';


describe('editor.PreviewableCodeEditorCtrl', () => {
  let ctrl;

  beforeEach(() => {
    ctrl = new PreviewableCodeEditorCtrl();
  });

  describe('onCodeChange', () => {
    it('should call the onChange handler', () => {
      let newCodeString = 'newCodeString';
      let mockOnChange = jasmine.createSpy('OnChange');
      ctrl.onChange = mockOnChange;
      ctrl.onCodeChange(newCodeString);
      expect(mockOnChange).toHaveBeenCalledWith({ newValue: newCodeString });
    });
  });
});
