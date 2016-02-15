import Asset from '../model/asset';


/**
 * Controller for the asset creation dialog.
 */
export default class {

  private $mdDialog_: angular.material.IDialogService;
  private $scope_: angular.IScope;

  constructor($mdDialog: angular.material.IDialogService, $scope: angular.IScope) {
    this.$mdDialog_ = $mdDialog;
    this.$scope_ = $scope;
  }

  /**
   * @return True iff the form is valid
   */
  isValid(): boolean {
    return !!(this.$scope_['createForm'] && this.$scope_['createForm'].$valid);
  }

  /**
   * Handles event when the create button is clicked.
   */
  onCreateClick(): void {
    this.$mdDialog_.hide(new Asset(this.$scope_['name']));
  }

  /**
   * Handles event when the cancel button is clicked.
   */
  onCancelClick(): void {
    this.$mdDialog_.cancel();
  }
};
