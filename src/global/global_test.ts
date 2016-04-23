import TestBase from '../testbase';
TestBase.init();

import {GlobalCtrl} from './global';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';


describe('global.GlobalCtrl', () => {
  let mockAssetPipelineService;
  let mockAssetService;
  let ctrl;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockAssetPipelineService = jasmine.createSpyObj('AssetPipelineService', ['getPipeline']);

    ctrl = new GlobalCtrl(mockAssetPipelineService, mockAssetService);
  });

  describe('$onInit', () => {
    it('should initialize globalsString to the value in the asset', () => {
      let assetId = 'assetId';
      let globalsString = 'globalsString';
      let mockAsset = {
        globalsString: globalsString,
        id: assetId,
      };
      ctrl.asset = mockAsset;

      let mockGlobalNode = jasmine.createSpyObj('GlobalNode', ['refresh']);
      mockAssetPipelineService.getPipeline.and.returnValue({ globalNode: mockGlobalNode });

      ctrl.$onInit();
      expect(ctrl.globalsString).toEqual(globalsString);
      expect(mockAssetPipelineService.getPipeline).toHaveBeenCalledWith(assetId);
      expect(ctrl['globalNode_']).toEqual(mockGlobalNode);
    });
  });

  describe('isValid', () => {
    beforeEach(() => {
      ctrl.asset = {};
      ctrl['globalNode_'] = jasmine.createSpyObj('GlobalNode', ['refresh']);
    });

    it('should return true if the globals string is non null', () => {
      ctrl.globalsString = 'blah';
      expect(ctrl.isValid()).toEqual(true);
    });

    it('should return false if the globals string is null', () => {
      ctrl.globalsString = null;
      expect(ctrl.isValid()).toEqual(false);
    });
  });

  describe('set globalsString', () => {
    let mockAsset;
    let mockGlobalNode;

    beforeEach(() => {
      mockAsset = Mocks.object('Asset');
      mockGlobalNode = jasmine.createSpyObj('GlobalNode', ['refresh']);
      ctrl.asset = mockAsset;
      ctrl['globalNode_'] = mockGlobalNode;
    });

    it('should update the asset and save it if set to non null', () => {
      let newValue = 'newValue';

      ctrl.globalsString = newValue;

      expect(ctrl.globalsString).toEqual(newValue);
      expect(mockAsset.globalsString).toEqual(newValue);
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
      expect(mockGlobalNode.refresh).toHaveBeenCalledWith();
    });

    it('should update the globalsString but not save it if null', () => {
      let oldValue = 'oldValue';
      mockAsset.globalsString = oldValue;

      ctrl.globalsString = null;

      expect(ctrl.globalsString).toEqual(null);
      expect(mockAsset.globalsString).toEqual(oldValue);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
      expect(mockGlobalNode.refresh).not.toHaveBeenCalled();
    });
  });
});
