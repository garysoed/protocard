import TestBase from '../testbase';
TestBase.init();

import ExportNode from './export-node';

describe('pipeline.ExportNode', () => {
  let node;

  beforeEach(() => {
    node = new ExportNode(
        jasmine.createSpyObj('TemplateNode', ['addChangeListener']));
  });

  describe('runHandler_', () => {
    it('should return promise that resolves to an array of promises', done => {
      let label1 = 'label1';
      let dataUri1 = 'dataUri1';
      let renderedData1 = { dataUriTicket: { promise: Promise.resolve(dataUri1) } };
      let label2 = 'label2';
      let dataUri2 = 'dataUri2';
      let renderedData2 = { dataUriTicket: { promise: Promise.resolve(dataUri2) } };

      node.runHandler_([{ [label1]: renderedData1, [label2]: renderedData2 }])
          .then(promises => {
            return Promise.all(promises);
          }, done.fail)
          .then(imageResources => {
            let [imageResource1, imageResource2] = imageResources;
            expect(imageResource1.alias).toEqual(label1);
            expect(imageResource1.url).toEqual(dataUri1);
            expect(imageResource2.alias).toEqual(label2);
            expect(imageResource2.url).toEqual(dataUri2);
            done();
          }, done.fail);
    });
  });
});
