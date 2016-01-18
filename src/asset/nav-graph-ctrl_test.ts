import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../testing/fake-scope';
import NavGraphCtrl from './nav-graph-ctrl';

describe('asset.NavGraphCtrl', () => {
  let mock$scope;
  let mockDeregister;
  let mockProcessNode;
  let mockTextNode;
  let ctrl;

  beforeEach(() => {
    mock$scope = <any>(new FakeScope());
    mock$scope['asset'] = { id: 'assetId' };
    spyOn(mock$scope, '$on');

    mockDeregister = jasmine.createSpy('deregister');

    mockProcessNode = jasmine.createSpyObj('ProcessNode', ['addChangeListener']);
    mockProcessNode.addChangeListener.and.returnValue(mockDeregister);

    mockTextNode = jasmine.createSpyObj('TextNode', ['addChangeListener']);
    mockTextNode.addChangeListener.and.returnValue(mockDeregister);

    let mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({
      processNode: mockProcessNode,
      textNode: mockTextNode
    });

    ctrl = new NavGraphCtrl(mock$scope, mockAssetPipelineService);
  });

  it('should trigger digest when process node is changed', () => {
    spyOn(mock$scope, '$apply');

    expect(mockProcessNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockProcessNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when text node is changed', () => {
    spyOn(mock$scope, '$apply');

    expect(mockTextNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockTextNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should deregister all the listeners on destroy', () => {
    expect(mock$scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));

    mock$scope.$on.calls.argsFor(0)[1]();

    expect(mockDeregister).toHaveBeenCalledWith();
    expect(mockDeregister.calls.count()).toEqual(2);
  });
});
