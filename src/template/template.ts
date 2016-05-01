import Asset from '../model/asset';
import AssetPipelineServiceModule, { AssetPipelineService }
    from '../pipeline/asset-pipeline-service';
import { AssetService } from '../asset/asset-service';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import ContextButtonModule from '../common/context-button';
import GeneratorServiceModule, { GeneratorService } from '../generate/generator-service';
import LabelNode from '../pipeline/label-node';
import Provider from '../util/provider';
import RenderServiceModule from '../render/render-service';
import RenderedData from '../model/rendered-data';
import TemplateNode from '../pipeline/template-node';


const SEARCH_TIMEOUT = 1000;


export class TemplateCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private assetPipelineService_: AssetPipelineService;
  private assetService_: AssetService;
  private isRenderMode_: boolean;
  private isSearchFocused_: boolean;
  private isSearchVisible_: boolean;
  private labelNode_: LabelNode;
  private query_: string;
  private searchVisibleTimeoutId_: number;
  private templateNode_: TemplateNode;
  private templateString_: string;
  private zoom_: number;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      AssetService: AssetService,
      GeneratorService: GeneratorService) {
    // TODO(gs): Show errors when rendering.
    this.$scope_ = $scope;
    this.assetPipelineService_ = AssetPipelineService;
    this.assetService_ = AssetService;
    this.isRenderMode_ = false;
    this.isSearchFocused_ = false;
    this.isSearchVisible_ = false;
    this.query_ = null;
    this.searchVisibleTimeoutId_ = null;
    this.zoom_ = 100;
  }

  @Cache()
  private get renderResult_(): Promise<RenderedData> {
    return this.templateNode_.result
        .then((results: { [key: string]: RenderedData }) => {
          if (this.query_ === null) {
            return null;
          }

          return results[this.query_] || null;
        });
  }

  private setQuery_(): Promise<any> {
    return this.labelNode_.result
        .then((result: { data: { [key: string]: any } }) => {
          let labels = Object.keys(result.data);
          this.query_ = labels[Math.floor(Math.random() * labels.length)];
          Cache.clear(this);
          this.$scope_.$apply(() => undefined);
        });
  }

  private showSearch_(): void {
    this.isSearchVisible_ = true;

    if (this.searchVisibleTimeoutId_ !== null) {
      window.clearTimeout(this.searchVisibleTimeoutId_);
    }

    this.searchVisibleTimeoutId_ = window.setTimeout(
        () => {
          if (!this.isSearchFocused_) {
            this.isSearchVisible_ = false;
            this.searchVisibleTimeoutId_ = null;
            this.$scope_.$apply(() => undefined);
          }
        },
        SEARCH_TIMEOUT);
  }

  $onInit(): void {
    let assetPipeline = this.assetPipelineService_.getPipeline(this.asset.id);
    this.labelNode_ = assetPipeline.labelNode;
    this.templateNode_ = assetPipeline.templateNode;
    this.templateString_ = this.asset.templateString;

    this.showSearch_();
    this.setQuery_();
  }

  get asset(): Asset {
    return this.asset_;
  }
  set asset(asset: Asset) {
    this.asset_ = asset;
  }

  @Cache()
  get isPreviewLoading(): Provider<boolean> {
    return new Provider(
        this.$scope_,
        this.renderResult_
            .then((result: RenderedData) => {
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

  onCodeChange(newValue: string): void {
    this.templateString_ = newValue;
    if (newValue !== null) {
      this.asset_.templateString = newValue;
      this.templateNode_.refresh();
      Cache.clear(this);
      this.assetService_.saveAsset(this.asset_);
    }
  }

  @Cache()
  get preview(): Provider<string> {
    let style = `transform: scale(${this.zoom_ / 100}); transform-origin: 0 0;`;
    return new Provider(
        this.$scope_,
        this.renderResult_
            .then((result: RenderedData) => {
              return result === null ? '' : `<html style="${style}">${result.htmlSource}</html>`;
            }),
        '');
  }

  @Cache()
  get previewDataUri(): Provider<string> {
    return new Provider(
        this.$scope_,
        this.renderResult_
            .then((result: RenderedData) => {
              return result === null ? '' : result.dataUriTicket.promise;
            }),
        '');
  }

  get query(): string {
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
    this.templateString_ = templateString;
  }

  onSearchBlur(): void {
    this.isSearchFocused_ = false;
    this.showSearch_();
  }

  onSearchFocus(): void {
    this.isSearchFocused_ = true;
  }

  onSearchMouseOver(): void {
    this.showSearch_();
  }

  /**
   * Called when the refresh button is clicked.
   */
  onRefreshClick(): void {
    this.setQuery_();
    Cache.clear(this);
  }

  get zoom(): number {
    return this.zoom_;
  }
  set zoom(zoom: number) {
    this.zoom_ = zoom;
    Cache.clear(this);
  }
}


export default angular
    .module('template.TemplateModule', [
      AssetPipelineServiceModule.name,
      ContextButtonModule.name,
      GeneratorServiceModule.name,
      RenderServiceModule.name,
    ])
    .component('pcTemplate', {
      bindings: {
        'asset': '=',
      },
      controller: TemplateCtrl,
      templateUrl: 'src/template/template.ng',
    });
