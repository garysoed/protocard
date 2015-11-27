import TestBase from '../testbase';

import Asset from './asset';
import DataFormat from './data-format';
import File, { Types as FileTypes } from './file';
import FunctionObject from './function-object';
import ImageResource from './image-resource';
import RawSource from './raw-source';

describe('data.Asset', () => {
  it('should be able to be converted to / from JSON', () => {
    let helpers = [
      new FunctionObject('function f1() {}'),
      new FunctionObject('function f2() {}')
    ];
    let globals = {
      'field1': '1',
      'field2': '2'
    };
    let images = new Set([
      new ImageResource('image1.png', 'http://image1.png', 'http://preview/image1.png'),
      new ImageResource('image2.png', 'http://image2.png', 'http://preview/image2.png'),
    ]);
    let asset = new Asset('name');
    asset.globalsString = JSON.stringify(globals);
    asset.helpers['functionObject1'] = helpers[0];
    asset.helpers['functionObject2'] = helpers[1];
    asset.data = new File(FileTypes.TSV, 'content');
    asset.images_ = images;
    asset.templateString = 'templateString';

    let copy = Asset.fromJSON(asset.toJSON());
    expect(copy).toEqual(asset);
  });
});
