import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import GeneratorService from '../generate/generator-service';

export default class TemplateCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetService_: AssetService;
  private localDataList_: { [key: string]: any };
  private previewName_: string;
  private previewData_: any;
  private query_: string;
  private templateString_: string;

  constructor(
      $scope: angular.IScope,
      AssetService: AssetService,
      GeneratorService: GeneratorService) {
    // TODO(gs): Show errors when rendering.
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.localDataList_ = GeneratorService.generateNames($scope['asset']);
    this.previewName_ = null;
    this.previewData_ = null;
    this.query_ = '';
    this.templateString_ = this.asset_.templateString;
  }

  get asset(): Asset {
    return this.asset_;
  }

  get previewData(): any {
    let names = Object.keys(this.localDataList_);
    if (this.previewName_ === null && names.length > 0) {
      this.previewName_ = names[Math.floor(Math.random() * names.length)];
    }

    return this.previewName_ !== null ? this.localDataList_[this.previewName_] : null;
  }

  get query(): string {
    return this.previewName_;
  }
  set query(newQuery: string) {
    this.previewName_ = newQuery;
  }

  get templateString(): string {
    return this.templateString_;
  }
  set templateString(templateString: string) {
    this.templateString_ = templateString;
    if (templateString !== null) {
      this.asset_.templateString = templateString;
      this.assetService_.saveAsset(this.asset_);
    }
  }

  /**
   * Called when the refresh button is clicked.
   */
  onRefreshClick() {
    this.previewName_ = null;
  }
}
