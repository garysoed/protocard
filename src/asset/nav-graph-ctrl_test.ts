import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../testing/fake-scope';
import NavGraphCtrl from './nav-graph-ctrl';

describe('asset.NavGraphCtrl', () => {
  let mock$scope;
  let mockDeregister;
  let mockGlobalNode;
  let mockHelperNode;
  let mockImageNode;
  let mockLabelNode;
  let mockPartialNode;
  let mockProcessNode;
  let mockTextNode;
  let ctrl;

  function createSpyNode(name: string, deregister: Function) {
    let mock = jasmine.createSpyObj(name, ['addChangeListener']);
    mock.addChangeListener.and.returnValue(deregister);
    return mock;
  }

  beforeEach(() => {
    mock$scope = <any>(new FakeScope());
    mock$scope['asset'] = { id: 'assetId' };
    spyOn(mock$scope, '$on');

    mockDeregister = jasmine.createSpy('deregister');
    mockGlobalNode = createSpyNode('GlobalNode', mockDeregister);
    mockHelperNode = createSpyNode('HelperNode', mockDeregister);
    mockImageNode = createSpyNode('ImageNode', mockDeregister);
    mockLabelNode = createSpyNode('LabelNode', mockDeregister);
    mockPartialNode = createSpyNode('PartialNode', mockDeregister);
    mockProcessNode = createSpyNode('ProcessNode', mockDeregister);
    mockTextNode = createSpyNode('TextNode', mockDeregister);

    let mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({
      globalNode: mockGlobalNode,
      helperNode: mockHelperNode,
      imageNode: mockImageNode,
      labelNode: mockLabelNode,
      partialNode: mockPartialNode,
      processNode: mockProcessNode,
      textNode: mockTextNode
    });

    ctrl = new NavGraphCtrl(mock$scope, mockAssetPipelineService);
  });

  it('should trigger digest when global node is changed', () => {
    spyOn(mock$scope, '$apply');

    expect(mockGlobalNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockGlobalNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when helper node is changed', () => {
    spyOn(mock$scope, '$apply');

    expect(mockHelperNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockHelperNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when image node is changed', () => {
    spyOn(mock$scope, '$apply');

    expect(mockImageNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockImageNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when label node is changed', () => {
    spyOn(mock$scope, '$apply');

    expect(mockLabelNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockLabelNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when partial node is changed', () => {
    spyOn(mock$scope, '$apply');

    expect(mockPartialNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockPartialNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
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
    expect(mockDeregister.calls.count()).toEqual(7);
  });
});
