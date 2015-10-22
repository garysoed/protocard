import TestBase from '../testbase';

import Asset from '../data/asset';
import ViewCtrl from './view-ctrl';

describe('home.ViewCtrl', () => {
  let mock$location;
  let mockAssetService;
  let mockCreateAssetDialogService;
  let ctrl;

  beforeEach(() => {
    mock$location = jasmine.createSpyObj('$location', ['path']);
    mockAssetService = jasmine.createSpyObj(
        'AssetService', ['getAssets', 'hasAssets', 'saveAsset']);
    mockCreateAssetDialogService = jasmine.createSpyObj('CreateAssetDialogService', ['show']);
    ctrl = new ViewCtrl(mock$location, mockAssetService, mockCreateAssetDialogService);
  });

  describe('getAssets', () => {
    it('should return the stored assets', () => {
      let assets = [
        new Asset('asset1'),
        new Asset('asset2')
      ];
      mockAssetService.getAssets.and.returnValue(assets);

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
    it('should open the create dialog service and save the newly created asset', done => {
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

  describe('onSelectClosed', () => {
    it('should navigate to the create page', () => {
      let assetId = 'assetId';
      ctrl.onSelectClosed(assetId);
      expect(mock$location.path).toHaveBeenCalledWith(`/create/${assetId}`);
    });
  });
});
