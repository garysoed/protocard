import TestBase from '../testbase';

import CodeEditorCtrl, { Events } from './code-editor-ctrl';

describe('editor.CodeEditorCtrl', () => {
  let mock$scope;
  let mockAceService;
  let ctrl;

  beforeEach(() => {
    mock$scope = jasmine.createSpyObj('$scope', ['$emit']);
    mockAceService = jasmine.createSpyObj('AceService', ['edit']);
    ctrl = new CodeEditorCtrl(mock$scope, mockAceService);
  });

  function createMockEditor() {
    let mockSession;
    let mockSelection;
    let mockEditor;

    mockSession = jasmine.createSpyObj('session', ['setTabSize', 'setMode']);
    mockSelection = jasmine.createSpyObj('selection', ['clearSelection']);
    mockEditor = jasmine.createSpyObj('editor', ['setTheme', 'getSession', 'getValue', 'setValue']);
    mockEditor.getSession.and.returnValue(mockSession);
    mockEditor.selection = mockSelection;

    return {
      session: mockSession,
      selection: mockSelection,
      editor: mockEditor
    };
  }

  describe('onLink', () => {
    let mockSession;
    let mockSelection;
    let mockEditor;

    beforeEach(() => {
      let mocks = createMockEditor();
      mockSession = mocks.session;
      mockSelection = mocks.selection;
      mockEditor = mocks.editor;

      mockAceService.edit.and.returnValue(mockEditor);
    });

    it('should set the editor correctly', () => {
      let editorEl = {};
      let language = 'language';

      ctrl.onLink(editorEl, language, {});

      expect(mockSession.setMode).toHaveBeenCalledWith(`ace/mode/${language}`);
      expect(mockAceService.edit).toHaveBeenCalledWith(editorEl);
    });

    it('should override the ngModelCtrl render function to render to the editor', () => {
      let ngModelCtrl = {};

      ctrl.onLink({}, 'language', ngModelCtrl);

      let modelValue = 'modelValue';
      ngModelCtrl.$viewValue = modelValue;
      ngModelCtrl.$render();

      expect(mockEditor.setValue).toHaveBeenCalledWith(modelValue);
      expect(mockEditor.selection.clearSelection).toHaveBeenCalledWith();
    });

    it('should override the ngModelCtrl render function to render empty string when there are no view values', () => {
      let ngModelCtrl = {};

      ctrl.onLink({}, 'language', ngModelCtrl);

      ngModelCtrl.$viewValue = null;
      ngModelCtrl.$render();

      expect(mockEditor.setValue).toHaveBeenCalledWith('');
    });
  });

  describe('onSaveClick', () => {
    it('should emit the save event and update the model value', () => {
      let ngModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']);
      let newValue = 'newValue';

      let mockEditor = createMockEditor().editor;
      mockEditor.getValue.and.returnValue(newValue);
      mockAceService.edit.and.returnValue(mockEditor);

      ctrl.onLink({}, 'language', ngModelCtrl);
      ctrl.onSaveClick();

      expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(newValue);
      expect(mock$scope.$emit).toHaveBeenCalledWith(Events.SAVE);
    });
  });
});
