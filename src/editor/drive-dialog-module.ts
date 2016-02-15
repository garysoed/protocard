import DriveDialogService from './drive-dialog-service';
import GapiServiceModule from '../common/gapi-service-module';
import ImageSelectModule from './image-select-module';

export default angular
    .module('pc.editor.DriveDialogModule', [
      GapiServiceModule.name,
      ImageSelectModule.name,
    ])
    .service('DriveDialogService', DriveDialogService);
