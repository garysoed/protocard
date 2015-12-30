import TestBase from '../testbase';

import DriveDialogCtrl from './drive-dialog-ctrl';
import DriveDialogService from './drive-dialog-service';

describe('editor.DriveDialogService', () => {
  let mock$mdDialog;
  let service;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['show']);
    service = new DriveDialogService(mock$mdDialog);
  });

  describe('show', () => {
    it('should show the dialog', () => {
      let $event = {};
      service.show($event);
      expect(mock$mdDialog.show).toHaveBeenCalledWith(jasmine.objectContaining({
        controller: DriveDialogCtrl,
        targetEvent: $event
      }));
    });
  });
});
