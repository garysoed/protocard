import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetService from '../asset/asset-service';
import Cache from '../decorators/cache'; // TODO(gs): decorators -> decorator
import GeneratorService from '../generate/generator-service';
import LabelNode from '../pipeline/label-node';
import Provider from '../util/provider';
import TemplateNode from '../pipeline/template-node';

const SEARCH_TIMEOUT = 3000;

export default class TemplateCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetService_: AssetService;
  private isSearchFocused_: boolean;
  private isSearchVisible_: boolean;
  private labelNode_: LabelNode;
  private query_: string;
  private searchVisibleTimeoutId_: number;
  private templateNode_: TemplateNode;
  private templateString_: string;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService,
      GeneratorService: GeneratorService) {
    // TODO(gs): Show errors when rendering.
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.isSearchFocused_ = false;
    this.isSearchVisible_ = false;
    this.query_ = null;
    this.searchVisibleTimeoutId_ = null;
    this.templateString_ = this.asset_.templateString;

    let assetPipeline = AssetPipelineService.getPipeline(this.asset_.id);
    this.labelNode_ = assetPipeline.labelNode;
    this.templateNode_ = assetPipeline.templateNode;

    this.showSearch_();
  }

  private setQuery_() {
    return this.labelNode_.result
        .then(labelsMap => {
          let labels = Object.keys(labelsMap);
          this.query_ = labels[Math.floor(Math.random() * labels.length)];
          Cache.clear(this);
          this.$scope_.$apply(() => {});
        })
  }

  private showSearch_() {
    this.isSearchVisible_ = true;

    if (this.searchVisibleTimeoutId_ !== null) {
      window.clearTimeout(this.searchVisibleTimeoutId_);
    }

    this.searchVisibleTimeoutId_ = window.setTimeout(
        () => {
          if (!this.isSearchFocused_) {
            this.isSearchVisible_ = false;
            this.searchVisibleTimeoutId_ = null;
            this.$scope_.$apply(() => {});
          }
        },
        SEARCH_TIMEOUT);
  }

  get asset(): Asset {
    return this.asset_;
  }

  get isSearchVisible(): boolean {
    return this.isSearchVisible_;
  }

  @Cache
  get preview(): Provider<string> {
    return new Provider(
        this.$scope_,
        this.templateNode_.result
            .then(results => {
              if (this.query_ === null) {
                return '';
              }

              if (!results[this.query_]) {
                return '';
              }

              return results[this.query_].htmlSource;
            }),
        '');
  }

  get query(): string {
    if (this.query_ === null) {
      this.setQuery_();
    }
    return this.query_;
  }
  set query(newQuery: string) {
    this.query_ = newQuery;
    Cache.clear(this);
  }

  get templateString(): string {
    return this.templateString_;
  }
  set templateString(templateString: string) {
    // TODO(gs): Use imprecise match, fuse.js
    this.templateString_ = templateString;
    if (templateString !== null) {
      this.asset_.templateString = templateString;
      this.templateNode_.refresh();
      Cache.clear(this);
      this.assetService_.saveAsset(this.asset_);
    }
  }

  onSearchBlur() {
    this.isSearchFocused_ = false;
    this.showSearch_();
  }

  onSearchFocus() {
    this.isSearchFocused_ = true;
  }

  onSearchMouseOver() {
    this.showSearch_();
  }

  /**
   * Called when the refresh button is clicked.
   */
  onRefreshClick() {
    this.query_ = null;
    Cache.clear(this);
  }
}
