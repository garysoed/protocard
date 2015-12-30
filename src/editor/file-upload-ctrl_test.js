import TestBase from '../testbase';

import { FileTypes } from '../model/file';
import FileUploadCtrl from './file-upload-ctrl';

describe('editor.FileUploadCtrl', () => {
  let mockInputEl;
  let mockNgModelCtrl;
  let mockFileReaderCtor;
  let ctrl;

  beforeEach(() => {
    mockInputEl = jasmine.createSpyObj('input', ['addEventListener', 'click']);
    mockNgModelCtrl = jasmine.createSpyObj('NgModelCtrl', ['$setViewValue']);
    mockFileReaderCtor = jasmine.createSpy('FileReader');
    ctrl = new FileUploadCtrl(
        {
          classes: 'classes',
          extensions: 'extensions'
        },
        { 'FileReader': mockFileReaderCtor });
    ctrl.onLink(mockInputEl, mockNgModelCtrl);
  });

  describe('onLink', () => {
    it('should listen to change event', () => {
      expect(mockInputEl.addEventListener).toHaveBeenCalledWith('change', jasmine.any(Function));
    });
  });

  describe('onFileChange_', () => {
    let fileChangeHandler;

    beforeEach(() => {
      fileChangeHandler = mockInputEl.addEventListener.calls.argsFor(0)[1];
    });

    it('should set the ngModelCtrl view value to the file object with the correct data', () => {
      let fileReaderResult = 'fileReaderResult';
      let file = { name: 'filename.tsv' };
      let mockFileReader = jasmine.createSpyObj('FileReader', ['addEventListener', 'readAsText']);
      mockFileReader.result = fileReaderResult;
      mockFileReaderCtor.and.returnValue(mockFileReader);

      mockInputEl.files = [file];
      fileChangeHandler();

      expect(mockFileReader.readAsText).toHaveBeenCalledWith(file);
      expect(mockFileReader.addEventListener)
          .toHaveBeenCalledWith('loadend', jasmine.any(Function));

      mockFileReader.addEventListener.calls.argsFor(0)[1]();

      let fileObj = mockNgModelCtrl.$setViewValue.calls.argsFor(0)[0];
      expect(fileObj.type).toEqual(FileTypes.TSV);
      expect(fileObj.content).toEqual(fileReaderResult);
    });
  });

  describe('onUploadClick', () => {
    it('should click the input element', () => {
      ctrl.onUploadClick();
      expect(mockInputEl.click).toHaveBeenCalledWith();
    });
  });
});
