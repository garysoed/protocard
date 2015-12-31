import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import GeneratorService from '../generate/generator-service';

export default class {
  private asset_: Asset;
  private assetService_: AssetService;
  private localDataList_: any[];
  private name_: string;
  private previewData_: any;
  private templateString_: string;

  /**
   * @constructor
   */
  constructor(
      $scope: angular.IScope,
      AssetService: AssetService,
      GeneratorService: GeneratorService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.localDataList_ = GeneratorService.localDataList($scope['asset']);
    this.name_ = $scope['name'];
    this.previewData_ = null;
    this.templateString_ = this.asset_.partials[this.name_];
  }

  get asset(): Asset {
    return this.asset_;
  }

  get templateString(): string {
    return this.templateString_;
  }
  set templateString(newString: string) {
    this.templateString_ = newString;
    if (newString !== null) {
      this.asset_.partials[this.name_] = newString;
      this.assetService_.saveAsset(this.asset_);
    }
  }

  get previewData(): any {
    if (this.previewData_ === null && this.localDataList_.length > 0) {
      this.previewData_ =
          this.localDataList_[Math.floor(Math.random() * this.localDataList_.length)];
    }
    return this.previewData_;
  }

  /**
   * Called when the refresh button is clicked.
   */
  onRefreshClick() {
    this.previewData_ = null;
  }
}
