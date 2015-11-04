import TestBase from '../testbase';

import CodeEditorCtrl, { Events } from './code-editor-ctrl';

describe('editor.CodeEditorCtrl', () => {
  let mock$scope;
  let mockAceService;
  let ctrl;

  beforeEach(() => {
    mock$scope = jasmine.createSpyObj('$scope', ['$emit', '$on', '$apply']);
    mockAceService = jasmine.createSpyObj('AceService', ['edit']);
    ctrl = new CodeEditorCtrl(mock$scope, mockAceService);
  });

  function createMockEditor() {
    let mockSession;
    let mockSelection;
    let mockEditor;

    mockSession = jasmine.
        createSpyObj('session', ['setTabSize', 'setMode', 'on', 'getAnnotations']);
    mockSelection = jasmine.createSpyObj('selection', ['clearSelection']);
    mockEditor = jasmine.createSpyObj(
        'editor', ['setTheme', 'getSession', 'getValue', 'setValue', 'destroy']);
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

      mockSession.getAnnotations.and.returnValue([]);
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

    it('should initialize isValid', () => {
      ctrl.onLink({}, 'language', {});

      expect(ctrl.isValid).toEqual(true);
    });

    it('should destroy the editor when receiving the $destroy event', () => {
      ctrl.onLink({}, 'language', {});

      expect(mock$scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
      mock$scope.$on.calls.argsFor(0)[1]();

      expect(mockEditor.destroy).toHaveBeenCalledWith();
    });

    it('should update the isValid value when receiving changeAnnotation event', () => {
      let annotations = ['a'];
      mockSession.getAnnotations.and.returnValue(annotations);

      ctrl.onLink({}, 'language', {});

      expect(mockSession.on).toHaveBeenCalledWith('changeAnnotation', jasmine.any(Function));
      mockSession.on.calls.argsFor(0)[1]();

      expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
      mock$scope.$apply.calls.argsFor(0)[0]();

      expect(ctrl.isValid).toEqual(false);
    });
  });

  describe('onSaveClick', () => {
    it('should emit the save event and update the model value', () => {
      let ngModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']);
      let newValue = 'newValue';

      let mocks = createMockEditor();
      let mockEditor = mocks.editor;
      mockEditor.getValue.and.returnValue(newValue);

      let mockSession = mocks.session;
      mockSession.getAnnotations.and.returnValue([]);
      mockAceService.edit.and.returnValue(mockEditor);

      ctrl.onLink({}, 'language', ngModelCtrl);
      ctrl.onSaveClick();

      expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(newValue);
      expect(mock$scope.$emit).toHaveBeenCalledWith(Events.SAVE);
    });
  });
});
