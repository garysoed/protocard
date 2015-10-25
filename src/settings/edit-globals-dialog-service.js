import EditGlobalsDialogCtrl from './edit-globals-dialog-ctrl';

const __$mdDialog__ = Symbol('$mdDialog');

/**
 * @class settings.EditGlobalsDialogService
 */
export default class {
  /**
   * @constructor
   * @param {ng.$mdDialog} $mdDialog
   */
  constructor($mdDialog) {
    this[__$mdDialog__] = $mdDialog;
  }

  /**
   * Shows the dialog.
   * @method show
   * @param {ng.$event} $event The Angular event triggering the dialog.
   * @param {Object} globals Globals to be edited.
   * @return {Promise} Promise that will be resolved when the dialog is hidden, or rejected if the
   *    dialog is cancelled.
   */
  show($event, globals) {
    return this[__$mdDialog__].show({
      controller: EditGlobalsDialogCtrl,
      controllerAs: 'ctrl',
      locals: {
        globals: globals
      },
      targetEvent: $event,
      templateUrl: 'settings/edit-globals-dialog.ng'
    });
  }
};
