import TestBase from '../testbase';

import Asset from '../data/asset';
import ViewCtrl from './view-ctrl';

describe('create.ViewCtrl', () => {
  let asset;
  let mock$location;
  let ctrl;

  beforeEach(() => {
    asset = new Asset('test');
    mock$location = jasmine.createSpyObj('$location', ['path']);

    let mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    mockAssetService.getAsset.and.returnValue(asset);
    ctrl = new ViewCtrl(mock$location, { assetId: 'assetId' }, mockAssetService);
  });

  describe('constructor', () => {
    let mockAssetService;

    beforeEach(() => {
      mockAssetService = jasmine.createSpyObj('AssetService', ['getAsset']);
    });

    it('should redirect to home page if the asset does not exist', () => {
      let assetId = 'assetId';
      mockAssetService.getAsset.and.returnValue(null);
      new ViewCtrl(mock$location, { assetId: assetId }, mockAssetService);

      expect(mock$location.path).toHaveBeenCalledWith('/');
      expect(mockAssetService.getAsset).toHaveBeenCalledWith(assetId);
    });

    it('should not redirect to home page if the asset exists', () => {
      mockAssetService.getAsset.and.returnValue(asset);
      new ViewCtrl(mock$location, { assetId: 'assetId' }, mockAssetService);

      expect(mock$location.path).not.toHaveBeenCalled();
    });
  });

  describe('getAsset', () => {
    it('should return the asset', () => {
      expect(ctrl.getAsset()).toEqual(asset);
    });
  });

  describe('getAssetName', () => {
    it('should return the asset name', () => {
      expect(ctrl.getAssetName()).toEqual(asset.name);
    });
  });

  describe('onBackClick', () => {
    it('should redirect to the home page', () => {
      ctrl.onBackClick();
      expect(mock$location.path).toHaveBeenCalledWith('/');
    });
  });
});
