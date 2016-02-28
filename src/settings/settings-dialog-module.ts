import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';
import AssetServiceModule from '../asset/asset-service';
import DownloadServiceModule from '../common/download-service-module';
import NavigateServiceModule from '../navigate/navigate-service-module';
import SettingsDialogService from './settings-dialog-service';

export default angular
    .module('pc.settings.SettingsDialogModule', [
      AssetPipelineServiceModule.name,
      AssetServiceModule.name,
      DownloadServiceModule.name,
      NavigateServiceModule.name,
    ])
    .service('SettingsDialogService', SettingsDialogService);
