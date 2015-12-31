import Ctrl from './create-asset-dialog-ctrl';

/**
 * Manages the create asset dialog.
 *
 * @class home.CreateAssetDialogService
 */
export default class {
  private $mdDialog_: angular.material.IDialogService;

  constructor($mdDialog: angular.material.IDialogService) {
    this.$mdDialog_ = $mdDialog;
  }

  /**
   * Shows the create asset dialog.
   *
   * @method show
   * @param $event Angular event that triggered this event.
   * @return Promise that will be resolved with the newly created asset, or rejected if
   *    asset creation was cancelled.
   */
  show($event: MouseEvent): angular.IPromise<any> {
    return this.$mdDialog_.show({
      controller: Ctrl,
      controllerAs: 'ctrl',
      targetEvent: $event,
      templateUrl: 'home/create-asset-dialog.ng'
    });
  }
};
