import TestBase from '../testbase';

import NavigateService from './navigate-service';

describe('common.NavigateService', () => {
  let mock$location;
  let service;

  beforeEach(() => {
    mock$location = jasmine.createSpyObj('$location', ['path']);
    service = new NavigateService(mock$location);
  });

  describe('toAsset', () => {
    it('should construct the path correctly', () => {
      let assetId = 'assetId';
      let subview = 'subview';
      let helperName = 'helperName';

      service.toAsset(assetId, subview, helperName);

      expect(mock$location.path).toHaveBeenCalledWith(`/asset/${assetId}/${subview}/${helperName}`);
    });

    it('should ignore the helperName if not given', () => {
      let assetId = 'assetId';
      let subview = 'subview';

      service.toAsset(assetId, subview);

      expect(mock$location.path).toHaveBeenCalledWith(`/asset/${assetId}/${subview}`);
    });
  });
});
