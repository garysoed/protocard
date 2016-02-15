import AssetNamePickerCtrl from './asset-name-picker-ctrl';
import AssetPipelineServiceModule from '../pipeline/asset-pipeline-service-module';

function link(
    scope: angular.IScope,
    element: angular.IAugmentedJQuery,
    attr: angular.IAttributes,
    ctrls: any[]): void {
  let [assetNamePickerCtrl, ngModelCtrl] = ctrls;
  assetNamePickerCtrl.onLink(element[0], ngModelCtrl);
}

export default angular
    .module('pc.common.AssetNamePickerModule', [
      AssetPipelineServiceModule.name
    ])
    .directive('pcAssetNamePicker', () => {
      return {
        controller: AssetNamePickerCtrl,
        controllerAs: 'ctrl',
        link: link,
        require: ['pcAssetNamePicker', 'ngModel'],
        restrict: 'E',
        scope: {
          'asset': '=',
          'onFocus': '&',
          'onBlur': '&',
        },
        templateUrl: './common/asset-name-picker.ng',
      };
    });
