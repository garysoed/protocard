const __assetService__ = Symbol('assetService');
const __assets__ = Symbol('assets');
const __createAssetDialogService__ = Symbol('createAssetDialogService');
const __navigateService__ = Symbol('navigateService');

/**
 * Controller for the home view.
 *
 * @class home.ViewCtrl
 */
export default class {
  /**
   * @constructor
   * @param {data.AssetService} AssetService
   * @param {data.CreateAssetDialogService} CreateAssetDialogService
   * @param {common.NavigateService} NavigateService
   */
  constructor(AssetService, CreateAssetDialogService, NavigateService) {
    this[__assetService__] = AssetService;
    this[__createAssetDialogService__] = CreateAssetDialogService;
    this[__navigateService__] = NavigateService;
  }

  /**
   * @method getAssets
   * @return {Array} Array containing `data.Asset`s in the storage.
   */
  getAssets() {
    return this[__assetService__].getAssets();
  }

  /**
   * @method hasAssets
   * @return {Boolean} True iff there are assets in the storage.
   */
  hasAssets() {
    return this[__assetService__].hasAssets();
  }

  /**
   * Handler called when the create button is clicked.
   *
   * @method onCreateClick
   * @param {ng.$event} $event Angular event object that triggered this.
   */
  onCreateClick($event) {
    return this[__createAssetDialogService__].show($event)
        .then(asset => {
          this[__assetService__].saveAsset(asset);
          this[__navigateService__].toAssetHome(asset.id);
        });
  }

  /**
   * Handler called when the select element is closed.
   *
   * @method onSelectClosed
   * @param {string} selectedAssetId ID of the selected asset.
   */
  onSelectClosed(selectedAssetId) {
    this[__navigateService__].toAssetHome(selectedAssetId);
  }
};
