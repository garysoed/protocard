import Asset from '../model/asset';
import AssetServiceModule, { AssetService } from '../asset/asset-service';
import CodeEditorModule from '../editor/code-editor';
import FunctionObject from '../model/function-object';

export class HelperEditorCtrl {
  private assetService_: AssetService;
  private asset_: Asset;
  private helper_: FunctionObject;
  private helperString_: string;

  constructor($scope: angular.IScope, AssetService: AssetService) {
    this.assetService_ = AssetService;
    this.asset_ = $scope['asset'];
    this.helper_ = $scope['helper'];
    this.helperString_ = this.helper_.fnString;
  }

  get helperString(): string {
    return this.helperString_;
  }
  set helperString(newValue: string) {
    this.helperString_ = newValue;
    if (newValue !== null) {
      this.helper_.fnString = newValue;
      this.assetService_.saveAsset(this.asset_);
    }
  }
}


export default angular
    .module('helper.HelperEditorModule', [
      AssetServiceModule.name,
      CodeEditorModule.name,
    ])
    .directive('pcHelperEditor', () => {
      return {
        controller: HelperEditorCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          asset: '=',
          helper: '=',
        },
        templateUrl: 'src/helper/helper-editor.ng',
      };
    });
