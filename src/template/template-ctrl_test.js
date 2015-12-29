import TestBase from '../testbase';

import TemplateCtrl from './template-ctrl';

describe('template.TemplateCtrl', () => {
  let mockAsset;
  let mockAssetService;
  let mockGeneratorService;
  let mockLocalDataList;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockLocalDataList = [];

    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['generateNames']);
    mockGeneratorService.generateNames.and.returnValue(mockLocalDataList);
    ctrl = new TemplateCtrl(
        { 'asset': mockAsset },
        mockAssetService,
        mockGeneratorService);
  });

  it('should generate the names based on the given asset', () => {
    expect(mockGeneratorService.generateNames).toHaveBeenCalledWith(mockAsset);
  });

  describe('get previewData', () => {
    it('should select a preview data randomly', () => {
      mockLocalDataList.push('data1');
      mockLocalDataList.push('data2');
      spyOn(Math, 'random').and.returnValue(0.5);

      expect(ctrl.previewData).toEqual('data2');
    });

    it('should cache the previously selected preview data', () => {
      mockLocalDataList.push('data1');
      mockLocalDataList.push('data2');
      spyOn(Math, 'random').and.returnValue(0.5);

      ctrl.previewData;
      Math.random.and.returnValue(0);

      expect(ctrl.previewData).toEqual('data2');
    });

    it('should return null if the local data list is empty', () => {
      expect(ctrl.previewData).toEqual(null);
    });
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

  describe('onRefreshClick', () => {
    let mockIframeEl;

    beforeEach(() => {
      mockIframeEl = {};
      mockLocalDataList.push('a');
      ctrl.previewData;
    });

    it('should update the input element srcdoc', () => {
      mockLocalDataList.push('b');

      spyOn(Math, 'random').and.returnValue(0.5);
      ctrl.onRefreshClick();
      expect(ctrl.previewData).toEqual('b');
    });
  });
});
