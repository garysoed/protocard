import TestBase from '../testbase';
TestBase.init();

import { CodeEditorCtrl } from './code-editor';


describe('editor.CodeEditorCtrl', () => {
  let mock$element;
  let mock$scope;
  let mock$timeout;
  let mockAceService;
  let ctrl;

  beforeEach(() => {
    mock$element = jasmine.createSpyObj('$element', ['querySelector']);
    mock$scope = jasmine.createSpyObj('$scope', ['$emit', '$on']);
    mock$timeout = jasmine.createSpy('$timeout');
    mockAceService = jasmine.createSpyObj('AceService', ['edit']);
    ctrl = new CodeEditorCtrl(<any> [mock$element], mock$scope, mock$timeout, mockAceService);
  });

  describe('onEditorChangeAnnotation_', () => {
    let mockEditor;
    let mockOnChange;
    let mockSession;

    beforeEach(() => {
      mockEditor = jasmine.createSpyObj('Editor', ['getSession', 'getValue']);
      mockOnChange = jasmine.createSpy('OnChange');
      mockSession = jasmine.createSpyObj('Session', ['getAnnotations']);

      mockEditor.getSession.and.returnValue(mockSession);

      ctrl.onChange = mockOnChange;
      ctrl['editor_'] = mockEditor;

      mockAceService.edit.and.returnValue(mockEditor);
    });

    it('should trigger digest and update the model view value', () => {
      let value = 'value';
      mockEditor.getValue.and.returnValue(value);
      mockSession.getAnnotations.and.returnValue([{ 'type': 'info' }]);

      ctrl['onEditorChangeAnnotation_']();

      expect(mock$timeout).toHaveBeenCalledWith(jasmine.any(Function));
      mock$timeout.calls.argsFor(0)[0]();
      expect(mockOnChange).toHaveBeenCalledWith({ newValue: value });
    });

    it('should update the model view value to null if invalid', () => {
      mockSession.getAnnotations.and.returnValue([{ 'type': 'error' }]);

      ctrl['onEditorChangeAnnotation_']();

      expect(mock$timeout).toHaveBeenCalledWith(jasmine.any(Function));
      mock$timeout.calls.argsFor(0)[0]();
      expect(mockOnChange).toHaveBeenCalledWith({ newValue: null });
    });
  });

  describe('$onChanges', () => {
    let mockEditor;

    beforeEach(() => {
      mockEditor = jasmine.createSpyObj('Editor', ['getValue', 'setValue']);
      ctrl['editor_'] = mockEditor;
    });

    it('should update the value if initValue changes', () => {
      let newValue = 'newValue';

      ctrl.initValue = newValue;
      ctrl.$onChanges({ 'initValue': {} });

      expect(mockEditor.setValue).toHaveBeenCalledWith(newValue);
    });

    it('should be noop if the value do not change', () => {
      let newValue = 'newValue';
      mockEditor.getValue.and.returnValue(newValue);

      ctrl.initValue = newValue;
      ctrl.$onChanges({ 'initValue': {} });

      expect(mockEditor.setValue).not.toHaveBeenCalled();
    });

    it('should be noop if the new value is null', () => {
      mockEditor.getValue.and.returnValue('oldValue');

      ctrl.initValue = null;
      ctrl.$onChanges({ 'initValue': {} });

      expect(mockEditor.setValue).not.toHaveBeenCalled();
    });
  });

  describe('$onDestroy', () => {
    it('should destroy the editor', () => {
      let mock$editor = jasmine.createSpyObj('$editor', ['destroy']);
      ctrl['editor_'] = mock$editor;
      ctrl.$onDestroy();
      expect(mock$editor.destroy).toHaveBeenCalledWith();
    });
  });

  describe('$onInit', () => {
    let mockRenderer;
    let mockSession;
    let mockSelection;
    let mockEditor;

    beforeEach(() => {
      mockEditor = jasmine.createSpyObj(
          'Editor', ['getSession', 'setReadOnly', 'setShowPrintMargin', 'setTheme', 'setValue']);
      mockSelection = jasmine.createSpyObj('Selection', ['clearSelection']);
      mockSession = jasmine.createSpyObj(
          'Session', ['getAnnotations', 'on', 'setMode', 'setTabSize']);
      mockRenderer = jasmine.createSpyObj('Renderer', ['setShowGutter']);

      mockEditor.getSession.and.returnValue(mockSession);
      mockEditor.renderer = mockRenderer;
      mockEditor.selection = mockSelection;
      mockSession.getAnnotations.and.returnValue([]);
      mockAceService.edit.and.returnValue(mockEditor);
    });

    it('should set the editor correctly', () => {
      let initValue = 'initValue';
      let editorEl = {};
      let language = 'language';

      mock$element.querySelector.and.returnValue(editorEl);

      ctrl.initValue = initValue;
      ctrl.language = language;
      ctrl.readonly = false;

      spyOn(ctrl, 'onEditorChangeAnnotation_');

      ctrl.$onInit();

      expect(mockEditor.setReadOnly).toHaveBeenCalledWith(false);
      expect(mockEditor.setShowPrintMargin).toHaveBeenCalledWith(true);
      expect(mockEditor.setValue).toHaveBeenCalledWith(initValue);
      expect(mockSession.setMode).toHaveBeenCalledWith(`ace/mode/${language}`);
      expect(mockAceService.edit).toHaveBeenCalledWith(editorEl);
      expect(mock$element.querySelector).toHaveBeenCalledWith('.editor');
      expect(mockRenderer.setShowGutter).toHaveBeenCalledWith(true);
      expect(ctrl['editor_']).toEqual(mockEditor);
      expect(mockSelection.clearSelection).toHaveBeenCalledWith();

      expect(mockSession.on).toHaveBeenCalledWith('changeAnnotation', jasmine.any(Function));
      mockSession.on.calls.argsFor(0)[1]();
      expect(ctrl['onEditorChangeAnnotation_']).toHaveBeenCalledWith();
    });

    it('should set the editor correctly for read only mode', () => {
      let editorEl = {};
      let language = 'language';

      mock$element.querySelector.and.returnValue(editorEl);

      ctrl.language = language;
      ctrl.readonly = true;
      ctrl.$onInit();

      expect(mockEditor.setReadOnly).toHaveBeenCalledWith(true);
      expect(mockEditor.setShowPrintMargin).toHaveBeenCalledWith(false);
      expect(mockSession.setMode).toHaveBeenCalledWith(`ace/mode/${language}`);
      expect(mockAceService.edit).toHaveBeenCalledWith(editorEl);
      expect(mock$element.querySelector).toHaveBeenCalledWith('.editor');
      expect(mockRenderer.setShowGutter).toHaveBeenCalledWith(false);
    });

    it('should default readonly to false', () => {
      mock$element.querySelector.and.returnValue({});

      ctrl.language = 'language';
      ctrl.$onInit();

      expect(ctrl.readonly).toEqual(false);
    });
  });
});
