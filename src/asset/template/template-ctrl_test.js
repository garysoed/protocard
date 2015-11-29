import TestBase from '../../testbase';

import TemplateCtrl from './template-ctrl';

describe('asset.template.TemplateCtrl', () => {
  let mockAsset;
  let mockAssetService;
  let mockGeneratorService;
  let mockLocalDataList;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockLocalDataList = [];
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['generate', 'localDataList']);
    mockGeneratorService.localDataList.and.returnValue(mockLocalDataList);
    ctrl = new TemplateCtrl(
        { 'asset': mockAsset },
        mockAssetService,
        mockGeneratorService);
  });

  describe('updatePreview_', () => {
    let mockIframeEl;

    beforeEach(() => {
      mockIframeEl = {};
      mockGeneratorService.generate.and.returnValue({});
      ctrl.onLink(mockIframeEl);
    });

    it('should update the iframeEl srcdoc', () => {
      let localData = 'localData';
      mockLocalDataList.push(localData);
      mockGeneratorService.generate.and.returnValue({ a: 'dataA' });

      spyOn(Math, 'random').and.returnValue(0.5);
      ctrl.updatePreview_();

      expect(mockIframeEl.srcdoc).toEqual('dataA');
      expect(mockGeneratorService.generate).toHaveBeenCalledWith(mockAsset, [localData]);
    });

    it('should do nothing if there are no keys', () => {
      ctrl.updatePreview_();
      expect(mockIframeEl.srcdoc).toEqual(undefined);
    });

    it('should keep previously set preview key', () => {
      let chosenData = 'chosenData';
      mockLocalDataList.push('otherData');
      mockLocalDataList.push(chosenData);

      mockGeneratorService.generate.and.returnValue({ a: 'dataA' });

      spyOn(Math, 'random').and.returnValue(0.5);
      ctrl.updatePreview_();

      Math.random.and.returnValue(0);
      mockGeneratorService.generate.calls.reset();
      ctrl.updatePreview_();
      expect(mockIframeEl.srcdoc).toEqual('dataA');
      expect(mockGeneratorService.generate).toHaveBeenCalledWith(mockAsset, [chosenData]);
    });
  });

  describe('set templateString', () => {
    beforeEach(() => {
      spyOn(ctrl, 'updatePreview_').and.callFake(() => {});
    });

    it('should update the asset and saves it if the input is non null', () => {
      let newValue = 'newValue';
      ctrl.templateString = newValue;

      expect(ctrl.templateString).toEqual(newValue);
      expect(mockAsset.templateString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(ctrl.updatePreview_).toHaveBeenCalledWith();
    });

    it('should update the template string but not the asset if the input is null', () => {
      let oldValue = 'oldValue';
      mockAsset.templateString = oldValue;
      ctrl.templateString = null;

      expect(ctrl.templateString).toEqual(null);
      expect(mockAsset.templateString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
      expect(ctrl.updatePreview_).not.toHaveBeenCalled();
    });
  });

  describe('onRefreshClick', () => {
    let mockIframeEl;

    beforeEach(() => {
      mockIframeEl = {};
      mockLocalDataList.push('a');
      ctrl.onLink(mockIframeEl);
    });

    it('should update the input element srcdoc', () => {
      mockLocalDataList.push('b');

      spyOn(Math, 'random').and.returnValue(0.5);
      ctrl.onRefreshClick();
      expect(mockGeneratorService.generate).toHaveBeenCalledWith(mockAsset, ['b']);
    });
  });
});
