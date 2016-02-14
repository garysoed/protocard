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
        jasmine.createSpyObj('LabelNode', ['addChangeListener']));
  });

  describe('runHandler_', () => {
    it('should return a promise with the correct result', done => {
      let globals = jasmine.createObj('globals');
      let helpers = jasmine.createObj('helpers');
      let images = jasmine.createObj('images');
      let labelledData = {
        data: {
          'label1': 'label1Data',
          'label2': 'label2Data'
        }
      };

      let templateName = 'templateName';

      mockAsset.partials = {
        'partial1': 'partial1String',
        'partial2': 'partial2String'
      };
      mockAsset.templateName = templateName;

      let mockGenerator = jasmine.createSpyObj('Generator', ['generateSingle']);
      mockGenerator.generateSingle.and.callFake((partialString, labelledData) => {
        return `${partialString}${labelledData}`;
      });

      mockGeneratorService.createGenerator.and.returnValue(mockGenerator);

      node.runHandler_([globals, helpers, images, labelledData])
          .then(results => {
            expect(results).toEqual({
              'partial1': {
                'label1': 'partial1Stringlabel1Data',
                'label2': 'partial1Stringlabel2Data'
              },
              'partial2': {
                'label1': 'partial2Stringlabel1Data',
                'label2': 'partial2Stringlabel2Data'
              }
            });
            expect(mockGeneratorService.createGenerator)
                .toHaveBeenCalledWith(globals, helpers, images, {});

            expect(mockGenerator.generateSingle)
                .toHaveBeenCalledWith('partial1String', 'label1Data');
            expect(mockGenerator.generateSingle)
                .toHaveBeenCalledWith('partial1String', 'label2Data');
            expect(mockGenerator.generateSingle)
                .toHaveBeenCalledWith('partial2String', 'label1Data');
            expect(mockGenerator.generateSingle)
                .toHaveBeenCalledWith('partial2String', 'label2Data');
            done();
          }, done.fail);
    });
  });
});
