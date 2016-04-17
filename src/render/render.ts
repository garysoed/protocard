import Asset from '../model/asset';
import { AssetPipelineService } from '../pipeline/asset-pipeline-service';
import ContextButtonModule from '../common/context-button';
import DownloadServiceModule, { DownloadService } from '../common/download-service';
import ErrorDisplayModule from '../common/error-display';
import ExportNode from '../pipeline/export-node';
import GeneratorServiceModule from '../generate/generator-service';
import ImageResource from '../model/image-resource';
import JszipServiceModule from '../thirdparty/jszip-service';
import RenderServiceModule, { RenderService } from './render-service';

// TODO(gs): Rename to export
export class RenderCtrl {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private destroyed_: boolean;
  private downloadService_: DownloadService;
  private exportNode_: ExportNode;
  private isFabOpen_: boolean;
  private jszipService_: JSZip;
  private lastError_: string;
  private rendered_: ImageResource[];
  private selectedImages_: ImageResource[];
  private totalRender_: number;

  constructor(
      $scope: angular.IScope,
      AssetPipelineService: AssetPipelineService,
      DownloadService: DownloadService,
      JszipService: JSZip,
      RenderService: RenderService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.destroyed_ = false;
    this.downloadService_ = DownloadService;
    this.exportNode_ = AssetPipelineService.getPipeline(this.asset_.id).exportNode;
    this.isFabOpen_ = false;
    this.jszipService_ = JszipService;
    this.lastError_ = null;
    this.rendered_ = [];
    this.selectedImages_ = [];
    this.totalRender_ = 0;
  }

  /**
   * Called when the controller is destroyed.
   */
  private onDestroy_(): void {
    this.destroyed_ = true;
  }

  private renderAll_(): Promise<any> {
    return this.exportNode_.result
        .then(
            (imageResourcePromises: Promise<ImageResource>[]) => {
              this.totalRender_ = imageResourcePromises.length;
              return Promise.all(imageResourcePromises.map((promise: Promise<ImageResource>) => {
                return promise
                    .then(
                        (imageResource: ImageResource) => {
                          this.rendered_.push(imageResource);
                        },
                        (error: string) => {
                          this.lastError_ = error;
                        })
                    .then(() => {
                      this.$scope_.$apply(() => undefined);
                    });
              }));
            },
            (error: string) => {
              this.lastError_ = error;
            })
        .then(() => {
          this.$scope_.$apply(() => undefined);
        });
  }

  /**
   * Unselects all images.
   */
  private unselectAll_(): void {
    this.selectedImages_.splice(0, this.selectedImages_.length);
  }

  hasLastError(): boolean {
    return this.lastError_ !== null;
  }

  /**
   * @return True iff there are images selected.
   */
  hasSelectedImages(): boolean {
    return this.selectedImages_.length > 0;
  }

  /**
   * @return True iff there are items to render.
   */
  get isRendering(): boolean {
    return (this.totalRender_ - this.images.length) > 0;
  }

  /**
   * Handler called when the download button is clicked.
   */
  onDownloadClick(): void {
    let zip = this.jszipService_();
    this.selectedImages_.forEach((image: ImageResource) => {
      let imageData = image.url.substring(image.url.indexOf(',') + 1);
      zip.file(`${image.alias}.png`, imageData, { base64: true });
    });
    let content = zip.generate({ type: 'blob' });
    this.downloadService_.download(content, `${this.asset_.name}.zip`);
    this.unselectAll_();
  }

  /**
   * Handler called when the mouse enters the fab button.
   */
  onFabMouseEnter(): void {
    this.isFabOpen_ = true;
  }

  /**
   * Handler called when the mouse leaves the fab button.
   */
  onFabMouseLeave(): void {
    this.isFabOpen_ = false;
  }

  /**
   * Called when the directive is initialized.
   */
  onInit(): void {
    this.$scope_.$on('$destroy', this.onDestroy_.bind(this));
    this.renderAll_();
  }

  /**
   * Handler called when the select all button is clicked.
   */
  onSelectAllClick(): void {
    this.unselectAll_();
    this.images.forEach((image: ImageResource) => {
      this.selectedImages_.push(image);
    });
  }

  /**
   * Handler called when the unselect all button is clicked.
   */
  onUnselectAllClick(): void {
    this.unselectAll_();
  }

  get images(): ImageResource[] {
    return this.rendered_;
  }

  get isFabOpen(): boolean {
    return this.isFabOpen_;
  }
  set isFabOpen(open: boolean) {
    this.isFabOpen_ = open;
  }

  get lastError(): string {
    return this.lastError_;
  }

  get renderedCount(): number {
    return this.images.length;
  }

  get totalCount(): number {
    return this.totalRender_;
  }

  get percentDone(): number {
    return this.renderedCount * 100 / this.totalCount;
  }

  get selectedImages(): ImageResource[] {
    return this.selectedImages_;
  }
  set selectedImages(images: ImageResource[]) {
    this.selectedImages_ = images;
  }
}

export default angular
    .module('render.RenderModule', [
      ContextButtonModule.name,
      DownloadServiceModule.name,
      ErrorDisplayModule.name,
      JszipServiceModule.name,
      GeneratorServiceModule.name,
      RenderServiceModule.name,
    ])
    .directive('pcRender', () => {
      return {
        controller: RenderCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'asset': '=',
        },
        templateUrl: 'src/render/render.ng',
      };
    });
