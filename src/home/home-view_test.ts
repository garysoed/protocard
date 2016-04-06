import TestBase from '../testbase';
TestBase.init();

import Asset from '../model/asset';
import Serializer from '../../node_modules/gs-tools/src/data/a-serializable';
import { HomeViewCtrl } from './home-view';

describe('home.HomeViewCtrl', () => {
  let mockAssetService;
  let mockCreateAssetDialogService;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['hasAssets', 'saveAsset']);
    mockCreateAssetDialogService = jasmine.createSpyObj('CreateAssetDialogService', ['show']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toAsset']);
    ctrl = new HomeViewCtrl(mockAssetService, mockCreateAssetDialogService, mockNavigateService);
  });

  describe('getAssets', () => {
    it('should return the stored assets', () => {
      let assets = [
        new Asset('asset1'),
        new Asset('asset2'),
      ];
      mockAssetService.assets = assets;

      expect(ctrl.getAssets()).toEqual(assets);
    });
  });

  describe('hasAssets', () => {
    it('should return true if there are assets in the storage', () => {
      mockAssetService.hasAssets.and.returnValue(true);
      expect(ctrl.hasAssets()).toEqual(true);
    });

    it('should return false if there are no assets in the storage', () => {
      mockAssetService.hasAssets.and.returnValue(false);
      expect(ctrl.hasAssets()).toEqual(false);
    });
  });

  describe('onCreateClick', () => {
    it('should open the create dialog service and save the newly created asset',
        (done: jasmine.IDoneFn) => {
      let $event = {};
      let asset = new Asset('newAsset');

      mockCreateAssetDialogService.show.and.returnValue(Promise.resolve(asset));

      ctrl.onCreateClick($event)
          .then(() => {
            expect(mockCreateAssetDialogService.show).toHaveBeenCalledWith($event);
            expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
            done();
          }, done.fail);
    });
  });

  describe('set loadedAsset', () => {
    it('should navigate to the create page', () => {
      let assetId = 'assetId';
      ctrl.loadedAsset = assetId;
      expect(mockNavigateService.toAsset).toHaveBeenCalledWith(assetId);
    });
  });

  describe('set newAsset', () => {
    it('should create the asset, saves it and navigate to it', () => {
      let assetId = 'assetId';
      let asset = jasmine.createObj('asset');
      asset.id = assetId;

      let fromJSONSpy = spyOn(Serializer, 'fromJSON');
      fromJSONSpy.and.returnValue(asset);

      ctrl.newAsset = { content: JSON.stringify({}) };

      expect(fromJSONSpy.calls.argsFor(0)[0].id).toEqual(undefined);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
      expect(mockNavigateService.toAsset).toHaveBeenCalledWith(assetId);
    });

    it('should do nothing if the format is wrong', () => {
      spyOn(Serializer, 'fromJSON').and.returnValue(null);

      ctrl.newAsset = { content: JSON.stringify({}) };

      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
      expect(mockNavigateService.toAsset).not.toHaveBeenCalled();
    });
  });
});
