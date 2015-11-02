import TestBase from '../testbase';

import Asset from './asset';
import DataFormat from './data-format';
import Field from './field';
import RawSource from './raw-source';

describe('data.Asset', () => {
  it('should be able to be converted to / from JSON', () => {
    let globals = {
      'field1': '1',
      'field2': '2'
    };
    let asset = new Asset('name');
    asset.source = new RawSource('rawData', DataFormat.TSV);
    asset.globalsString = JSON.stringify(globals);

    let copy = Asset.fromJSON(asset.toJSON());
    expect(copy).toEqual(asset);
  });
});
