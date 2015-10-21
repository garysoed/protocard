import Ctrl from './create-asset-dialog-ctrl';

const __$mdDialog__ = Symbol('$mdDialog');

/**
 * Manages the create asset dialog.
 *
 * @class home.CreateAssetDialogService
 */
export default class {
  /**
   * @constructor
   * @method constructor
   * @param {ng.$mdDialog} $mdDialog
   */
  constructor($mdDialog) {
    this[__$mdDialog__] = $mdDialog;
  }

  /**
   * Shows the create asset dialog.
   *
   * @method show
   * @param {ng.$event} $event Angular event that triggered this event.
   * @return {Promise} Promise that will be resolved with the newly created asset, or rejected if
   *    asset creation was cancelled.
   */
  show($event) {
    return this[__$mdDialog__].show({
      controller: Ctrl,
      controllerAs: 'ctrl',
      targetEvent: $event,
      templateUrl: 'home/create-asset-dialog.ng'
    });
  }
};
