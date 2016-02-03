import TestBase from '../testbase';
TestBase.init();

import LabelNode from './label-node';

describe('pipeline.LabelNode', () => {
  let mockAsset;
  let mockFuseService;
  let mockGeneratorService;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');
    mockFuseService = jasmine.createSpy('FuseService');
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['createGenerator']);
    node = new LabelNode(
        mockAsset,
        mockFuseService,
        mockGeneratorService,
        jasmine.createSpyObj('GlobalNode', ['addChangeListener']),
        jasmine.createSpyObj('HelperNode', ['addChangeListener']),
        jasmine.createSpyObj('ProcessNode', ['addChangeListener']));
  });

  describe('runHandler_', () => {
    it('should return a promise that resolves to the generator service output', done => {
      let globals = jasmine.createObj('globals');
      let helpers = jasmine.createObj('helpers');
      let processedData = jasmine.createObj('processedData');
      let templateName = 'templateName';
      let renderedLabels = { 'labelA': 'renderA', 'labelB': 'renderB' };
      let index = jasmine.createObj('index');

      let mockGenerator = jasmine.createSpyObj('Generator', ['generateNames']);
      mockGenerator.generateNames.and.returnValue(renderedLabels);
      mockGeneratorService.createGenerator.and.returnValue(mockGenerator);

      mockFuseService.and.returnValue(index);

      mockAsset.templateName = templateName;

      node.runHandler_([globals, helpers, processedData])
          .then(result => {
            expect(result).toEqual({ data: renderedLabels, index: index });
            expect(mockGeneratorService.createGenerator)
                .toHaveBeenCalledWith(globals, helpers, {}, {});
            expect(mockGenerator.generateNames).toHaveBeenCalledWith(templateName, processedData);
            expect(mockFuseService).toHaveBeenCalledWith(['labelA', 'labelB']);
            done();
          }, done.fail);
    });
  });
});
