import TestBase from '../testbase';

import CodeEditorCtrl from './code-editor-ctrl';

describe('editor.CodeEditorCtrl', () => {
  let mock$scope;
  let mock$timeout;
  let mockAceService;
  let ctrl;

  beforeEach(() => {
    mock$scope = jasmine.createSpyObj('$scope', ['$emit', '$on']);
    mock$timeout = jasmine.createSpy('$timeout');
    mockAceService = jasmine.createSpyObj('AceService', ['edit']);
    ctrl = new CodeEditorCtrl(mock$scope, mock$timeout, mockAceService);
  });

  function createMockEditor() {
    let mockRenderer;
    let mockSession;
    let mockSelection;
    let mockEditor;

    mockSession = jasmine.
        createSpyObj('session', ['setTabSize', 'setMode', 'on', 'getAnnotations']);
    mockSession.getAnnotations.and.returnValue([]);
    mockSelection = jasmine.createSpyObj('selection', ['clearSelection']);
    mockRenderer = jasmine.createSpyObj('Renderer', ['setShowGutter']);
    mockEditor = jasmine.createSpyObj(
        'editor',
        [
          'destroy',
          'setReadOnly',
          'getSession',
          'setShowPrintMargin',
          'setTheme',
          'getValue',
          'setValue'
        ]);
    mockEditor.getSession.and.returnValue(mockSession);
    mockEditor.renderer = mockRenderer;
    mockEditor.selection = mockSelection;

    return {
      renderer: mockRenderer,
      session: mockSession,
      selection: mockSelection,
      editor: mockEditor
    };
  }

  it('should destroy the editor when receiving the $destroy event', () => {
    let mocks = createMockEditor();
    mockAceService.edit.and.returnValue(mocks.editor);

    ctrl.onLink({}, 'language', {});

    expect(mock$scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
    mock$scope.$on.calls.argsFor(0)[1]();

    expect(mocks.editor.destroy).toHaveBeenCalledWith();
  });

  describe('onLink', () => {
    let mockRenderer;
    let mockSession;
    let mockSelection;
    let mockEditor;

    beforeEach(() => {
      let mocks = createMockEditor();
      mockRenderer = mocks.renderer;
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

      expect(mockEditor.setReadOnly).toHaveBeenCalledWith(false);
      expect(mockEditor.setShowPrintMargin).toHaveBeenCalledWith(true);
      expect(mockSession.setMode).toHaveBeenCalledWith(`ace/mode/${language}`);
      expect(mockAceService.edit).toHaveBeenCalledWith(editorEl);
      expect(mockRenderer.setShowGutter).toHaveBeenCalledWith(true);
    });

    it('should set the editor correctly for read only mode', () => {
      let editorEl = {};
      let language = 'language';

      mock$scope['readOnly'] = true;
      ctrl.onLink(editorEl, language, {});

      expect(mockEditor.setReadOnly).toHaveBeenCalledWith(true);
      expect(mockEditor.setShowPrintMargin).toHaveBeenCalledWith(false);
      expect(mockSession.setMode).toHaveBeenCalledWith(`ace/mode/${language}`);
      expect(mockAceService.edit).toHaveBeenCalledWith(editorEl);
      expect(mockRenderer.setShowGutter).toHaveBeenCalledWith(false);

    });

    it('should override the ngModelCtrl render function to render to the editor', () => {
      let ngModelCtrl = {};

      ctrl.onLink({}, 'language', ngModelCtrl);

      let modelValue = 'modelValue';
      ngModelCtrl['$viewValue'] = modelValue;
      ngModelCtrl['$render']();

      expect(mockEditor.setValue).toHaveBeenCalledWith(modelValue);
      expect(mockEditor.selection.clearSelection).toHaveBeenCalledWith();
    });

    it('should override the ngModelCtrl render function to render empty string when there are no view values', () => {
      let ngModelCtrl = {};

      ctrl.onLink({}, 'language', ngModelCtrl);

      ngModelCtrl['$viewValue'] = null;
      ngModelCtrl['$render']();

      expect(mockEditor.setValue).toHaveBeenCalledWith('');
    });

    it('should initialize isValid', () => {
      ctrl.onLink({}, 'language', {});

      expect(ctrl.isValid).toEqual(true);
    });
  });

  describe('onEditorChangeAnnotation_', () => {
    let onChangeAnnotationHandler;
    let mockEditor;
    let mockNgModelCtrl;
    let mockSession;

    beforeEach(() => {
      let mocks = createMockEditor();
      mockEditor = mocks.editor;
      mockNgModelCtrl = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']);
      mockSession = mocks.session;
      mockAceService.edit.and.returnValue(mockEditor);

      ctrl.onLink({}, 'language', mockNgModelCtrl);
      onChangeAnnotationHandler = mockSession.on.calls.argsFor(0)[1];
    });

    it('should trigger digest and update the model view value', () => {
      let value = 'value';
      mockEditor.getValue.and.returnValue(value);
      mockSession.getAnnotations.and.returnValue([{ 'type': 'info' }]);

      onChangeAnnotationHandler();

      expect(mock$timeout).toHaveBeenCalledWith(jasmine.any(Function));
      mock$timeout.calls.argsFor(0)[0]();

      expect(mockNgModelCtrl.$setViewValue).toHaveBeenCalledWith(value);
    });

    it('should update the model view value to null if invalid', () => {
      mockSession.getAnnotations.and.returnValue([{ 'type': 'error' }]);

      onChangeAnnotationHandler();

      expect(mock$timeout).toHaveBeenCalledWith(jasmine.any(Function));
      mock$timeout.calls.argsFor(0)[0]();

      expect(mockNgModelCtrl.$setViewValue).toHaveBeenCalledWith(null);
    });
  });
});
