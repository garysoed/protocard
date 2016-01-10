import Asset from '../model/asset';
import Cache from '../decorators/cache';
import StorageService from '../common/storage-service';

/**
 * Index for the asset index.
 */
export const KEY_INDEX: string = 'assets';

/**
 * Manages assets in the storage.
 */
export default class AssetService {
  private $mdToast_: angular.material.IToastService;
  private assets_: { [id: string]: Asset };
  private storage_: StorageService<any>;

  /**
   * @param StorageService Provides access to storage.
   */
  constructor($mdToast: angular.material.IToastService, StorageService: StorageService<any>) {
    this.$mdToast_ = $mdToast;
    this.assets_ = null;
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
    if (this.assets_ === null) {
      this.assets_ = {};
      this.getIndex_().forEach(id => {
        this.assets_[id] = this.storage_.getItem(id, Asset);
      });
    }
    return this.assets_;
  }

  /**
   * Saves the given asset to the storage.
   *
   * @param saveAsset The Asset to be stored.
   */
  saveAsset(asset: Asset) {
    let index = this.getIndex_();

    if (index.indexOf(asset.id) < 0) {
      index.push(asset.id);
    }

    this.storage_.setItem(KEY_INDEX, index);
    this.storage_.setItem(asset.id, asset);

    let now = new Date();
    this.$mdToast_.show(
        this.$mdToast_.simple()
            .textContent(`Asset ${asset.name} saved at ${now.toLocaleTimeString()}`)
            .position('bottom left'));

    // invalidates the cache.
    this.assets_ = null;
  }
};
