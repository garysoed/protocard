import Asset from '../model/asset';
import AssetService from '../asset/asset-service';

export default class DataCtrl {
  private asset_: Asset;
  private assetService_: AssetService;
  private processorString_: string;

  constructor($scope: angular.IScope, AssetService: AssetService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.processorString_ = this.asset_.dataProcessor.fnString;
  }

  get processorString(): string {
    return this.processorString_;
  }
  set processorString(newValue: string) {
    this.processorString_ = newValue;
    if (newValue !== null) {
      this.asset_.dataProcessor.fnString = newValue;
      this.assetService_.saveAsset(this.asset_);
    }
  }
}
