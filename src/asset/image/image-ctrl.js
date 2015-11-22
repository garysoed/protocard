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
            this.asset_.images.push(image);
          });
          this.assetService_.saveAsset(this.asset_);
        });
  }
}
