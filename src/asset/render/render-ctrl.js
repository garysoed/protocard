import { Types as FileTypes } from '../../data/file';
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
   * @param {generator.GeneratorService} GeneratorService
   * @param {asset.render.RenderService} RenderService
   */
  constructor($scope, GeneratorService, RenderService) {
    this.$scope_ = $scope;
    this.asset_ = $scope['asset'];
    this.destroyed_ = false;
    this.generatorService_ = GeneratorService;
    this.renderService_ = RenderService;
    this.toRender_ = [];
    this.rendered_ = [];
    this.selectedImages_ = [];
    this.totalRender_ = 0;
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
   * @method isLoading
   * @return {Boolean} True iff there are items to render.
   */
  isRendering() {
    return this.toRender_.length > 0;
  }

  /**
   * Called when the directive is initialized.
   *
   * @method onInit
   */
  onInit() {
    this.$scope_.$on('$destroy', this.onDestroy_.bind(this));

    let dataFile = this.asset_.data;
    let writer = null;
    switch (dataFile.type) {
      case FileTypes.TSV:
        writer = Extract.fromTsv(dataFile.content);
        break;
      default:
        throw Error(`Unhandled file type: ${dataFile.type}`);
    }

    let data = writer.write(this.asset_.dataProcessor.asFunction());

    // TODO(gs): Make Handlebars a third party module.
    // TODO(gs): Make some helpers built in
    // TODO(gs): Add Partials to asset
    // TODO(gs): Add name to asset
    let generatedHtml = this.generatorService_.generate(
        this.asset_.templateString,
        '{{lowercase _.name}}',
        data,
        {
          globals: this.asset_.globals,
          helpers: Utils.mapValue(this.asset_.helpers, helper => helper.asFunction()),
          partials: {}
        });

    this.rendered_ = [];
    this.toRender_ = [];
    for (let key in generatedHtml) {
      this.toRender_.push({ key: key, content: generatedHtml[key] });
    }
    this.totalRender_ = this.toRender_.length;

    this.renderNext_();
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
