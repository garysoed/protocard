import TestBase from '../testbase';
TestBase.init();

import { PartialItemCtrl } from './partial-item';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';


describe('partial.PartialItemCtrl', () => {
  let mockAssetService;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toAsset']);
    ctrl = new PartialItemCtrl(mockAssetService, mockNavigateService);
  });

  describe('onDeleteClick', () => {
    it('should delete the partial and save the asset', () => {
      let initName = 'initName';
      let mockAsset = Mocks.object('Asset');
      mockAsset.partials = { [initName]: Mocks.object('Partial') };

      ctrl.initName = initName;
      ctrl.asset = mockAsset;
      ctrl.onDeleteClick();
      expect(mockAsset.partials).toEqual({});
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });
  });

  describe('onEditClick', () => {
    it('should call navigate service', () => {
      let initName = 'initName';
      let mockAsset = Mocks.object('Asset');
      let id = 'assetId';
      mockAsset.id = id;

      ctrl.initName = initName;
      ctrl.asset = mockAsset;
      ctrl.onEditClick();

      expect(mockNavigateService.toAsset).toHaveBeenCalledWith(id, 'partial.editor', initName);
    });
  });

  describe('set name', () => {
    let mockAsset;

    beforeEach(() => {
      mockAsset = Mocks.object('Asset');
      ctrl.asset = mockAsset;
    });

    it('should rename the asset partial if the new name is unique', () => {
      let oldName = 'oldName';
      let mockEditedPartial = Mocks.object('EditedPartial');
      mockAsset.partials = { [oldName]: mockEditedPartial };

      let newName = 'newName';
      ctrl.initName = oldName;
      ctrl.name = newName;

      expect(mockAsset.partials).toEqual({ [newName]: mockEditedPartial });
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });

    it('should do nothing if the new name is not unique', () => {
      let oldName = 'oldName';
      let newName = 'newName';
      let initPartials = {
        [oldName]: 'currentPartial',
        [newName]: 'otherPartial',
      };
      mockAsset.partials = initPartials;

      ctrl.initName = oldName;
      ctrl.name = newName;

      expect(mockAsset.partials).toEqual(initPartials);
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });
});
