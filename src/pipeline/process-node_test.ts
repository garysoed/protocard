import TestBase from '../testbase';
TestBase.init();

import ProcessNode from './process-node';

describe('pipeline.ProcessNode', () => {
  let mockAsset;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');

    let textNode = jasmine.createSpyObj('TextNode', ['addChangeListener']);
    node = new ProcessNode(mockAsset, textNode);
  });

  describe('runHandler_', () => {
    it('should return promise which resolves to the mapped writer value',
        (done: jasmine.IDoneFn) => {
      let mockFunction = jasmine.createSpy('Function');
      mockFunction.and.callFake((input: any) => input[1]);

      let mockDataProcessor = jasmine.createSpyObj('DataProcessor', ['asFunction']);
      mockDataProcessor.asFunction.and.returnValue(mockFunction);

      mockAsset.dataProcessor = mockDataProcessor;

      let lineData = [
        ['line', 'one'],
        ['line', 'two'],
      ];
      node.runHandler_([lineData])
          .then((result: any) => {
            expect(result).toEqual(['one', 'two']);
            expect(mockFunction).toHaveBeenCalledWith(lineData[0], 0, lineData);
            expect(mockFunction).toHaveBeenCalledWith(lineData[1], 1, lineData);
            done();
          }, done.fail);
    });
  });
});
