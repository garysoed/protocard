import TestBase from '../testbase';

import ImageResource from './image-resource';

describe('data.ImageResource', () => {
  it('should be able to be converted to / from JSON', () => {
    let imageResource = new ImageResource('alias', 'url', 'previewUrl');
    let copy = ImageResource.fromJSON(imageResource.toJSON());
    expect(copy).toEqual(imageResource);
  });
});
