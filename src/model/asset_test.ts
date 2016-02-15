import TestBase from '../testbase';
TestBase.init();

import Asset from './asset';
import File, { FileTypes } from './file';
import FunctionObject from './function-object';
import ImageResource from './image-resource';
import Serializer from './serializable';

describe('model.Asset', () => {
  it('should be able to be converted to / from JSON', () => {
    let asset = new Asset('name');
    asset.globalsString = JSON.stringify({
      'field1': '1',
      'field2': '2',
    });
    asset.helpers['functionObject1'] = new FunctionObject('function f1() {}');
    asset.helpers['functionObject2'] = new FunctionObject('function f2() {}');
    asset.data = new File(FileTypes.TSV, 'content');
    asset.images['image1.png'] =
        new ImageResource('image1.png', 'http://image1.png', 'http://preview/image1.png');
    asset.images['image2.png'] =
        new ImageResource('image2.png', 'http://image2.png', 'http://preview/image2.png');

    asset.partials['partial1'] = 'partial1';
    asset.partials['partial2'] = 'partial2';
    asset.templateString = 'templateString';
    asset.height = 123;
    asset.width = 456;

    expect(Serializer.fromJSON(Serializer.toJSON(asset))).toEqual(asset);
  });
});
