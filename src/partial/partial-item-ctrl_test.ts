import TestBase from '../testbase';
TestBase.init();

import PartialItemCtrl from './partial-item-ctrl';

describe('partial.PartialItemCtrl', () => {
  const NAME = 'name';
  const EDITED_PARTIAL = 'editedPartial';
  let mockAsset;
  let mockAssetService;
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    mockAsset = {
      partials: {
        [NAME]: EDITED_PARTIAL
      },
    };
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toAsset']);
    ctrl = new PartialItemCtrl(
        jasmine.cast<angular.IScope>({ 'asset': mockAsset, 'name': NAME }),
        mockAssetService,
        mockNavigateService);
  });

  describe('onDeleteClick', () => {
    it('should delete the partial and save the asset', () => {
      ctrl.onDeleteClick();
      expect(mockAsset.partials).toEqual({});
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });
  });

  describe('onEditClick', () => {
    it('should call navigate service', () => {
      let id = 'assetId';
      mockAsset.id = id;
      ctrl.onEditClick();

      expect(mockNavigateService.toAsset).toHaveBeenCalledWith(id, 'partial.editor', NAME);
    });
  });

  describe('set name', () => {
    it('should rename the asset partial if the new name is unique', () => {
      let newName = 'newName';
      ctrl.name = newName;

      expect(mockAsset.partials).toEqual({ [newName]: EDITED_PARTIAL });
      expect(mockAssetService.saveAsset).toHaveBeenCalledWith(mockAsset);
    });

    it('should do nothing if the new name is not unique', () => {
      let newName = 'newName';
      mockAsset.partials[newName] = 'otherPartial';
      ctrl.name = newName;

      expect(mockAsset.partials).toEqual(jasmine.objectContaining({
        [NAME]: EDITED_PARTIAL
      }));
      expect(mockAssetService.saveAsset).not.toHaveBeenCalled();
    });
  });
});
