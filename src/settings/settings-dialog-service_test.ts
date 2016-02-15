import TestBase from '../testbase';
TestBase.init();

import SettingsDialogService from './settings-dialog-service';

describe('settings.SettingsDialogService', () => {
  let mock$mdDialog;
  let service;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['show']);
    service = new SettingsDialogService(mock$mdDialog);
  });

  describe('show', () => {
    it('should show the dialog with the correct parameters', () => {
      let event = jasmine.createObj('event');
      let asset = jasmine.createObj('asset');

      service.show(event, asset);

      expect(mock$mdDialog.show).toHaveBeenCalledWith(jasmine.objectContaining({
        locals: {
          'asset': asset
        },
        targetEvent: event,
      }));
    });
  });
});
