import TestBase from '../testbase';
TestBase.init();

import { AssetNamePickerCtrl } from './asset-name-picker';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';

describe('common.AssetNamePickerCtrl', () => {
  const ASSET_ID = 'assetId';

  let mockAssetPipelineService;
  let mockLabelNode;
  let mockOnBlur;
  let mockOnFocus;
  let ctrl;

  beforeEach(() => {
    mockLabelNode = {};

    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetPipelineService.getPipeline.and.returnValue({ labelNode: mockLabelNode });

    let mockAsset = { id: ASSET_ID };
    mockOnBlur = jasmine.createSpy('onBlur');
    mockOnFocus = jasmine.createSpy('onFocus');
    let $scope = FakeScope.create();
    $scope['asset'] = mockAsset;
    $scope['onBlur'] = mockOnBlur;
    $scope['onFocus'] = mockOnFocus;

    ctrl = new AssetNamePickerCtrl($scope, mockAssetPipelineService);
  });

  it('should get the correct asset pipeline', () => {
    expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(ASSET_ID);
  });

  describe('onLink', () => {
    it('should listen to focus and blur events', () => {
      let mockInputEl = jasmine.createSpyObj('InputEl', ['addEventListener']);
      let mockElement = jasmine.createSpyObj('Element', ['querySelector']);
      mockElement.querySelector.and.returnValue(mockInputEl);

      let setTimeoutSpy = spyOn(window, 'setTimeout');

      ctrl.onLink(mockElement, jasmine.createObj('NgModelCtrl'));

      expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 0);

      setTimeoutSpy.calls.argsFor(0)[0]();

      expect(mockElement.querySelector).toHaveBeenCalledWith('input');
      expect(mockInputEl.addEventListener).toHaveBeenCalledWith('focus', jasmine.any(Function));
      expect(mockInputEl.addEventListener).toHaveBeenCalledWith('blur', jasmine.any(Function));

      mockInputEl.addEventListener.calls.argsFor(0)[1]();
      expect(mockOnFocus).toHaveBeenCalledWith();

      mockInputEl.addEventListener.calls.argsFor(1)[1]();
      expect(mockOnBlur).toHaveBeenCalledWith();
    });

    it('should not crash when onFocus and onBlur are not specified', () => {
      let mockInputEl = jasmine.createSpyObj('InputEl', ['addEventListener']);
      let mockElement = jasmine.createSpyObj('Element', ['querySelector']);
      mockElement.querySelector.and.returnValue(mockInputEl);

      let setTimeoutSpy = spyOn(window, 'setTimeout');

      let $scope = FakeScope.create();
      $scope['asset'] = jasmine.createObj('asset');
      ctrl = new AssetNamePickerCtrl($scope, mockAssetPipelineService);
      ctrl.onLink(mockElement, jasmine.createObj('NgModelCtrl'));

      setTimeoutSpy.calls.argsFor(0)[0]();
      mockInputEl.addEventListener.calls.argsFor(0)[1]();
      mockInputEl.addEventListener.calls.argsFor(1)[1]();
    });
  });

  describe('get searchResults', () => {
    it('should return promise that resoles with the correct results', (done: jasmine.IDoneFn) => {
      let result1 = 'result1';
      let result2 = 'result2';
      let searchText = 'searchText';
      let mockFuse = jasmine.createSpyObj('Fuse', ['search']);
      mockFuse.search.and.returnValue([
        { 'label': result1 },
        { 'label': result2 },
      ]);

      mockLabelNode.result = Promise.resolve({ index: mockFuse });

      ctrl.searchText = searchText;
      ctrl.searchResults
          .then((results: any) => {
            expect(results).toEqual([result1, result2]);
            expect(mockFuse.search).toHaveBeenCalledWith(searchText);
            done();
          }, done.fail);
    });
  });

  describe('get selectedKey', () => {
    beforeEach(() => {
      spyOn(window, 'setTimeout');
    });

    it('should return the value in ngModelCtrl', () => {
      let selectedKey = 'selectedKey';
      let ngModelCtrl = { $viewValue: selectedKey };
      ctrl.onLink(jasmine.createObj('Element'), ngModelCtrl);

      expect(ctrl.selectedKey).toEqual(selectedKey);
    });

    it('should return empty string if the ngModelCtrl is not set', () => {
      expect(ctrl.selectedKey).toEqual('');
    });
  });

  describe('set selectedKey', () => {
    beforeEach(() => {
      spyOn(window, 'setTimeout');
    });

    it('should set the view value on ngModelCtrl', () => {
      let key = 'key';

      let mockNgModelCtrl = jasmine.createSpyObj('NgModelCtrl', ['$setViewValue']);
      ctrl.onLink(jasmine.createObj('Element'), mockNgModelCtrl);
      ctrl.selectedKey = key;

      expect(mockNgModelCtrl.$setViewValue).toHaveBeenCalledWith(key);
    });
  });
});
