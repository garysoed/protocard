import Asset from '../model/asset';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import BaseListenable from '../../node_modules/gs-tools/src/event/base-listenable';
import StorageServiceModule, { StorageService } from '../common/storage-service';


export enum EventType {
  SAVED
};

/**
 * Index for the asset index.
 */
export const KEY_INDEX: string = 'assets';

/**
 * Manages assets in the storage.
 */
export class AssetService extends BaseListenable<EventType> {
  private storage_: StorageService<any>;

  /**
   * @param StorageService Provides access to storage.
   */
  constructor(StorageService: StorageService<any>) {
    super();
    this.storage_ = StorageService;
  }

  /**
   * @return Array of asset IDs stored.
   */
  @Cache()
  private get index_(): string[] {
    return this.storage_.getItem(KEY_INDEX, Array, []);
  }

  deleteAsset(asset: Asset): void {
    if (this.index_.indexOf(asset.id) >= 0) {
      this.index_.splice(this.index_.indexOf(asset.id), 1);
      this.storage_.removeItem(asset.id);
      this.storage_.setItem(KEY_INDEX, this.index_);
      Cache.clear(this);
    }
  }

  /**
   * @param id ID of the asset to return.
   * @return The asset corresponding to the given ID.
   */
  getAsset(id: string): Asset {
    return this.assets[id] || null;
  }

  /**
   * @return Dictionary of `data.Asset`s stored with the ID as the key and asset object as the
   *    value.
   */
  @Cache()
  get assets(): { [id: string]: Asset } {
    let assets = <{ [id: string]: Asset }> {};
    this.index_.forEach((id: string) => {
      assets[id] = this.storage_.getItem(id, Asset);
    });
    return assets;
  }

  /**
   * @return True iff there are assets stored.
   */
  hasAssets(): boolean {
    return Object.keys(this.assets).length > 0;
  }

  /**
   * Saves the given asset to the storage.
   *
   * @param saveAsset The Asset to be stored.
   */
  saveAsset(asset: Asset): void {
    let index = this.index_;

    if (index.indexOf(asset.id) < 0) {
      index.push(asset.id);
      this.storage_.setItem(KEY_INDEX, index);
      Cache.clear(this);
    }

    this.storage_.setItem(asset.id, asset);
    this.dispatch(EventType.SAVED, asset);
  }
};

export default angular
    .module('asset.AssetServiceModule', [
      StorageServiceModule.name
    ])
    .service('AssetService', AssetService);
