import TestBase from '../testbase';
TestBase.init();

import DownloadService from './download-service';

describe('common.DownloadService', () => {
  let mock$window;
  let mockDocument;
  let service;

  beforeEach(() => {
    mock$window = {};
    mockDocument = jasmine.createSpyObj('Document', ['createElement']);
    service = new DownloadService([mockDocument], mock$window);
  });

  describe('linkEl', () => {
    it('should create a new link element and return it', () => {
      let mockAnchor = <HTMLAnchorElement>{};
      mockDocument.createElement.and.returnValue(mockAnchor);

      expect(service.linkEl).toEqual(mockAnchor);
      expect(mockAnchor.target).toEqual('_blank');
    });

    it('should cache the created link element', () => {
      let mockAnchor = {};
      mockDocument.createElement.and.returnValue(mockAnchor);
      service.linkEl;

      mockDocument.createElement.calls.reset();
      expect(service.linkEl).toEqual(mockAnchor);
      expect(mockDocument.createElement).not.toHaveBeenCalled();
    });
  });

  describe('download', () => {
    let mockAnchor;

    beforeEach(() => {
      mockAnchor = jasmine.createSpyObj('Anchor', ['click']);
      mockDocument.createElement.and.returnValue(mockAnchor);
    });

    it('should trigger the download', () => {
      let blob = {};
      let filename = 'filename';
      let url = 'url';
      let mockURL = jasmine.createSpyObj('URL', ['createObjectURL', 'revokeObjectURL']);
      mockURL.createObjectURL.and.returnValue(url);
      mock$window.URL = mockURL;

      service.download(blob, filename);

      expect(mockAnchor.download).toEqual(filename);
      expect(mockAnchor.href).toEqual(url);
      expect(mockAnchor.click).toHaveBeenCalledWith();
      expect(mockURL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith(url);
    });
  });
});
