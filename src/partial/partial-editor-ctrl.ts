import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetService from '../asset/asset-service';
import Cache from '../decorator/cache';
import LabelNode from '../pipeline/label-node';
import PartialNode from '../pipeline/partial-node';
import Provider from '../util/provider';

export default class {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetService_: AssetService;
  private labelNode_: LabelNode;
  private name_: string;
  private partialNode_: PartialNode;
  private selectedKey_: string;
  private templateString_: string;

  /**
   * @constructor
   */
  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.name_ = $scope['name'];
    this.labelNode_ = AssetPipelineService.getPipeline(this.asset_.id).labelNode;
    this.partialNode_ = AssetPipelineService.getPipeline(this.asset_.id).partialNode;
    this.selectedKey_ = null;
    this.templateString_ = this.asset_.partials[this.name_];

    this.setSelectedKey_();
  }

  private setSelectedKey_(): Promise<any> {
    return this.labelNode_.result
        .then(result => {
          let labels = Object.keys(result.data);
          this.selectedKey_ = labels[Math.floor(Math.random() * labels.length)];
          Cache.clear(this);
          this.$scope_.$apply(() => {});
        });;
  }

  get asset(): Asset {
    return this.asset_;
  }

  @Cache
  get preview(): Provider<string> {
    return new Provider<string>(
        this.$scope_,
        this.partialNode_.result
            .then(partialsMap => {
              if (this.selectedKey === null) {
                return '';
              }

              if (!partialsMap[this.name_]) {
                return '';
              }

              return partialsMap[this.name_][this.selectedKey] || '';
            }),
        '');
  }

  get selectedKey(): string {
    return this.selectedKey_;
  }
  set selectedKey(newKey: string) {
    this.selectedKey_ = newKey;
    Cache.clear(this);
  }

  get templateString(): string {
    return this.templateString_;
  }
  set templateString(newString: string) {
    this.templateString_ = newString;
    if (newString !== null) {
      this.asset_.partials[this.name_] = newString;
      this.partialNode_.refresh();
      Cache.clear(this);
      this.assetService_.saveAsset(this.asset_);
    }
  }

  /**
   * Called when the refresh button is clicked.
   */
  onRefreshClick() {
    this.setSelectedKey_();
    Cache.clear(this);
  }
}
