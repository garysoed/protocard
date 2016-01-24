import Asset from '../model/asset';
import DownloadService from '../common/download-service';
import Extract from '../convert/extract';
import Generator from '../generate/generator';
import GeneratorService from '../generate/generator-service';
import ImageResource from '../model/image-resource';
import RenderService from './render-service';
import Utils from '../utils';

/**
 * @class asset.render.RenderCtrl
 */
export default class {
  private $scope_: angular.IScope;
  private asset_: Asset;
  private destroyed_: boolean;
  private downloadService_: DownloadService;
  private generatorService_: GeneratorService;
  private isFabOpen_: boolean;
  private jszipService_: JSZip;
  private lastError_: string;
  private rendered_: ImageResource[];
  private renderService_: RenderService;
  private selectedImages_: ImageResource[];
  private toRender_: { key: string; content: string }[];
  private totalRender_: number;

  constructor(
      $scope: angular.IScope,
      DownloadService: DownloadService,
      GeneratorService: GeneratorService,
      JszipService: JSZip,
      RenderService: RenderService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.destroyed_ = false;
    this.downloadService_ = DownloadService;
    this.generatorService_ = GeneratorService;
    this.isFabOpen_ = false;
    this.jszipService_ = JszipService;
    this.lastError_ = null;
    this.rendered_ = [];
    this.renderService_ = RenderService;
    this.selectedImages_ = [];
    this.toRender_ = [];
    this.totalRender_ = 0;
  }

  /**
   * Called when the controller is destroyed.
   */
  private onDestroy_() {
    this.destroyed_ = true;
  }

  /**
   * Renders the next content.
   *
   * @return Promise that will be resolved when the next content has been rendered.
   */
  private renderNext_(): Promise<void> {
    let entry = this.toRender_.pop();
    if (entry && !this.destroyed_) {
      // TODO(gs): Add size to asset.
      return this.renderService_.render(entry.content, 825, 1125)
          .then(dataUri => {
            this.rendered_.push(new ImageResource(entry.key, dataUri));
            this.$scope_.$apply(() => {});
            return this.renderNext_();
          });
    } else {
      return Promise.resolve();
    }
  }

  /**
   * Unselects all images.
   */
  private unselectAll_() {
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
  isRendering(): boolean {
    return this.toRender_.length > 0;
  }

  /**
   * Handler called when the download button is clicked.
   */
  onDownloadClick() {
    let zip = this.jszipService_();
    this.selectedImages_.forEach(image => {
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
  onFabMouseEnter() {
    this.isFabOpen_ = true;
  }

  /**
   * Handler called when the mouse leaves the fab button.
   */
  onFabMouseLeave() {
    this.isFabOpen_ = false;
  }

  /**
   * Called when the directive is initialized.
   */
  onInit() {
    this.$scope_.$on('$destroy', this.onDestroy_.bind(this));

    this.lastError_ = null;

    try {
      let generatedHtml = this.generatorService_.generate(
          this.asset_,
          this.generatorService_.localDataList(this.asset_),
          this.asset_.templateString,
          this.asset_.templateName);

      this.rendered_ = [];
      this.toRender_ = [];
      for (let key in generatedHtml) {
        this.toRender_.push({ key: key, content: generatedHtml[key] });
      }
      this.totalRender_ = this.toRender_.length;

      this.renderNext_();
    } catch (e) {
      this.lastError_ = e;
    }
  }

  /**
   * Handler called when the select all button is clicked.
   */
  onSelectAllClick() {
    this.unselectAll_();
    this.images.forEach(image => {
      this.selectedImages_.push(image);
    });
  }

  /**
   * Handler called when the unselect all button is clicked.
   */
  onUnselectAllClick() {
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
