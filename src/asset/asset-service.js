import Asset from '../model/asset';

/**
 * Index for the asset index.
 *
 * @property KEY_INDEX
 * @type {String}
 * @static
 */
export const KEY_INDEX = 'assets';

/**
 * Manages assets in the storage.
 *
 * @class data.AssetService
 */
export default class {

  /**
   * @constructor
   * @param {Storage} StorageService Provides access to storage.
   */
  constructor(StorageService) {
    this.asset_ = null;
    this.storage_ = StorageService;
  }

  /**
   * @method getIndex_
   * @return {Array} Array of asset IDs stored.
   * @private
   */
  getIndex_() {
    return this.storage_.getItem(KEY_INDEX, Array, []);
  }

  /**
   * @method hasAssets
   * @return {Boolean} True iff there are assets stored.
   */
  hasAssets() {
    return Object.keys(this.getAssets()).length > 0;
  }

  /**
   * @method getAsset
   * @param {string} id ID of the asset to return.
   * @return {data.Asset} The asset corresponding to the given ID.
   */
  getAsset(id) {
    return this.getAssets()[id] || null;
  }

  /**
   * @method getAssets
   * @return {Object} Dictionary of `data.Asset`s stored with the ID as the key and
   *    asset object as the value.
   */
  getAssets() {
    if (this.asset_ === null) {
      this.asset_ = {};
      this.getIndex_().forEach(id => {
        this.asset_[id] = this.storage_.getItem(id, Asset);
      });
    }
    return this.asset_;
  }

  /**
   * Saves the given asset to the storage.
   *
   * @method saveAsset
   * @param {data.Asset} saveAsset The Asset to be stored.
   */
  saveAsset(asset) {
    let index = this.getIndex_();
    index.push(asset.id);

    this.storage_.setItem(KEY_INDEX, index);
    this.storage_.setItem(asset.id, asset);

    // invalidates the cache.
    this.asset_ = null;
  }
};
