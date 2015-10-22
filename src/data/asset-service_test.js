import TestBase from '../testbase';

import Asset from './asset';
import AssetService from './asset-service';
import { KEY_INDEX } from './asset-service';

describe('data.AssetService', () => {
  let assetService;
  let mockStorageService;

  beforeEach(() => {
    mockStorageService = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);
    assetService = new AssetService(mockStorageService);
  });

  describe('hasAssets', () => {
    it('should return true if there are assets in local storage', () => {
      mockStorageService.getItem.and.returnValue(['a']);
      expect(assetService.hasAssets()).toEqual(true);
    });

    it('should return false if there are no assets in local storage', () => {
      mockStorageService.getItem.and.returnValue([]);
      expect(assetService.hasAssets()).toEqual(false);
    });
  });

  describe('getAssets', () => {
    let asset;

    beforeEach(() => {
      asset = new Asset('test');
    });

    it('should return the assets stored locally', () => {
      mockStorageService.getItem.and.callFake(id => {
        if (id === KEY_INDEX) {
          return [asset.id];
        } else if (id === asset.id) {
          return asset;
        }
      });

      expect(assetService.getAssets()).toEqual({ [asset.id]: asset });
    });

    it('should cache the data', () => {
      mockStorageService.getItem.and.callFake(id => {
        if (id === KEY_INDEX) {
          return [asset.id];
        } else if (id === asset.id) {
          return asset;
        }
      });
      assetService.getAssets();

      // Now call again.
      mockStorageService.getItem.calls.reset();
      expect(assetService.getAssets()).toEqual({ [asset.id]: asset });
      expect(mockStorageService.getItem).not.toHaveBeenCalled();
    });
  });

  describe('getAsset', () => {
    let asset1;
    let asset2;

    beforeEach(() => {
      asset1 = new Asset('asset1');
      asset2 = new Asset('asset2');

      let data = {
        [asset1.id]: asset1,
        [asset2.id]: asset2,
        [KEY_INDEX]: [asset1.id, asset2.id]
      };
      mockStorageService.getItem.and.callFake(id => data[id]);
    });

    it('should return the correct asset', () => {
      expect(assetService.getAsset(asset2.id)).toEqual(asset2);
    });

    it('should return null if the asset does not exist', () => {
      expect(assetService.getAsset('non-existent')).toEqual(null);
    });
  });

  describe('saveAsset', () => {
    let asset;

    beforeEach(() => {
      asset = new Asset('test');
    });

    it('should update the storage', () => {
      mockStorageService.getItem.and.returnValue([]);
      assetService.saveAsset(asset);

      expect(mockStorageService.setItem).toHaveBeenCalledWith(KEY_INDEX, [asset.id]);
      expect(mockStorageService.setItem).toHaveBeenCalledWith(asset.id, asset);
    });

    it('should invalidate the cache', () => {
      mockStorageService.getItem.and.callFake(id => {
        if (id === KEY_INDEX) {
          return [asset.id];
        } else if (id === asset.id) {
          return asset;
        }
      });
      assetService.getAssets();

      assetService.saveAsset(new Asset('test2'));

      mockStorageService.getItem.calls.reset();
      mockStorageService.getItem.and.callFake(id => {
        if (id === KEY_INDEX) {
          return [asset.id];
        } else if (id === asset.id) {
          return asset;
        }
      });
      mockStorageService.getItem();
      expect(mockStorageService.getItem).toHaveBeenCalled();
    });
  });
});
