import TestBase from '../testbase';
TestBase.init();

import SettingsDialogCtrl, { PRESETS } from './settings-dialog-ctrl';

describe('settings.SettingsDialogCtrl', () => {
  let mock$mdDialog;
  let mockAsset;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockDownloadService;
  let mockGlobalNode;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['hide']);
    mockAsset = jasmine.createObj('asset');
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['deleteAsset', 'saveAsset']);
    mockDownloadService = jasmine.createSpyObj('DownloadService', ['download']);
    mockGlobalNode = jasmine.createSpyObj('GlobalNode', ['refresh']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toHome']);

    mockAssetPipelineService.getPipeline.and.returnValue({ globalNode: mockGlobalNode });

    ctrl = new SettingsDialogCtrl(
        mock$mdDialog,
        mockAsset,
        mockAssetPipelineService,
        mockAssetService,
        mockDownloadService,
        mockNavigateService);
  });

  describe('get and set assetHeight', () => {
    it('should update the height and refresh node', () => {
      let height = 123;
      ctrl.assetHeight = height;
      expect(mockAsset.height).toEqual(height);
      expect(ctrl.selectedPresetId).toEqual(PRESETS.length - 1);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockGlobalNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('get and set assetName', () => {
    it('should save the asset', () => {
      let name = 'newName';
      ctrl.assetName = name;

      expect(ctrl.assetName).toEqual(name);
      expect(mockAsset.name).toEqual(name);
      expect(mockAssetService.saveAsset)
          .toHaveBeenCalledWith(jasmine.objectContaining({ 'name': name }));
    });
  });

  describe('get and set assetWidth', () => {
    it('should update the width and refresh node', () => {
      let width = 123;
      ctrl.assetWidth = width;
      expect(mockAsset.width).toEqual(width);
      expect(ctrl.selectedPresetId).toEqual(PRESETS.length - 1);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockGlobalNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('set selectedPresetId', () => {
    it('should update the height and width', () => {
      let id = 0;
      let preset = PRESETS[id];

      ctrl.selectedPresetId = id;

      expect(mockAsset.height).toEqual(preset.height);
      expect(mockAsset.width).toEqual(preset.width);

      expect(ctrl.assetHeight).toEqual(preset.height);
      expect(ctrl.assetWidth).toEqual(preset.width);

      expect(ctrl.selectedPresetId).toEqual(id);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockGlobalNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('onDeleteClick', () => {
    it('should delete the asset and navigate to home', () => {
      ctrl.onDeleteClick();

      expect(mockAssetService.deleteAsset).toHaveBeenCalledWith(mockAsset);
      expect(mock$mdDialog.hide).toHaveBeenCalledWith();
      expect(mockNavigateService.toHome).toHaveBeenCalledWith();
    });
  });

  describe('onDownloadClick', () => {
    it('should create the asset JSON and downloads it', (done: jasmine.IDoneFn) => {
      let name = 'name';
      mockAsset.name = name;

      ctrl.onDownloadClick();

      expect(mockDownloadService.download)
          .toHaveBeenCalledWith(jasmine.any(Blob), `${name}.json`);

      let blob = mockDownloadService.download.calls.argsFor(0)[0];
      let fileReader = new FileReader();
      fileReader.addEventListener('loadend', () => {
        expect(JSON.parse(fileReader.result)).toEqual(mockAsset);
        done();
      });
      fileReader.readAsText(blob);
    });
  });

  describe('onOkClick', () => {
    it('should hide the dialog', () => {
      ctrl.onOkClick();

      expect(mock$mdDialog.hide).toHaveBeenCalledWith();
    });
  });
});
