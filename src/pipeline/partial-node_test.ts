import TestBase from '../testbase';
TestBase.init();

import PartialNode from './partial-node';

describe('pipeline.PartialNode', () => {
  let mockAsset;
  let mockGeneratorService;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('asset');
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['createGenerator']);
    node = new PartialNode(
        mockAsset,
        mockGeneratorService,
        jasmine.createSpyObj('GlobalNode', ['addChangeListener']),
        jasmine.createSpyObj('HelperNode', ['addChangeListener']),
        jasmine.createSpyObj('ImageNode', ['addChangeListener']),
        jasmine.createSpyObj('LabelNode', ['addChangeListener']),
        jasmine.createSpyObj('ProcessNode', ['addChangeListener']));
  });

  describe('runHandler_', () => {
    it('should return a promise with the correct result', done => {
      let globals = jasmine.createObj('globals');
      let helpers = jasmine.createObj('helpers');
      let images = jasmine.createObj('images');
      let processedData = jasmine.createObj('processedData');

      let templateName = 'templateName';

      mockAsset.partials = {
        'partial1': 'partial1String',
        'partial2': 'partial2String'
      };
      mockAsset.templateName = templateName;

      let mockGenerator = jasmine.createSpyObj('Generator', ['generate']);
      mockGenerator.generate.and.callFake(partialString => {
        return `${partialString}Rendered`;
      });

      mockGeneratorService.createGenerator.and.returnValue(mockGenerator);

      node.runHandler_([globals, helpers, images, {}, processedData])
          .then(results => {
            expect(results).toEqual({
              'partial1': 'partial1StringRendered',
              'partial2': 'partial2StringRendered'
            });
            expect(mockGeneratorService.createGenerator)
                .toHaveBeenCalledWith(globals, helpers, images, {});

            expect(mockGenerator.generate)
                .toHaveBeenCalledWith('partial1String', templateName, processedData);
            expect(mockGenerator.generate)
                .toHaveBeenCalledWith('partial2String', templateName, processedData);
            done();
          }, done.fail);
    });
  });
});
