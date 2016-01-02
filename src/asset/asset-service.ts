import Asset from '../model/asset';
import StorageService from '../common/storage-service';

/**
 * Index for the asset index.
 */
export const KEY_INDEX: string = 'assets';

/**
 * Manages assets in the storage.
 */
export default class AssetService {

  private asset_: { [id: string]: Asset };
  private storage_: StorageService<any>;

  /**
   * @param StorageService Provides access to storage.
   */
  constructor(StorageService: StorageService<any>) {
    this.asset_ = null;
    this.storage_ = StorageService;
  }

  /**
   * @return Array of asset IDs stored.
   */
  private getIndex_(): string[] {
    return this.storage_.getItem(KEY_INDEX, Array, []);
  }

  /**
   * @return True iff there are assets stored.
   */
  hasAssets(): boolean {
    return Object.keys(this.getAssets()).length > 0;
  }

  /**
   * @param id ID of the asset to return.
   * @return The asset corresponding to the given ID.
   */
  getAsset(id: string): Asset {
    return this.getAssets()[id] || null;
  }

  /**
   * @return Dictionary of `data.Asset`s stored with the ID as the key and asset object as the
   *    value.
   */
  getAssets(): { [id: string]: Asset } {
    // TODO(gs): Cache
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
   * @param saveAsset The Asset to be stored.
   */
  saveAsset(asset: Asset) {
    let index = this.getIndex_();
    index.push(asset.id);

    this.storage_.setItem(KEY_INDEX, index);
    this.storage_.setItem(asset.id, asset);

    // invalidates the cache.
    this.asset_ = null;
  }
};
