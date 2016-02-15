import TestBase from '../testbase';
TestBase.init();

import Extract from '../convert/extract';
import { FileTypes } from '../model/file';
import TextNode from './text-node';

describe('pipeline.TextNode', () => {
  let mockAsset;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');
    node = new TextNode(mockAsset);
  });

  describe('runHandler_', () => {
    it('should return the data extracted from TSV format', (done: jasmine.IDoneFn) => {
      let content = 'file content';
      let mockFile = jasmine.createObj('File');
      let extractedData = jasmine.createObj('extractedData');
      mockFile.type = FileTypes.TSV;
      mockFile.content = content;

      mockAsset.data = mockFile;

      spyOn(Extract, 'fromTsv').and.returnValue(extractedData);

      node.runHandler_()
          .then((result: any) => {
            expect(result).toEqual(extractedData);
            expect(Extract.fromTsv).toHaveBeenCalledWith(content);
            done();
          }, done.fail);
    });

    it('should throw error if the file type is unhandled', () => {
      let mockFile = jasmine.createObj('File');
      mockFile.type = null;

      mockAsset.data = mockFile;

      expect(() => node.runHandler_()).toThrowError(/Unhandled file type/);
    });
  });
});
