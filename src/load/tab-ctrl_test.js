import TestBase from '../testbase';

import Asset from '../data/asset';
import TabCtrl from './tab-ctrl';

describe('load.TabCtrl', () => {
  let asset;
  let mock$scope;
  let mockAssetService;
  let mockDocument;
  let fakeFileReader;
  let ctrl;

  beforeEach(() => {
    asset = new Asset('test');
    mock$scope = {
      asset: asset,
      $apply: jasmine.createSpy('$scope.$apply')
    };
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockDocument = jasmine.createSpyObj('document', ['querySelector']);
    fakeFileReader = jasmine.createSpyObj('fileReader', ['addEventListener', 'readAsText']);
    ctrl = new TabCtrl(
        [mockDocument],
        mock$scope,
        { FileReader: () => fakeFileReader },
        mockAssetService);
  });

  describe('getDataPreview', () => {
    it('should return the asset source raw data', () => {
      let data = 'data';
      asset.source = { rawData: data };
      expect(ctrl.getDataPreview()).toEqual(data);
    });

    it('should return empty string if there are no data preview', () => {
      expect(ctrl.getDataPreview()).toEqual('');
    });
  });

  describe('hasDataPreview', () => {
    it('should return true if there is asset source data', () => {
      asset.source = { rawData: 'rawData' };
      expect(ctrl.hasDataPreview()).toEqual(true);
    });

    it('should return false if the asset has no source', () => {
      expect(ctrl.hasDataPreview()).toEqual(false);
    });
  });

  describe('isValid', () => {
    let file;

    beforeEach(() => {
      file = {};
    });

    it('should return true if the upload form is valid and there are files uploaded', () => {
      mockDocument.querySelector.and.returnValue({ files: [file] });
      mock$scope.uploadForm = { $valid: true };

      expect(ctrl.isValid()).toEqual(true);
    });

    it('should return false if the upload form is invalid', () => {
      mockDocument.querySelector.and.returnValue({ files: [file] });
      mock$scope.uploadForm = { $valid: false };

      expect(ctrl.isValid()).toEqual(false);
    });

    it('should return false if there are no files uploaded', () => {
      mockDocument.querySelector.and.returnValue({ files: [] });
      mock$scope.uploadForm = { $valid: true };

      expect(ctrl.isValid()).toEqual(false);
    });

    it('should return false if there are no upload forms', () => {
      mockDocument.querySelector.and.returnValue({ files: [file] });

      expect(ctrl.isValid()).toEqual(false);
    });
  });

  describe('onLoadClick', () => {
    it('should read from the file object, add it to the asset, save it, and trigger the digest cycle', () => {
      let file = {};

      mockDocument.querySelector.and.returnValue({ files: [file] });
      ctrl.onLoadClick();

      expect(fakeFileReader.readAsText).toHaveBeenCalledWith(file);
      expect(fakeFileReader.addEventListener)
          .toHaveBeenCalledWith('loadend', jasmine.any(Function));

      let fileContent = 'fileContent';
      fakeFileReader.result = fileContent;

      let format = 'format';
      mock$scope.dataFormat = format;

      fakeFileReader.addEventListener.calls.argsFor(0)[1]();

      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
      expect(asset.source.rawData).toEqual(fileContent)
      expect(asset.source.format).toEqual(format);

      expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });
});
