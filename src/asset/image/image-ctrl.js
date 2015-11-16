/**
 * @class asset.image.ImageCtrl
 */
export default class {
  /**
   * @constructor
   * @param {!editor.DriveDialogService} DriveDialogService
   */
  constructor(DriveDialogService) {
    this.driveDialogService_ = DriveDialogService;
  }

  onDriveClick($event) {
    this.driveDialogService_.show($event);
  }
}
