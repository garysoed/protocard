import TestBase from '../../testbase';

import TemplateCtrl from './template-ctrl';

describe('asset.template.TemplateCtrl', () => {
  let mockAsset;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    ctrl = new TemplateCtrl({ 'asset': mockAsset }, mockAssetService);
  });

  describe('set templateString', () => {
    it('should update the asset and saves it if the input is non null', () => {
      let newValue = 'newValue';
      ctrl.templateString = newValue;

      expect(ctrl.templateString).toEqual(newValue);
      expect(mockAsset.templateString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });

    it('should update the template string but not the asset if the input is null', () => {
      let oldValue = 'oldValue';
      mockAsset.templateString = oldValue;
      ctrl.templateString = null;

      expect(ctrl.templateString).toEqual(null);
      expect(mockAsset.templateString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });
});
