/**
 * @class asset.image.ImageCtrl
 */
export default class {
  /**
   * @constructor
   * @param {!editor.DriveDialogService} DriveDialogService
   */
  constructor($scope, AssetService, DriveDialogService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.driveDialogService_ = DriveDialogService;
    this.selectedImages_ = [];
    this.imagesArray_ = null;
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

  /**
   * @property images
   * @type {Array}
   */
  get images() {
    if (this.imagesArray_ === null) {
      this.imagesArray_ = Array.from(this.asset_.images);
    }
    return this.imagesArray_;
  }

  /**
   * @method hasSelectedImages
   * @return {Boolean} True iff there are selected images.
   */
  hasSelectedImages() {
    return this.selectedImages_.length > 0;
  }

  /**
   * Handler called when the delete button is clicked.
   * @method onDeleteClick
   * @return {Promise} Promise that will be resolved when the saving the serving is done.
   */
  onDeleteClick() {
    for (let selected of this.selectedImages_) {
      this.asset_.images.delete(selected);
    }
    this.imagesArray_ = null;
    this.selectedImages_ = [];
    return this.assetService_.saveAsset(this.asset_);
  }

  /**
   * Handler called when the drive button is clicked.
   * @method onDriveClick
   * @param {ng.$Event} $event The Angular event.
   * @return {Promise} Promise that will be resolved when the dialog has been closed.
   */
  onDriveClick($event) {
    return this.driveDialogService_
        .show($event)
        .then(images => {
          images.forEach(image => {
            this.asset_.images.add(image);
          });
          this.imagesArray_ = null;
          this.assetService_.saveAsset(this.asset_);
        });
  }
}
