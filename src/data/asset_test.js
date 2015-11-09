import TestBase from '../testbase';

import Asset from './asset';
import DataFormat from './data-format';
import Helper from './helper';
import RawSource from './raw-source';

describe('data.Asset', () => {
  it('should be able to be converted to / from JSON', () => {
    let helpers = [
      new Helper('helper1'),
      new Helper('helper2')
    ];
    let globals = {
      'field1': '1',
      'field2': '2'
    };
    let asset = new Asset('name');
    asset.source = new RawSource('rawData', DataFormat.TSV);
    asset.globalsString = JSON.stringify(globals);
    asset.helpers['helper1'] = helpers[0];
    asset.helpers['helper2'] = helpers[1];

    let copy = Asset.fromJSON(asset.toJSON());
    expect(copy).toEqual(asset);
  });
});
