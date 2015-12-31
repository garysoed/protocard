import Asset from '../model/asset';
import AssetService from '../asset/asset-service';
import DriveDialogService from '../editor/drive-dialog-service';
import ImageResource from '../model/image-resource';

export default class ImageCtrl {
  private asset_: Asset;
  private assetService_: AssetService;
  private driveDialogService_: DriveDialogService;
  private imagesArray_: ImageResource[];
  private selectedImages_: ImageResource[];

  /**
   * @param {!editor.DriveDialogService} DriveDialogService
   */
  constructor($scope, AssetService, DriveDialogService) {
    this.asset_ = $scope['asset'];
    this.assetService_ = AssetService;
    this.driveDialogService_ = DriveDialogService;
    this.imagesArray_ = null;
    this.selectedImages_ = [];
  }

  get selectedImages(): ImageResource[] {
    return this.selectedImages_;
  }
  set selectedImages(images: ImageResource[]) {
    this.selectedImages_ = images;
  }

  get images(): ImageResource[] {
    if (this.imagesArray_ === null) {
      this.imagesArray_ = [];
      for (let key in this.asset_.images) {
        this.imagesArray_.push(this.asset_.images[key]);
      }
    }
    return this.imagesArray_;
  }

  /**
   * @return True iff there are selected images.
   */
  hasSelectedImages(): boolean {
    return this.selectedImages_.length > 0;
  }

  /**
   * Handler called when the delete button is clicked.
   */
  onDeleteClick() {
    for (let selected of this.selectedImages_) {
      delete this.asset_.images[selected.alias];
    }
    this.imagesArray_ = null;
    this.selectedImages_ = [];
    // TODO(gs): Override images by their URL.
    this.assetService_.saveAsset(this.asset_);
  }

  /**
   * Handler called when the drive button is clicked.
   * @param $event The Angular event.
   * @return Promise that will be resolved when the dialog has been closed.
   */
  onDriveClick($event: MouseEvent): angular.IPromise<void> {
    return this.driveDialogService_
        .show($event)
        .then(images => {
          images.forEach(image => {
            this.asset_.images[image.alias] = image;
          });
          this.imagesArray_ = null;
          this.assetService_.saveAsset(this.asset_);
        });
  }
}
