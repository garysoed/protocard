import TestBase from '../testbase';

import Asset from '../data/asset';
import SettingsCardCtrl from './settings-card-ctrl';

describe('asset.SettingsCardCtrl', () => {
  let asset;
  let mockAssetService;
  let mockEditGlobalsDialogService;
  let ctrl;

  beforeEach(() => {
    asset = new Asset('name');
    mockAssetService = jasmine.createSpyObj('AssetService', ['saveAsset']);
    mockEditGlobalsDialogService = jasmine.createSpyObj('EditGlobalsDialogService', ['show']);
    ctrl = new SettingsCardCtrl({ asset: asset }, mockAssetService, mockEditGlobalsDialogService);
  });

  describe('onGlobalsEditClick', () => {
    it('should display the edit globals dialog and saves the asset when the dialog is hidden', done => {
      let $event = {};
      let oldGlobals = asset.globals;
      let newGlobals = { a: 'newA' };
      let promise = Promise.resolve(newGlobals);

      mockEditGlobalsDialogService.show.and.returnValue(promise);
      ctrl.onGlobalsEditClick($event)
          .then(() => {
            expect(mockEditGlobalsDialogService.show).toHaveBeenCalledWith($event, oldGlobals);
            expect(asset.globals).toEqual(newGlobals);
            expect(mockAssetService.saveAsset).toHaveBeenCalledWith(asset);
            done();
          })
          .catch(done.fail);
    });
  });
});
