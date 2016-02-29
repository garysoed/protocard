import DriveDialogService from './drive-dialog-service';
import GapiServiceModule from '../common/gapi-service';
import ImageSelectModule from './image-select-module';

export default angular
    .module('editor.DriveDialogModule', [
      GapiServiceModule.name,
      ImageSelectModule.name,
    ])
    .service('DriveDialogService', DriveDialogService);
