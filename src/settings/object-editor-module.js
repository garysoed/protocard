import FieldEditorModule from './field-editor-module';
import ObjectEditorCtrl from './object-editor-ctrl';

export default angular
    .module('pc.settings.ObjectEditorModule', [
      FieldEditorModule.name
    ])
    .directive('pcObjectEditor', () => {
      return {
        controller: ObjectEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          index: '=',
          object: '='
        },
        templateUrl: './settings/object-editor.ng'
      };
    });
