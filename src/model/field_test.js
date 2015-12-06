import TestBase from '../testbase';

import Field from './field';

describe('data.Field', () => {
  it('should be able to be converted to / from JSON', () => {
    let field = new Field('name', 'value');
    let copy = Field.fromJSON(field.toJSON());
    expect(copy).toEqual(field);
  });
});
