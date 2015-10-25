import FieldEditorCtrl from './field-editor-ctrl';

export default angular
    .module('pc.settings.FieldEditorModule', [])
    .directive('pcFieldEditor', () => {
      return {
        controller: FieldEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          field: '='
        },
        templateUrl: './settings/field-editor.ng'
      };
    });
