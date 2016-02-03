import Asset from '../model/asset';
import AssetPipelineService from '../pipeline/asset-pipeline-service';
import AssetService from '../asset/asset-service';
import Cache from '../decorator/cache';
import GeneratorService from '../generate/generator-service';
import LabelNode from '../pipeline/label-node';
import Provider from '../util/provider';
import TemplateNode from '../pipeline/template-node';
import RenderedData from '../model/rendered-data';

const SEARCH_TIMEOUT = 1000;

export default class TemplateCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetService_: AssetService;
  private isRenderMode_: boolean;
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
    this.isRenderMode_ = false;
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

  @Cache
  private get renderResult_(): Promise<RenderedData> {
    return this.templateNode_.result
        .then(results => {
          if (this.query_ === null) {
            return null;
          }

          return results[this.query_] || null;
        });
  }

  private setQuery_() {
    return this.labelNode_.result
        .then(result => {
          let labels = Object.keys(result.data);
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

  @Cache
  get isPreviewLoading(): Provider<boolean> {
    return new Provider(
        this.$scope_,
        this.renderResult_
            .then(result => {
              return result === null ?
                  Promise.resolve(false) :
                  result.dataUriTicket.promise.then(() => false);
            }),
        true);
  }

  get isRenderMode(): boolean {
    return this.isRenderMode_;
  }
  set isRenderMode(isRenderMode: boolean) {
    this.isRenderMode_ = isRenderMode;
  }

  get isSearchVisible(): boolean {
    return this.isSearchVisible_;
  }

  @Cache
  get preview(): Provider<string> {
    return new Provider(
        this.$scope_,
        this.renderResult_
            .then(result => {
              return result === null ? '' : result.htmlSource;
            }),
        '');
  }

  @Cache
  get previewDataUri(): Provider<string> {
    return new Provider(
        this.$scope_,
        this.renderResult_
            .then(result => {
              return result === null ? '' : result.dataUriTicket.promise
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
