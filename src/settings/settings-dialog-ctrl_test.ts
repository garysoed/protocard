import TestBase from '../testbase';
TestBase.init();

import SettingsDialogCtrl from './settings-dialog-ctrl';

describe('settings.SettingsDialogCtrl', () => {
  let mock$mdDialog;
  let mockAsset;
  let mockAssetService;
  let mockDownloadService;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['hide']);
    mockAsset = jasmine.createObj('asset');
    mockAssetService = jasmine.createSpyObj('AssetService', ['deleteAsset', 'saveAsset']);
    mockDownloadService = jasmine.createSpyObj('DownloadService', ['download']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toHome']);
    ctrl = new SettingsDialogCtrl(
        mock$mdDialog,
        mockAsset,
        mockAssetService,
        mockDownloadService,
        mockNavigateService);
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

  describe('onDeleteClick', () => {
    it('should delete the asset and navigate to home', () => {
      ctrl.onDeleteClick();

      expect(mockAssetService.deleteAsset).toHaveBeenCalledWith(mockAsset);
      expect(mock$mdDialog.hide).toHaveBeenCalledWith();
      expect(mockNavigateService.toHome).toHaveBeenCalledWith();
    });
  });

  describe('onDownloadClick', () => {
    it('should create the asset JSON and downloads it', done => {
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
