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
export const KEY_INDEX = 'pc.assets';

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
    let jsonString = this[__storage__].getItem(KEY_INDEX);
    return jsonString ? JSON.parse(jsonString) : [];
  }

  /**
   * @method hasAssets
   * @return {Boolean} True iff there are assets stored.
   */
  hasAssets() {
    return this.getAssets().length > 0;
  }

  /**
   * @method getAssets
   * @return {Array} Array of `data.Asset`s stored.
   */
  getAssets() {
    if (this[__assets__] === null) {
      this[__assets__] = this[__getIndex__]().map(id => {
        return Asset.fromJSON(JSON.parse(this[__storage__].getItem(`pc.${id}`)));
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

    this[__storage__].setItem(KEY_INDEX, JSON.stringify(index));
    this[__storage__].setItem(`pc.${asset.id}`, JSON.stringify(asset));

    // invalidates the cache.
    this[__assets__] = null;
  }
};
