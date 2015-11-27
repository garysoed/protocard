import Asset from './data/asset';
import FunctionObject from './data/function-object';

jasmine.createObj = (name) => {
  return { type: name };
};

beforeEach(() => {
  jasmine.addCustomEqualityTester(Asset.equals.bind(Asset));
  jasmine.addCustomEqualityTester(FunctionObject.equals.bind(FunctionObject));
  jasmine.clock().install();
});

afterEach(() => {
  jasmine.clock().uninstall();
});

export default {};
