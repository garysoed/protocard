import Asset from './data/asset';

beforeEach(() => {
  jasmine.addCustomEqualityTester(Asset.equals.bind(Asset));
  jasmine.clock().install();
});

afterEach(() => {
  jasmine.clock().uninstall();
});

export default {};
