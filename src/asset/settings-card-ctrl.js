const __asset__ = Symbol('asset');
const __assetService__ = Symbol('assetService');
const __editGlobalsDialogService__ = Symbol('editGlobalsDialogService');

/**
 * Displays the asset's settings.
 *
 * @class asset.SettingsCard
 */
export default class {
  /**
   * @constructor
   * @method constructor
   * @param {ng.$scope} $scope
   * @param {data.AssetService} AssetService
   * @param {settings.EditGlobalsDialogService} EditGlobalsDialogService
   */
  constructor($scope, AssetService, EditGlobalsDialogService) {
    this[__asset__] = $scope['asset'];
    this[__assetService__] = AssetService;
    this[__editGlobalsDialogService__] = EditGlobalsDialogService;
  }

  /**
   * Handler called when the globals edit button is clicked.
   *
   * @method onGlobalsEditClick
   * @param {ng.$event} $event Angular event causing the click.
   * @return {Promise} Promise that will be resolved if the dialog is hidden, or rejected if the
   *    dialog is cancelled.
   */
  onGlobalsEditClick($event) {
    return this[__editGlobalsDialogService__]
        .show($event, this[__asset__].globals)
        .then(newGlobals => {
          this[__asset__].globals = newGlobals;
          this[__assetService__].saveAsset(this[__asset__]);
        });
  }
};
