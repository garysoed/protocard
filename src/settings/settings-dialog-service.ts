import Asset from '../model/asset';
import SettingsDialogCtrl from './settings-dialog-ctrl';

export default class {
  private $mdDialog_: angular.material.IDialogService;

  constructor($mdDialog: angular.material.IDialogService) {
    this.$mdDialog_ = $mdDialog;
  }

  show($event: MouseEvent, asset: Asset): void {
    this.$mdDialog_.show({
      controller: SettingsDialogCtrl,
      controllerAs: 'ctrl',
      locals: {
        'asset': asset
      },
      targetEvent: $event,
      templateUrl: 'src/settings/settings-dialog.ng',
    });
  }
};
