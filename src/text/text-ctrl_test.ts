import TestBase from '../testbase';
TestBase.init();

import FakeScope from '../testing/fake-scope';
import File, { FileTypes } from '../model/file';
import TextCtrl from './text-ctrl';

describe('text.TextCtrl', () => {
  const ASSET_ID = 'assetId';

  let mock$scope;
  let mockAsset;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockDeregister;
  let mockTextNode;
  let ctrl;

  beforeEach(() => {
    mockAsset = { id: ASSET_ID };
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockDeregister = jasmine.createSpy('deregister');
    mockTextNode = jasmine.createSpyObj('TextNode', ['addChangeListener', 'refresh']);
    mockTextNode.addChangeListener.and.returnValue(mockDeregister);

    mockAssetPipelineService.getPipeline.and.returnValue({ textNode: mockTextNode });

    mock$scope = <any>(new FakeScope());
    mock$scope['asset'] = mockAsset;
    spyOn(mock$scope, '$on');

    ctrl = new TextCtrl(mock$scope, mockAssetPipelineService, mockAssetService);
  });

  it('should initialize with the correct text node', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  it('should call deregister when destroyed', () => {
    expect(mock$scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));

    mock$scope.$on.calls.argsFor(0)[1]();

    expect(mockDeregister).toHaveBeenCalledWith();
  });

  describe('set data', () => {
    it('should update the asset data and save it', () => {
      let data = {};
      ctrl.data = data;
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockTextNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('get parsedData', () => {
    it('should return the correct data', done => {
      let textNodeResult = 'textNodeResult';
      mockTextNode.result = Promise.resolve(textNodeResult);

      ctrl.parsedData.promise
          .then(result => {
            expect(result).toEqual(textNodeResult);
            done();
          }, done.fail);
    });
  });

  describe('hasData', () => {
    let file = new File(FileTypes.TSV, 'a\nb');

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
