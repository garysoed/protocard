import AssetServiceModule from '../data/asset-service-module';
import EditGlobalsDialogModule from '../settings/edit-globals-dialog-module';
import SettingsCardCtrl from './settings-card-ctrl';

export default angular
    .module('pc.asset.SettingsCardModule', [
      'ngMaterial',
      AssetServiceModule.name,
      EditGlobalsDialogModule.name
    ])
    .directive('pcSettingsCard', () => {
      return {
        controller: SettingsCardCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '='
        },
        templateUrl: './asset/settings-card.ng'
      };
    });
