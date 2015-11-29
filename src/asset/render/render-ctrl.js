import Extract from '../../convert/extract';
import Generator from '../../generate/generator';
import ImageResource from '../../data/image-resource';
import Utils from '../../utils';

/**
 * @class asset.render.RenderCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.Scope} $scope
   * @param {common.DownloadService} DownloadService
   * @param {generator.GeneratorService} GeneratorService
   * @param {thirdparty.JszipService} JszipService
   * @param {asset.render.RenderService} RenderService
   */
  constructor($scope, DownloadService, GeneratorService, JszipService, RenderService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.destroyed_ = false;
    this.downloadService_ = DownloadService;
    this.generatorService_ = GeneratorService;
    this.jszipService_ = JszipService;
    this.renderService_ = RenderService;
    this.toRender_ = [];
    this.rendered_ = [];
    this.selectedImages_ = [];
    this.totalRender_ = 0;
    this.isFabOpen_ = false;
  }

  /**
   * Called when the controller is destroyed.
   *
   * @method onDestroy_
   */
  onDestroy_() {
    this.destroyed_ = true;
  }

  /**
   * Renders the next content.
   *
   * @method renderNext_
   * @return {Promise} Promise that will be resolved when the next content has been rendered.
   * @private
   */
  renderNext_() {
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
   *
   * @method unselectAll_
   * @private
   */
  unselectAll_() {
    this.selectedImages_.splice(0, this.selectedImages_.length);
  }

  /**
   * @method hasSelectedImages
   * @return {Boolean} True iff there are images selected.
   */
  hasSelectedImages() {
    return this.selectedImages_.length > 0;
  }

  /**
   * @method isLoading
   * @return {Boolean} True iff there are items to render.
   */
  isRendering() {
    return this.toRender_.length > 0;
  }

  /**
   * Handler called when the download button is clicked.
   *
   * @method onDownloadClick
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
   *
   * @method onFabMouseEnter
   */
  onFabMouseEnter() {
    this.isFabOpen_ = true;
  }

  /**
   * Handler called when the mouse leaves the fab button.
   *
   * @method onFabMouseLeave
   */
  onFabMouseLeave() {
    this.isFabOpen_ = false;
  }

  /**
   * Called when the directive is initialized.
   *
   * @method onInit
   */
  onInit() {
    this.$scope_.$on('$destroy', this.onDestroy_.bind(this));

    // TODO(gs): Add Partials to asset
    // TODO(gs): Add name to asset
    let generatedHtml = this.generatorService_
        .generate(this.asset_, this.generatorService_.localDataList(this.asset_));

    this.rendered_ = [];
    this.toRender_ = [];
    for (let key in generatedHtml) {
      this.toRender_.push({ key: key, content: generatedHtml[key] });
    }
    this.totalRender_ = this.toRender_.length;

    this.renderNext_();
  }

  /**
   * Handler called when the select all button is clicked.
   *
   * @method onSelectAllClick
   */
  onSelectAllClick() {
    this.unselectAll_();
    this.images.forEach(image => {
      this.selectedImages_.push(image);
    });
  }

  /**
   * Handler called when the unselect all button is clicked.
   *
   * @method onUnselectAllClick
   */
  onUnselectAllClick() {
    this.unselectAll_();
  }

  /**
   * @property images
   * @type {Array}
   * @readonly
   */
  get images() {
    return this.rendered_;
  }

  /**
   * @property isFabOpen
   * @type {Boolean}
   */
  get isFabOpen() {
    return this.isFabOpen_;
  }
  set isFabOpen(open) {
    this.isFabOpen_ = open;
  }

  /**
   * @property renderedCount
   * @type {number}
   * @readonly
   */
  get renderedCount() {
    return this.images.length;
  }

  /**
   * @property totalCount
   * @type {number}
   * @readonly
   */
  get totalCount() {
    return this.totalRender_;
  }

  /**
   * @property percentDone
   * @type {number}
   * @readonly
   */
  get percentDone() {
    return this.renderedCount * 100 / this.totalCount;
  }

  /**
   * @property selectedImages
   * @type {Array}
   */
  get selectedImages() {
    return this.selectedImages_;
  }
  set selectedImages(images) {
    this.selectedImages_ = images;
  }
}
