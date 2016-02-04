import TestBase from '../testbase';
TestBase.init();

import AssetNamePickerCtrl from './asset-name-picker-ctrl';
import FakeScope from '../testing/fake-scope';

describe('common.AssetNamePickerCtrl', () => {
  const ASSET_ID = 'assetId';

  let mockAssetPipelineService;
  let mockLabelNode;
  let ctrl;

  beforeEach(() => {
    mockLabelNode = {};

    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({ labelNode: mockLabelNode });

    let mockAsset = { id: ASSET_ID };
    let $scope = <any>(new FakeScope({ 'asset': mockAsset }));
    ctrl = new AssetNamePickerCtrl($scope, mockAssetPipelineService);
  });

  it('should get the correct asset pipeline', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('get searchResults', () => {
    it('should return promise that resoles with the correct results', done => {
      let result1 = 'result1';
      let result2 = 'result2';
      let searchText = 'searchText';
      let mockFuse = jasmine.createSpyObj('Fuse', ['search']);
      mockFuse.search.and.returnValue([
        { 'label': result1 },
        { 'label': result2 }
      ]);

      mockLabelNode.result = Promise.resolve({ index: mockFuse });

      ctrl.searchText = searchText;
      ctrl.searchResults
          .then(results => {
            expect(results).toEqual([result1, result2]);
            expect(mockFuse.search).toHaveBeenCalledWith(searchText);
            done();
          }, done.fail);
    });
  });

  describe('get selectedKey', () => {
    it('should return the value in ngModelCtrl', () => {
      let selectedKey = 'selectedKey';
      let ngModelCtrl = { $viewValue: selectedKey };
      ctrl.onLink(ngModelCtrl);

      expect(ctrl.selectedKey).toEqual(selectedKey);
    });

    it('should return empty string if the ngModelCtrl is not set', () => {
      expect(ctrl.selectedKey).toEqual('');
    });
  });

  describe('set selectedKey', () => {
    it('should set the view value on ngModelCtrl', () => {
      let key = 'key';

      let mockNgModelCtrl = jasmine.createSpyObj('NgModelCtrl', ['$setViewValue']);
      ctrl.onLink(mockNgModelCtrl);
      ctrl.selectedKey = key;

      expect(mockNgModelCtrl.$setViewValue).toHaveBeenCalledWith(key);
    });
  });
});
