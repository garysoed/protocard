const __$location__ = Symbol('$location');
const __assetService__ = Symbol('assetService');
const __assets__ = Symbol('assets');
const __createAssetDialogService__ = Symbol('createAssetDialogService');

/**
 * Controller for the home view.
 *
 * @class home.ViewCtrl
 */
export default class {
  /**
   * @constructor
   * @param {ng.$location} $location
   * @param {data.AssetService} AssetService
   * @param {data.CreateAssetDialogService} CreateAssetDialogService
   */
  constructor($location, AssetService, CreateAssetDialogService) {
    this[__$location__] = $location;
    this[__assetService__] = AssetService;
    this[__createAssetDialogService__] = CreateAssetDialogService;
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
          // TODO(gs): Automatically select this asset.
        });
  }

  /**
   * Handler called when the select element is closed.
   *
   * @method onSelectClosed
   * @param {string} selectedAssetId ID of the selected asset.
   */
  onSelectClosed(selectedAssetId) {
    this[__$location__].path(`/create/${selectedAssetId}`);
  }
};
