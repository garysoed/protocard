import Asset from '../model/asset';
import AssetNamePickerModule from '../common/asset-name-picker';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import { AssetService } from '../asset/asset-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import ContextButtonModule from '../common/context-button';
import LabelNode from '../pipeline/label-node';
import PartialNode from '../pipeline/partial-node';
import Provider from '../util/provider';

export class PartialEditorCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
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
    this.assetPipelineService_ = AssetPipelineService;
    this.assetService_ = AssetService;
  }

  private setSelectedKey_(): Promise<any> {
    return this.labelNode_.result
        .then((result: { data: { [key: string]: any } }) => {
          let labels = Object.keys(result.data);
          this.selectedKey_ = labels[Math.floor(Math.random() * labels.length)];
          Cache.clear(this);
          this.$scope_.$apply(() => undefined);
        });
  }

  $onInit(): void {
    let pipeline = this.assetPipelineService_.getPipeline(this.asset.id);
    this.labelNode_ = pipeline.labelNode;
    this.partialNode_ = pipeline.partialNode;
    this.templateString_ = this.asset.partials[this.name];
    this.setSelectedKey_();
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  get name(): string {
    return this.name_;
  }
  set name(name: string) {
    this.name_ = name;
  }

  onCodeChange(newValue: string): void {
    this.templateString_ = newValue;
    if (newValue !== null) {
      this.asset_.partials[this.name_] = newValue;
      this.partialNode_.refresh();
      Cache.clear(this);
      this.assetService_.saveAsset(this.asset_);
    }
  }

  @Cache()
  get preview(): Provider<string> {
    return new Provider<string>(
        this.$scope_,
        this.partialNode_.result
            .then((partialsMap: { [key: string]: { [key: string]: string } }) => {
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
  }

  /**
   * Called when the refresh button is clicked.
   */
  onRefreshClick(): void {
    this.setSelectedKey_();
    Cache.clear(this);
  }
}

export default angular
    .module('partial.PartialEditorModule', [
      AssetNamePickerModule.name,
      AssetPipelineServiceModule.name,
      ContextButtonModule.name,
    ])
    .component('pcPartialEditor', {
      bindings: {
        'asset': '<',
        'name': '<',
      },
      controller: PartialEditorCtrl,
      templateUrl: 'src/partial/partial-editor.ng',
    });
