import TestBase from '../testbase';
TestBase.init();

import { AssetNamePickerCtrl } from './asset-name-picker';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import ListenableElement, { EventType as DomEventType }
    from '../../node_modules/gs-tools/src/event/listenable-element';
import Log from '../../node_modules/gs-tools/src/log';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';
import WaitUntil from '../../node_modules/gs-tools/src/async/wait-until';


describe('common.AssetNamePickerCtrl', () => {
  const ASSET_ID = 'assetId';

  let mockAssetPipelineService;
  let mockElement;
  let mockLabelNode;
  let mockOnBlur;
  let mockOnFocus;
  let ctrl;

  beforeEach(() => {
    mockElement = Mocks.element({});
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

    ctrl = new AssetNamePickerCtrl(<any> [mockElement], $scope, mockAssetPipelineService);
    TestDispose.add(ctrl);
  });

  describe('$onChanges', () => {
    it('should update the label node on asset change', () => {
      let assetId = 'assetId';
      let newAsset = { id: assetId };
      let mockLabelNode = Mocks.object('LabelNode');
      let pipeline = { labelNode: mockLabelNode };
      mockAssetPipelineService.getPipeline.and.returnValue(pipeline);

      ctrl.$onChanges({ 'asset': { currentValue: newAsset } });
      expect(ctrl['labelNode_']).toEqual(mockLabelNode);
      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
    });
  });

  describe('$onInit', () => {
    it('should initialize correctly', (done: any) => {
      let assetId = 'assetId';
      let asset = { id: assetId };
      let mockLabelNode = Mocks.object('LabelNode');
      let pipeline = { labelNode: mockLabelNode };
      mockAssetPipelineService.getPipeline.and.returnValue(pipeline);

      let mockInputEl = Mocks.object('InputEl');
      spyOn(mockElement, 'querySelector').and.returnValue(mockInputEl);

      let mockListenableEl = Mocks.listenable('ListenableEl');
      spyOn(mockListenableEl, 'on').and.callThrough();
      spyOn(ListenableElement, 'of').and.returnValue(mockListenableEl);

      spyOn(ctrl, 'onBlur_');
      spyOn(ctrl, 'onFocus_');


      let mockWaitUntil = Mocks.disposable('WaitUntil');
      let spyWaitUntil = spyOn(WaitUntil, 'newInstance').and.returnValue(mockWaitUntil);
      mockWaitUntil['promise'] = Promise.resolve();
      ctrl.asset = asset;
      ctrl.ngModel = Mocks.object('ngModel');
      ctrl.$onInit()
          .then(() => {
            expect(ctrl['labelNode_']).toEqual(mockLabelNode);
            expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);

            expect(mockListenableEl.on)
                .toHaveBeenCalledWith(DomEventType.BLUR, jasmine.any(Function));
            expect(mockListenableEl.on)
                .toHaveBeenCalledWith(DomEventType.FOCUS, jasmine.any(Function));

            mockListenableEl.on.calls
                .firstArgsMatching(DomEventType.BLUR, jasmine.any(Function))[1]();
            expect(ctrl['onBlur_']).toHaveBeenCalledWith();

            mockListenableEl.on.calls
                .firstArgsMatching(DomEventType.FOCUS, jasmine.any(Function))[1]();
            expect(ctrl['onFocus_']).toHaveBeenCalledWith();

            expect(mockElement.querySelector).toHaveBeenCalledWith('input');
            expect(ListenableElement.of).toHaveBeenCalledWith(mockInputEl);

            // Check the WaitUntil initialization.
            let checkFn = spyWaitUntil.calls.argsFor(0)[0];

            mockElement.querySelector.and.returnValue(mockInputEl);
            expect(checkFn()).toEqual(true);
            expect(mockElement.querySelector).toHaveBeenCalledWith('input');

            mockElement.querySelector.and.returnValue(null);
            expect(checkFn()).toEqual(false);
            expect(mockElement.querySelector).toHaveBeenCalledWith('input');
            done();
          }, done.fail);
    });

    it('should throw error if asset is not specified', () => {
      expect(() => {
        ctrl.$onInit();
      }).toThrowError(/asset not given/);
    });

    it('should log error if the input element cannot be found', (done: any) => {
      mockAssetPipelineService.getPipeline.and
          .returnValue({ labelNode: Mocks.object('LabelNode') });

      spyOn(Log, 'error');

      let mockWaitUntil = Mocks.disposable('WaitUntil');
      spyOn(WaitUntil, 'newInstance').and.returnValue(mockWaitUntil);
      mockWaitUntil['promise'] = Promise.reject('error');
      ctrl.asset = { id: 'assetId' };
      ctrl.ngModel = Mocks.object('ngModel');
      ctrl.$onInit()
          .then(() => {
            expect(Log.error).toHaveBeenCalledWith(
                jasmine.any(Object),
                jasmine.stringMatching(/waiting for input element/));
            done();
          }, done.fail);
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
      ctrl['labelNode_'] = mockLabelNode;

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
      ctrl.ngModel = ngModelCtrl;
      expect(ctrl.selectedKey).toEqual(selectedKey);
    });
  });

  describe('set selectedKey', () => {
    beforeEach(() => {
      spyOn(window, 'setTimeout');
    });

    it('should set the view value on ngModelCtrl', () => {
      let key = 'key';

      let mockNgModelCtrl = jasmine.createSpyObj('NgModelCtrl', ['$setViewValue']);
      ctrl.ngModel = mockNgModelCtrl;
      ctrl.selectedKey = key;

      expect(mockNgModelCtrl.$setViewValue).toHaveBeenCalledWith(key);
    });
  });
});
