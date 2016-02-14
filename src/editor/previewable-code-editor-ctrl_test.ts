import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../testing/fake-scope';
import PreviewableCodeEditorCtrl from './previewable-code-editor-ctrl';

describe('editor.PreviewableCodeEditorCtrl', () => {
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    mock$scope = new FakeScope({});
    ctrl = new PreviewableCodeEditorCtrl(mock$scope);
  });

  describe('set codeString', () => {
    let mockNgModelCtrl;

    it('should update the model controller', () => {
      let newCodeString = 'newCodeString';
      mockNgModelCtrl = jasmine.createSpyObj('NgModelCtrl', ['$setViewValue']);
      ctrl.onLink(mockNgModelCtrl);

      ctrl.codeString = newCodeString;
      expect(mockNgModelCtrl.$setViewValue).toHaveBeenCalledWith(newCodeString);
    });
  });
});
