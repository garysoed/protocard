import DriveDialogService from './drive-dialog-service';
import GapiServiceModule from '../common/gapi-service-module';

export default angular
    .module('pc.editor.DriveDialogModule', [
      GapiServiceModule.name
    ])
    .service('DriveDialogService', DriveDialogService);
