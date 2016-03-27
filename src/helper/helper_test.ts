import TestBase from '../testbase';
TestBase.init();

import { Events as HelperItemEvents } from './helper-item';
import FakeScope from '../testing/fake-scope';
import { HelperCtrl } from './helper';

describe('helper.HelperCtrl', () => {
  const ASSET_ID = 'assetId';

  let asset;
  let mock$scope;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockHelperNode;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    asset = { id: ASSET_ID };
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockHelperNode = jasmine.createSpyObj('HelperNode', ['refresh']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toAsset']);
    mock$scope = new FakeScope({ 'asset': asset });

    mockAssetPipelineService.getPipeline.and.returnValue({ helperNode: mockHelperNode });

    spyOn(mock$scope, '$on');
    ctrl = new HelperCtrl(
        mock$scope,
        mockAssetPipelineService,
        mockAssetService,
        mockNavigateService);
  });

  it('should update and save the asset on HelperItem CHANGED event', () => {
    let helper = jasmine.createObj('Helper');
    let oldName = 'oldName';
    let newName = 'newName';
    asset.helpers = { [oldName]: helper };

    mockHelperNode.result = Promise.resolve();
    let oldProvider = ctrl.helpers;

    expect(mock$scope.$on).toHaveBeenCalledWith(HelperItemEvents.CHANGED, jasmine.any(Function));
    mock$scope.$on.calls.argsFor(0)[1]({}, oldName, newName);

    expect(asset.helpers).toEqual({ [newName]: helper });
    expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
    expect(ctrl.helpers).not.toBe(oldProvider);
    expect(mockHelperNode.refresh).toHaveBeenCalledWith();
  });

  it('should delete the helper and save the asset on HelperItem DELETED event', () => {
    let helper = jasmine.createObj('Helper');
    let name = 'name';
    asset.helpers = { [name]: helper };

    mockHelperNode.result = Promise.resolve();
    let oldProvider = ctrl.helpers;

    expect(mock$scope.$on).toHaveBeenCalledWith(HelperItemEvents.DELETED, jasmine.any(Function));
    mock$scope.$on.calls.argsFor(1)[1]({}, name);

    expect(asset.helpers).toEqual({});
    expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
    expect(ctrl.helpers).not.toBe(oldProvider);
    expect(mockHelperNode.refresh).toHaveBeenCalledWith();
  });

  it('should navigate to the helper editor on HelperItem EDITED event', () => {
    let id = 'id';
    let name = 'name';
    asset.id = id;

    expect(mock$scope.$on).toHaveBeenCalledWith(HelperItemEvents.EDITED, jasmine.any(Function));
    mock$scope.$on.calls.argsFor(2)[1]({}, name);

    expect(mockNavigateService.toAsset).toHaveBeenCalledWith(id, 'helper.editor', name);
  });

  describe('get helpers', () => {
    it('should return provider which resolves with the correct value', (done: jasmine.IDoneFn) => {
      let result = jasmine.createObj('helperResult');
      mockHelperNode.result = Promise.resolve(result);

      ctrl.helpers.promise
          .then((helpers: any) => {
            expect(helpers).toEqual(result);
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      mockHelperNode.result = Promise.resolve();
      expect(ctrl.helpers).toBe(ctrl.helpers);
    });
  });

  describe('onAddClick', () => {
    it('should create a new helper, add it to the asset, and save it', () => {
      asset.helpers = {};

      mockHelperNode.result = Promise.resolve();
      let oldProvider = ctrl.helpers;

      ctrl.onAddClick();

      expect(Object.keys(asset.helpers).length).toEqual(1);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
      expect(ctrl.helpers).not.toBe(oldProvider);
      expect(mockHelperNode.refresh).toHaveBeenCalledWith();
    });
  });
});
