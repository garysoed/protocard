import TestBase from '../testbase';

import File, { Types as FileTypes } from '../model/file';
import TextCtrl from './text-ctrl';

describe('asset.text.TextCtrl', () => {
  let mockAsset;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    ctrl = new TextCtrl({ asset: mockAsset }, mockAssetService);
  });

  describe('set data', () => {
    it('should update the asset data and save it', () => {
      let data = {};
      ctrl.data = data;
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });

    it('should update the parsedData', () => {
      let oldData = new File(FileTypes.TSV, 'old\ncontent');
      let newData = new File(FileTypes.TSV, 'new\ncontent');
      mockAsset.data = oldData;
      expect(ctrl.parsedData).toEqual([['old'], ['content']]);

      ctrl.data = newData;
      expect(ctrl.parsedData).toEqual([['new'], ['content']]);
    });
  });

  describe('get parsedData', () => {
    it('should return the correct data', () => {
      let data = new File(FileTypes.TSV, 'a\nb');
      mockAsset.data = data;
      expect(ctrl.parsedData).toEqual([['a'], ['b']]);
    });
  });

  describe('hasData', () => {
    let file = new File(FileTypes.TSV, 'a\nb');

    it('should return true if the asset has data', () => {
      mockAsset.data = file;
      expect(ctrl.hasData()).toEqual(true);
    });

    it('should return false if the asset has no data', () => {
      mockAsset.data = null;
      expect(ctrl.hasData()).toEqual(false);
    });
  });
});
