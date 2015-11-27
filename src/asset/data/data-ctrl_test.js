import TestBase from '../../testbase';

import DataCtrl from './data-ctrl';

describe('asset.data.DataCtrl', () => {
  let asset;
  let dataProcessor;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    dataProcessor = {};
    asset = { dataProcessor: dataProcessor };
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    ctrl = new DataCtrl({ 'asset': asset }, mockAssetService);
  });

  describe('set processorString', () => {
    it('should update the data processor and save the asset if non null', () => {
      let newValue = 'newValue';
      ctrl.processorString = newValue;

      expect(ctrl.processorString).toEqual(newValue);
      expect(dataProcessor.fnString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
    });

    it('should not update the data processor or save the asset if null', () => {
      let oldValue = 'oldValue';
      dataProcessor.fnString = oldValue;

      ctrl.processorString = null;
      expect(ctrl.processorString).toEqual(null);
      expect(dataProcessor.fnString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });
});
