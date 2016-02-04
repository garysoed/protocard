import AssetNamePickerCtrl from './asset-name-picker-ctrl';
import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';

function link(scope, element, attr, ctrls) {
  let [assetNamePickerCtrl, ngModelCtrl] = ctrls;
  assetNamePickerCtrl.onLink(ngModelCtrl);
}

export default angular
    .module('pc.common.AssetNamePickerModule', [
      AssetPipelineServiceModule.name
    ])
    .directive('pcAssetNamePicker', () => {
      return {
        controller: AssetNamePickerCtrl,
        controllerAs: 'ctrl',
        require: ['pcAssetNamePicker', 'ngModel'],
        restrict: 'E',
        scope: {
          'asset': '='
        },
        templateUrl: './common/asset-name-picker.ng',
        link: link
      };
    });
