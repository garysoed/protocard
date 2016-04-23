import TestBase from '../testbase';
TestBase.init();

import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import { HelperCtrl } from './helper';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';


describe('helper.HelperCtrl', () => {

  let mock$scope;
  let mockAssetPipelineService;
  let mockAssetService;
  let mockHelperNode;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockHelperNode = jasmine.createSpyObj('HelperNode', ['refresh']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toAsset']);
    mock$scope = FakeScope.create();

    mockAssetPipelineService.getPipeline.and.returnValue({ helperNode: mockHelperNode });

    ctrl = new HelperCtrl(
        mock$scope,
        mockAssetPipelineService,
        mockAssetService,
        mockNavigateService);
  });

  describe('$onInit', () => {
    it('should load the correct helper node', () => {
      let assetId = 'assetId';
      let mockAsset = Mocks.object('Asset');
      mockAsset.id = assetId;

      let mockHelperNode = Mocks.object('HelperNode');
      let mockPipeline = Mocks.object('Pipeline');
      mockPipeline.helperNode = mockHelperNode;

      mockAssetPipelineService.getPipeline.and.returnValue(mockPipeline);

      ctrl.asset = mockAsset;
      ctrl.$onInit();

      expect(ctrl['helperNode_']).toEqual(mockHelperNode);
      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
    });
  });

  describe('onChange', () => {
    it('should update and save the asset', () => {
      let mockAsset = Mocks.object('Asset');
      let helper = jasmine.createObj('Helper');
      let oldName = 'oldName';
      let newName = 'newName';
      mockAsset.helpers = { [oldName]: helper };

      let mockHelperNode = jasmine.createSpyObj('HelperNode', ['refresh']);
      mockHelperNode.result = Promise.resolve();

      spyOn(Cache, 'clear');

      ctrl['helperNode_'] = mockHelperNode;
      ctrl.asset = mockAsset;
      ctrl.onChange(oldName, newName);

      expect(mockAsset.helpers).toEqual({ [newName]: helper });
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(mockHelperNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('onDelete', () => {
    it('should delete the helper and save the asset', () => {
      let mockAsset = Mocks.object('Asset');
      let helper = jasmine.createObj('Helper');
      let name = 'name';
      mockAsset.helpers = { [name]: helper };

      let mockHelperNode = jasmine.createSpyObj('HelperNode', ['refresh']);
      mockHelperNode.result = Promise.resolve();

      spyOn(Cache, 'clear');

      ctrl['helperNode_'] = mockHelperNode;
      ctrl.asset = mockAsset;
      ctrl.onDelete(name);

      expect(mockAsset.helpers).toEqual({});
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(mockHelperNode.refresh).toHaveBeenCalledWith();
    });
  });

  describe('onEdit', () => {
    it('should navigate to the helper editor', () => {
      let id = 'id';
      let mockAsset = Mocks.object('Asset');
      mockAsset.id = id;

      let name = 'name';

      ctrl.asset = mockAsset;
      ctrl.onEdit(name);

      expect(mockNavigateService.toAsset).toHaveBeenCalledWith(id, 'helper.editor', name);
    });
  });

  describe('get helpers', () => {
    it('should return provider which resolves with the correct value', (done: jasmine.IDoneFn) => {
      let result = jasmine.createObj('helperResult');
      let mockHelperNode = Mocks.object('HelperNode');
      mockHelperNode.result = Promise.resolve(result);

      ctrl['helperNode_'] = mockHelperNode;

      ctrl.helpers.promise
          .then((helpers: any) => {
            expect(helpers).toEqual(result);
            done();
          }, done.fail);
    });

    it('should cache the provider', () => {
      let mockHelperNode = Mocks.object('HelperNode');
      mockHelperNode.result = Promise.resolve();

      ctrl['helperNode_'] = mockHelperNode;
      expect(ctrl.helpers).toBe(ctrl.helpers);
    });
  });

  describe('onAddClick', () => {
    it('should create a new helper, add it to the asset, and save it', () => {
      let mockAsset = Mocks.object('Asset');
      mockAsset.helpers = {};

      let mockHelperNode = jasmine.createSpyObj('HelperNode', ['refresh']);
      mockHelperNode.result = Promise.resolve();

      spyOn(Cache, 'clear');

      ctrl.asset = mockAsset;
      ctrl['helperNode_'] = mockHelperNode;
      ctrl.onAddClick();

      expect(Object.keys(mockAsset.helpers).length).toEqual(1);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(Cache.clear).toHaveBeenCalledWith(ctrl);
      expect(mockHelperNode.refresh).toHaveBeenCalledWith();
    });
  });
});
