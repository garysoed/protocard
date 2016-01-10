import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import FunctionObject from '../model/function-object';

export default class HelperEditorCtrl {
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
