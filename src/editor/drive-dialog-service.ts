import DriveDialogCtrl from './drive-dialog-ctrl';

export default class {

  private $mdDialog_: angular.material.IDialogService;

  constructor($mdDialog: angular.material.IDialogService) {
    this.$mdDialog_ = $mdDialog;
  }

  /**
   * Shows the dialog.
   * @param $event The Angular event triggering the dialog.
   * @return {Promise} Promise that will be resolved when the dialog is hidden, or rejected if the
   *    dialog is cancelled.
   */
  show($event: MouseEvent): angular.IPromise<any> {
    let options = <angular.material.IDialogOptions>{};
    options['controller'] = DriveDialogCtrl;
    options['controllerAs'] = 'ctrl';
    options['targetEvent'] = $event;
    options['templateUrl'] = 'editor/drive-dialog.ng';
    return this.$mdDialog_.show(options);
  }
};
