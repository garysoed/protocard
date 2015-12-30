import TestBase from '../testbase';

import Asset from './asset';
import File, { FileTypes } from './file';
import FunctionObject from './function-object';
import ImageResource from './image-resource';
import RawSource from './raw-source';

describe('model.Asset', () => {
  it('should be able to be converted to / from JSON', () => {
    let asset = new Asset('name');
    asset.globalsString = JSON.stringify({
      'field1': '1',
      'field2': '2'
    });
    asset.helpers['functionObject1'] = new FunctionObject('function f1() {}');
    asset.helpers['functionObject2'] = new FunctionObject('function f2() {}');
    asset.data = new File(FileTypes.TSV, 'content');
    asset.images_ = {
      'image1.png' :
          new ImageResource('image1.png', 'http://image1.png', 'http://preview/image1.png'),
      'image2.png' :
          new ImageResource('image2.png', 'http://image2.png', 'http://preview/image2.png'),
    };
    asset.partials['partial1'] = 'partial1content';
    asset.partials['partial2'] = 'partial2content';
    asset.templateString = 'templateString';

    let copy = Asset.fromJSON(asset.toJSON());
    expect(copy).toEqual(asset);
  });
});
