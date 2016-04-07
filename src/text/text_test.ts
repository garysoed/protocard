import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import File, { FileTypes } from '../model/file';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import { EventType as NodeEventType } from '../pipeline/node';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';
import { TextCtrl } from './text';


describe('text.TextCtrl', () => {
  const ASSET_ID = 'assetId';

  let mock$scope;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockDeregister;
  let ctrl;

  beforeEach(() => {
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockDeregister = jasmine.createSpy('deregister');

    mock$scope = FakeScope.create();
    spyOn(mock$scope, '$on');

    ctrl = new TextCtrl(mock$scope, mockAssetPipelineService, mockAssetService);
    TestDispose.add(ctrl);
  });

  describe('onTextNodeChange_', () => {
    it('should trigger digest', () => {
      spyOn(ctrl, 'triggerDigest');

      ctrl['onTextNodeChange_']();
      expect(ctrl.triggerDigest).toHaveBeenCalledWith();
    });
  });

  describe('$onInit', () => {
    it('should load the asset pipeline and listen to changed event', () => {
      let assetId = 'assetId';
      let mockAsset = Mocks.object('Asset');
      mockAsset.id = assetId;

      let mockTextNode = Mocks.listenable('TextNode');
      spyOn(mockTextNode, 'on').and.callThrough();

      mockAssetPipelineService.getPipeline.and.returnValue({ textNode: mockTextNode });

      spyOn(ctrl, 'onTextNodeChange_');

      ctrl.asset = mockAsset;
      ctrl.$onInit();

      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
      expect(mockTextNode.on).toHaveBeenCalledWith(NodeEventType.CHANGED, jasmine.any(Function));
      expect(ctrl['textNode_']).toEqual(mockTextNode);

      mockTextNode.on.calls.argsFor(0)[1]();
      expect(ctrl['onTextNodeChange_']).toHaveBeenCalledWith();
    });
  });

  describe('set data', () => {
    it('should update the asset data and save it', () => {
      let mockAsset = Mocks.object('Asset');
      let mockTextNode = jasmine.createSpyObj('TextNode', ['addChangeListener', 'refresh']);
      let data = {};
      ctrl.asset = mockAsset;
      ctrl['textNode_'] = mockTextNode;

      ctrl.data = data;
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockTextNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('get parsedData', () => {
    it('should return the correct data', (done: jasmine.IDoneFn) => {
      let mockTextNode = jasmine.createSpyObj('TextNode', ['addChangeListener', 'refresh']);
      let textNodeResult = 'textNodeResult';
      mockTextNode.result = Promise.resolve(textNodeResult);

      ctrl['textNode_'] = mockTextNode;
      ctrl.parsedData.promise
          .then((result: any) => {
            expect(result).toEqual(textNodeResult);
            done();
          }, done.fail);
    });
  });

  describe('hasData', () => {
    let file = new File(FileTypes.TSV, 'a\nb');
    let mockAsset;

    beforeEach(() => {
      mockAsset = Mocks.object('Asset');
      ctrl.asset = mockAsset;
    });

    it('should return true if the asset has data', () => {
      mockAsset.data = file;
      expect(ctrl.hasData()).toEqual(true);
    });

    it('should return false if the asset has no data', () => {
      mockAsset.data = null;
      expect(ctrl.hasData()).toEqual(false);
    });
  });
});
