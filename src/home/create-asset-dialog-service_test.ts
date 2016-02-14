import TestBase from '../testbase';
TestBase.init();

import CreateAssetDialogService from './create-asset-dialog-service';

describe('home.CreateAssetDialogService', () => {
  let mock$mdDialog;
  let service;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['show']);
    service = new CreateAssetDialogService(mock$mdDialog);
  });

  describe('show', () => {
    it('should call the $mdDialog service', () => {
      let $event = {};
      let promise = Promise.resolve();
      mock$mdDialog.show.and.returnValue(promise);

      expect(service.show($event)).toEqual(promise);
      expect(mock$mdDialog.show).toHaveBeenCalledWith(jasmine.objectContaining({
        targetEvent: $event
      }));
    });
  });
});
