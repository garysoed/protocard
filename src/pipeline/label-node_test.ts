import TestBase from '../testbase';
TestBase.init();

import LabelNode from './label-node';

describe('pipeline.LabelNode', () => {
  let mockAsset;
  let mockGeneratorService;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['createGenerator']);
    node = new LabelNode(
        mockAsset,
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
      let renderedLabel = 'renderedLabel';

      let mockGenerator = jasmine.createSpyObj('Generator', ['generateNames']);
      mockGenerator.generateNames.and.returnValue(renderedLabel);
      mockGeneratorService.createGenerator.and.returnValue(mockGenerator);

      mockAsset.templateName = templateName;

      node.runHandler_([globals, helpers, processedData])
          .then(result => {
            expect(result).toEqual(renderedLabel);
            expect(mockGeneratorService.createGenerator)
                .toHaveBeenCalledWith(globals, helpers, {}, {});
            expect(mockGenerator.generateNames).toHaveBeenCalledWith(templateName, processedData);
            done();
          }, done.fail);
    });
  });
});
