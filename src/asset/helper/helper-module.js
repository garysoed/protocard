import AssetServiceModule from '../../data/asset-service-module';
import HelperCtrl from './helper-ctrl';
import HelperItemModule from './helper-item-module';

export default angular
    .module('pc.asset.subview.HelperModule', [
      AssetServiceModule.name,
      HelperItemModule.name
    ])
    .directive('pcAssetHelper', () => {
      return {
        controller: HelperCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './asset/helper/helper.ng'
      };
    });
