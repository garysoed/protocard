import TestBase from '../../testbase';

import TemplateCtrl from './template-ctrl';

describe('asset.template.TemplateCtrl', () => {
  let mockAsset;
  let mockAssetService;
  let mockGeneratorService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {};
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['generate']);
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
      let data = {
        a: 'dataA',
        b: 'dataB'
      };
      mockGeneratorService.generate.and.returnValue(data);

      spyOn(Math, 'random').and.returnValue(0.5);
      spyOn(Object, 'keys').and.returnValue(['a', 'b']);
      ctrl.updatePreview_();

      expect(mockIframeEl.srcdoc).toEqual('dataB');
    });

    it('should do nothing if there are no keys', () => {
      mockGeneratorService.generate.and.returnValue({});

      ctrl.updatePreview_();
      expect(mockIframeEl.srcdoc).toEqual(undefined);
    });

    it('should keep previously set preview key', () => {
      let data = {
        a: 'dataA',
        b: 'dataB'
      };
      mockGeneratorService.generate.and.returnValue(data);

      spyOn(Math, 'random').and.returnValue(0.5);
      spyOn(Object, 'keys').and.returnValue(['a', 'b']);
      ctrl.updatePreview_();

      Math.random.and.returnValue(0);
      ctrl.updatePreview_();
      expect(mockIframeEl.srcdoc).toEqual('dataB');
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
      mockGeneratorService.generate.and.returnValue({ a: 'data' });
      ctrl.onLink(mockIframeEl);
    });

    it('should update the input element srcdoc', () => {
      mockGeneratorService.generate.and.returnValue({ b: 'newData' });
      ctrl.onRefreshClick();
      expect(mockIframeEl.srcdoc).toEqual('newData');
    });
  });
});
