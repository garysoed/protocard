import EditGlobalsDialogService from './edit-globals-dialog-service';
import ObjectEditorModule from './object-editor-module';

export default angular
    .module('pc.settings.EditGlobalsDialogModule', [
      ObjectEditorModule.name
    ])
    .service('EditGlobalsDialogService', EditGlobalsDialogService);
