import DriveDialogCtrl from './drive-dialog-ctrl';

/**
 * @class editor.DriveDialogService
 */
export default class {
  /**
   * @constructor
   * @param {ng.$mdDialog} $mdDialog
   */
  constructor($mdDialog) {
    this.$mdDialog_ = $mdDialog;
  }

  /**
   * Shows the dialog.

   * @method show
   * @param {ng.$event} $event The Angular event triggering the dialog.
   * @return {Promise} Promise that will be resolved when the dialog is hidden, or rejected if the
   *    dialog is cancelled.
   */
  show($event) {
    return this.$mdDialog_.show({
      controller: DriveDialogCtrl,
      controllerAs: 'ctrl',
      targetEvent: $event,
      templateUrl: 'editor/drive-dialog.ng'
    });
  }
};
