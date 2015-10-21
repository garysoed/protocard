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
      mockStorageService.getItem.and.returnValue(JSON.stringify(['a']));
      expect(assetService.hasAssets()).toEqual(true);
    });

    it('should return false if there are no assets in local storage', () => {
      mockStorageService.getItem.and.returnValue(JSON.stringify([]));
      expect(assetService.hasAssets()).toEqual(false);
    });

    it('should return false if there are no asset index in local storage', () => {
      mockStorageService.getItem.and.returnValue(null);
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
        if (id === 'pc.assets') {
          return JSON.stringify([asset.id]);
        } else if (id === `pc.${asset.id}`) {
          return JSON.stringify(asset);
        }
      });

      expect(assetService.getAssets()).toEqual([asset]);
    });

    it('should return empty array if there are no index', () => {
      mockStorageService.getItem.and.returnValue(null);
      expect(assetService.getAssets()).toEqual([]);
    });

    it('should cache the data', () => {
      mockStorageService.getItem.and.callFake(id => {
        if (id === KEY_INDEX) {
          return JSON.stringify([asset.id]);
        } else if (id === `pc.${asset.id}`) {
          return JSON.stringify(asset);
        }
      });
      assetService.getAssets();

      // Now call again.
      mockStorageService.getItem.calls.reset();
      expect(assetService.getAssets()).toEqual([asset]);
      expect(mockStorageService.getItem).not.toHaveBeenCalled();
    });
  });

  describe('saveAsset', () => {
    let asset;

    beforeEach(() => {
      asset = new Asset('test');
    });

    it('should update the storage', () => {
      mockStorageService.getItem.and.callFake(id => {
        if (id === KEY_INDEX) {
          return JSON.stringify([asset.id]);
        } else if (id === `pc.${asset.id}`) {
          return JSON.stringify(asset);
        }
      });
      assetService.getAssets();

      assetService.saveAsset(new Asset('test2'));

      mockStorageService.getItem.calls.reset();
      mockStorageService.getItem.and.callFake(id => {
        if (id === KEY_INDEX) {
          return JSON.stringify([asset.id]);
        } else if (id === `pc.${asset.id}`) {
          return JSON.stringify(asset);
        }
      });
      mockStorageService.getItem();
      expect(mockStorageService.getItem).toHaveBeenCalled();
    });

    it('should invalidate the cache', () => {

    });
  });
});
