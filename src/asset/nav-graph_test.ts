import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../testing/fake-scope';
import { NavGraphCtrl } from './nav-graph';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';

describe('asset.NavGraphCtrl', () => {
  let mock$scope;
  let mockDeregister;
  let mockExportNode;
  let mockGlobalNode;
  let mockHelperNode;
  let mockImageNode;
  let mockLabelNode;
  let mockPartialNode;
  let mockProcessNode;
  let mockTemplateNode;
  let mockTextNode;
  let ctrl;

  function createSpyNode(name: string, deregister: Function): any {
    let mock = jasmine.createSpyObj(name, ['addChangeListener']);
    mock.addChangeListener.and.returnValue(deregister);
    return mock;
  }

  beforeEach(() => {
    mock$scope = <any> (new FakeScope());
    spyOn(mock$scope, '$on');

    mockDeregister = jasmine.createSpy('deregister');
    mockExportNode = createSpyNode('ExportNode', mockDeregister);
    mockGlobalNode = createSpyNode('GlobalNode', mockDeregister);
    mockHelperNode = createSpyNode('HelperNode', mockDeregister);
    mockImageNode = createSpyNode('ImageNode', mockDeregister);
    mockLabelNode = createSpyNode('LabelNode', mockDeregister);
    mockPartialNode = createSpyNode('PartialNode', mockDeregister);
    mockProcessNode = createSpyNode('ProcessNode', mockDeregister);
    mockTemplateNode = createSpyNode('TemplateNode', mockDeregister);
    mockTextNode = createSpyNode('TextNode', mockDeregister);

    let mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({
      exportNode: mockExportNode,
      globalNode: mockGlobalNode,
      helperNode: mockHelperNode,
      imageNode: mockImageNode,
      labelNode: mockLabelNode,
      partialNode: mockPartialNode,
      processNode: mockProcessNode,
      templateNode: mockTemplateNode,
      textNode: mockTextNode,
    });

    ctrl = new NavGraphCtrl(mock$scope, mockAssetPipelineService);
    ctrl.asset = { id: 'assetId' };
    TestDispose.add(ctrl);
  });

  it('should trigger digest when export node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['exportNode_'];
    expect(mockExportNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockExportNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when global node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['globalNode_'];
    expect(mockGlobalNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockGlobalNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when helper node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['helperNode_'];
    expect(mockHelperNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockHelperNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when image node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['imageNode_'];
    expect(mockImageNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockImageNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when label node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['labelNode_'];
    expect(mockLabelNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockLabelNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when partial node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['partialNode_'];
    expect(mockPartialNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockPartialNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when process node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['processNode_'];
    expect(mockProcessNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockProcessNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when template node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['templateNode_'];
    expect(mockTemplateNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockTemplateNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should trigger digest when text node is changed', () => {
    spyOn(mock$scope, '$apply');

    ctrl['textNode_'];
    expect(mockTextNode.addChangeListener).toHaveBeenCalledWith(jasmine.any(Function));

    mockTextNode.addChangeListener.calls.argsFor(0)[0]();
    expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should deregister all the listeners on destroy', () => {
    ctrl['exportNode_'];
    ctrl['globalNode_'];
    ctrl['helperNode_'];
    ctrl['imageNode_'];
    ctrl['labelNode_'];
    ctrl['partialNode_'];
    ctrl['processNode_'];
    ctrl['templateNode_'];
    ctrl['textNode_'];

    expect(mock$scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));

    mock$scope.$on.calls.argsFor(0)[1]();

    expect(mockDeregister).toHaveBeenCalledWith();
    expect(mockDeregister.calls.count()).toEqual(9);
  });
});
