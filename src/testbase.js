import Asset from './data/asset';
import Helper from './data/helper';

jasmine.createObj = (name) => {
  return { type: name };
};

beforeEach(() => {
  jasmine.addCustomEqualityTester(Asset.equals.bind(Asset));
  jasmine.addCustomEqualityTester(Helper.equals.bind(Helper));
  jasmine.clock().install();
});

afterEach(() => {
  jasmine.clock().uninstall();
});

export default {};
