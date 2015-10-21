import Asset from './data/asset';

beforeEach(() => {
  jasmine.addCustomEqualityTester(Asset.equals.bind(Asset));
});

export default {};
