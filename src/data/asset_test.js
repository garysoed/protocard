import TestBase from '../testbase';

import Asset from './asset';
import DataFormat from './data-format';
import Field from './field';
import RawSource from './raw-source';

describe('data.Asset', () => {
  it('should be able to be converted to / from JSON', () => {
    let asset = new Asset('name');
    asset.source = new RawSource('rawData', DataFormat.TSV);
    asset.globals.field1 = new Field('field1Name', 'field1Value');
    asset.globals.field2 = new Field('field2Name', 'field2Value');

    let copy = Asset.fromJSON(asset.toJSON());
    expect(copy).toEqual(asset);
  });
});
