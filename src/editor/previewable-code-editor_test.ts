import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import { PreviewableCodeEditorCtrl } from './previewable-code-editor';

describe('editor.PreviewableCodeEditorCtrl', () => {
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    mock$scope = FakeScope.create();
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
