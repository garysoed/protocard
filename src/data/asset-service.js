import Asset from './asset';

const __assets__ = Symbol('assets');
const __getIndex__ = Symbol('getIndex');
const __storage__ = Symbol('storage');

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
    this[__assets__] = null;
    this[__storage__] = StorageService;
  }

  /**
   * @method __getIndex__
   * @return {Array} Array of asset IDs stored.
   * @private
   */
  [__getIndex__]() {
    return this[__storage__].getItem(KEY_INDEX, Array, []);
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
    if (this[__assets__] === null) {
      this[__assets__] = {};
      this[__getIndex__]().forEach(id => {
        this[__assets__][id] = this[__storage__].getItem(id, Asset);
      });
    }
    return this[__assets__];
  }

  /**
   * Saves the given asset to the storage.
   *
   * @method saveAsset
   * @param {data.Asset} saveAsset The Asset to be stored.
   */
  saveAsset(asset) {
    let index = this[__getIndex__]();
    index.push(asset.id);

    this[__storage__].setItem(KEY_INDEX, index);
    this[__storage__].setItem(asset.id, asset);

    // invalidates the cache.
    this[__assets__] = null;
  }
};
