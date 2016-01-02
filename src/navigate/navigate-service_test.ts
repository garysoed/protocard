import TestBase from '../testbase';
TestBase.init();

import NavigateService from './navigate-service';

describe('navigate.NavigateService', () => {
  let mock$location;
  let service;

  beforeEach(() => {
    mock$location = jasmine.createSpyObj('$location', ['path', 'search']);
    service = new NavigateService(mock$location);
  });

  describe('toAsset', () => {
    it('should construct the path correctly', () => {
      let assetId = 'assetId';
      let subview = 'subview';
      let subitemId = 'subitemId';

      service.toAsset(assetId, subview, subitemId);

      expect(mock$location.path).toHaveBeenCalledWith(`/asset/${assetId}`);
      expect(mock$location.search).toHaveBeenCalledWith('subview', subview);
      expect(mock$location.search).toHaveBeenCalledWith('subitem', subitemId);
    });

    it('should ignore the subitemId if not given', () => {
      let assetId = 'assetId';
      let subview = 'subview';

      service.toAsset(assetId, subview);

      expect(mock$location.path).toHaveBeenCalledWith(`/asset/${assetId}`);
      expect(mock$location.search).toHaveBeenCalledWith('subview', subview);
      expect(mock$location.search).not.toHaveBeenCalledWith('subitem', jasmine.any(String));
    });
  });
});
