import TestBase from '../testbase';
TestBase.init();

import Asset from '../model/asset';
import AssetService, { EventType as AssetServiceEventType } from './asset-service';
import { KEY_INDEX } from './asset-service';

describe('asset.AssetService', () => {
  let assetService;
  let mockStorageService;

  beforeEach(() => {
    mockStorageService = jasmine.createSpyObj(
        'StorageService',
        ['getItem', 'removeItem', 'setItem']);
    assetService = new AssetService(mockStorageService);
    jasmine.addDisposable(assetService);
  });

  describe('deleteAsset', () => {
    const ASSET = { id: 'ID' };

    beforeEach(() => {
      mockStorageService.getItem.and.returnValue([]);
      assetService.saveAsset(ASSET);

      mockStorageService.setItem.calls.reset();
    });

    it('should update the storage with the new data and clear the cache', () => {
      assetService.deleteAsset(ASSET);

      expect(mockStorageService.setItem).toHaveBeenCalledWith(KEY_INDEX, []);
      expect(mockStorageService.removeItem).toHaveBeenCalledWith(ASSET.id);
      expect(assetService.assets).toEqual({});
    });

    it('should do nothing if the asset cannot be found', () => {
      assetService.deleteAsset({ id: 'id' });

      expect(mockStorageService.setItem).not.toHaveBeenCalled();
    });
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

  describe('get assets', () => {
    let asset;

    beforeEach(() => {
      asset = new Asset('test');
    });

    it('should return the assets stored locally', () => {
      mockStorageService.getItem.and.callFake((id: string) => {
        if (id === KEY_INDEX) {
          return [asset.id];
        } else if (id === asset.id) {
          return asset;
        }
      });

      expect(assetService.assets).toEqual({ [asset.id]: asset });
    });

    it('should cache the data', () => {
      mockStorageService.getItem.and.callFake((id: string) => {
        if (id === KEY_INDEX) {
          return [asset.id];
        } else if (id === asset.id) {
          return asset;
        }
      });
      let assets = assetService.assets;

      // Now call again.
      mockStorageService.getItem.calls.reset();
      expect(assetService.assets).toEqual(assets);
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
        [KEY_INDEX]: [asset1.id, asset2.id],
      };
      mockStorageService.getItem.and.callFake((id: string) => data[id]);
    });

    it('should return the correct asset', () => {
      expect(assetService.getAsset(asset2.id)).toEqual(asset2);
    });

    it('should return null if the asset does not exist', () => {
      expect(assetService.getAsset('non-existent')).toEqual(null);
    });
  });

  describe('saveAsset', () => {
    let $mdToastBuilder;
    let asset;

    beforeEach(() => {
      asset = new Asset('test');

      $mdToastBuilder = jasmine.createSpyBuilder('$mdToastBuilder', ['position', 'textContent']);
    });

    it('should update the storage', () => {
      mockStorageService.getItem.and.returnValue([]);

      spyOn(assetService, 'dispatch');
      assetService.saveAsset(asset);

      expect(mockStorageService.setItem).toHaveBeenCalledWith(KEY_INDEX, [asset.id]);
      expect(mockStorageService.setItem).toHaveBeenCalledWith(asset.id, asset);
      expect(assetService.dispatch).toHaveBeenCalledWith(AssetServiceEventType.SAVED, asset);
    });

    it('should invalidate the cache', () => {
      mockStorageService.getItem.and.callFake((id: string) => {
        if (id === KEY_INDEX) {
          return [asset.id];
        } else if (id === asset.id) {
          return asset;
        }
      });
      let assets = assetService.assets;

      let newAsset = new Asset('test2');
      assetService.saveAsset(newAsset);

      mockStorageService.getItem.calls.reset();
      mockStorageService.getItem.and.callFake((id: string) => {
        if (id === KEY_INDEX) {
          return <any> ([newAsset.id]);
        } else if (id === newAsset.id) {
          return newAsset;
        }
      });
      expect(assetService.assets).not.toEqual(assets);
      expect(mockStorageService.getItem).toHaveBeenCalled();
    });

    it('should not add duplicated ID', () => {
      mockStorageService.getItem.and.returnValue([asset.id]);

      assetService.saveAsset(asset);

      expect(mockStorageService.setItem).not.toHaveBeenCalledWith(KEY_INDEX, jasmine.any(Array));
    });
  });
});
