import TestBase from '../testbase';
TestBase.init();

import ImageResource from './image-resource';
import Serializer from './serializable';

describe('data.ImageResource', () => {
  it('should be able to be converted to / from JSON', () => {
    let imageResource = new ImageResource('alias', 'url', 'previewUrl');
    let copy = Serializer.fromJSON(Serializer.toJSON(imageResource));
    expect(copy).toEqual(imageResource);
  });
});
