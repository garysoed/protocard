import TestBase from '../testbase';
TestBase.init();

import TemplateNode from './template-node';

describe('pipeline.TemplateNode', () => {
  let mockAsset;
  let mockGeneratorService;
  let mockRenderService;
  let node;

  beforeEach(() => {
    mockAsset = jasmine.createObj('Asset');
    mockGeneratorService = jasmine.createSpyObj('GeneratorService', ['createGenerator']);
    mockRenderService = jasmine.createSpyObj('RenderService', ['render']);
    node = new TemplateNode(
        mockAsset,
        mockGeneratorService,
        jasmine.createSpyObj('GlobalNode', ['addChangeListener']),
        jasmine.createSpyObj('HelperNode', ['addChangeListener']),
        jasmine.createSpyObj('ImageNode', ['addChangeListener']),
        jasmine.createSpyObj('LabelNode', ['addChangeListener']),
        jasmine.createSpyObj('PartialNode', ['addChangeListener']),
        jasmine.createSpyObj('ProcessNode', ['addChangeListener']),
        mockRenderService);
  });

  describe('runHandler', () => {
    it('should return promise that resolves with the correct data', done => {
      let globals = jasmine.createObj('globals');
      let helpers = jasmine.createObj('helpers');
      let images = jasmine.createObj('images');
      let labelledData = jasmine.createObj('labelledData');
      let partials = jasmine.createObj('partials');
      let processedData = jasmine.createObj('processedData');
      let templateName = 'templateName';
      let templateString = 'templateString';

      let htmlStringMap = {
        'label1': 'htmlString1',
        'label2': 'htmlString2'
      };

      let mockGenerator = jasmine.createSpyObj('Generator', ['generate']);
      mockGenerator.generate.and.returnValue(htmlStringMap);

      mockGeneratorService.createGenerator.and.returnValue(mockGenerator);

      mockRenderService.render.and.callFake(htmlString => {
        return `rendered${htmlString}`;
      });

      mockAsset.partials = partials;
      mockAsset.templateName = templateName;
      mockAsset.templateString = templateString;

      node.runHandler_([globals, helpers, images, labelledData, processedData])
          .then(renderedMap => {
            expect(Object.keys(renderedMap).length).toEqual(2);

            let rendered1 = renderedMap['label1'];
            expect(rendered1.htmlSource).toEqual('htmlString1');

            let rendered2 = renderedMap['label2'];
            expect(rendered2.htmlSource).toEqual('htmlString2');

            expect(mockGeneratorService.createGenerator)
                .toHaveBeenCalledWith(globals, helpers, images, partials);
            expect(mockGenerator.generate)
                .toHaveBeenCalledWith(templateString, templateName, processedData);
            expect(mockRenderService.render).toHaveBeenCalledWith('htmlString1', 825, 1125);
            expect(mockRenderService.render).toHaveBeenCalledWith('htmlString2', 825, 1125);

            return Promise.all([
              rendered1.dataUriPromise,
              rendered2.dataUriPromise
            ]);
          }, done.fail)
          .then(dataUris => {
            let [dataUri1, dataUri2] = dataUris;
            expect(dataUri1).toEqual('renderedhtmlString1');
            expect(dataUri2).toEqual('renderedhtmlString2');
            done();
          }, done.fail);
    });
  });
});
