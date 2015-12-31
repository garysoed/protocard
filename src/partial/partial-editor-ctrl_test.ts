import TestBase from '../testbase';
TestBase.init();

import PartialEditorCtrl from './partial-editor-ctrl';

describe('partial.PartialEditorCtrl', () => {
  const NAME = 'partialName';
  const PARTIAL = 'partial';

  let mockAsset;
  let mockAssetService;
  let mockGeneratorService;
  let mockLocalDataList;
  let ctrl;

  beforeEach(() => {
    mockAsset = { partials: { [NAME]: PARTIAL } };
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockLocalDataList = [];
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['localDataList']);
    mockGeneratorService.localDataList.and.returnValue(mockLocalDataList);

    ctrl = new PartialEditorCtrl(
        jasmine.cast<angular.IScope>({ 'asset': mockAsset, 'name': NAME }),
        mockAssetService,
        mockGeneratorService)
  });

  describe('set templateString', () => {
    it('should update the partial and save the asset', () => {
      let newString = 'newPartial';

      ctrl.templateString = newString;

      expect(ctrl.templateString).toEqual(newString);
      expect(mockAsset.partials).toEqual({ [NAME]: newString });
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });

    it('should not save the asset if the input is null', () => {
      ctrl.templateString = null;

      expect(ctrl.templateString).toEqual(null);
      expect(mockAsset.partials).toEqual({ [NAME]: PARTIAL });
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });

  describe('get previewData', () => {
    it('should randomly select a preview data', () => {
      mockLocalDataList.push('data1');
      mockLocalDataList.push('data2');

      spyOn(Math, 'random').and.returnValue(0.5);

      expect(ctrl.previewData).toEqual('data2');
    });

    it('should cache the selected preview data', () => {
      mockLocalDataList.push('data1');
      mockLocalDataList.push('data2');

      let randomSpy = spyOn(Math, 'random');
      randomSpy.and.returnValue(0.5);
      ctrl.previewData;

      randomSpy.and.returnValue(0);
      expect(ctrl.previewData).toEqual('data2');
    });

    it('should return null if there are no local data', () => {
      expect(ctrl.previewData).toEqual(null);
    });
  });

  describe('onRefreshClick', () => {
    it('should clear the cache for the preview data', () => {
      mockLocalDataList.push('data1');
      mockLocalDataList.push('data2');

      let randomSpy = spyOn(Math, 'random');
      randomSpy.and.returnValue(0.5);
      ctrl.previewData;

      randomSpy.and.returnValue(0);
      ctrl.onRefreshClick();
      expect(ctrl.previewData).toEqual('data1');
    });
  });
});
