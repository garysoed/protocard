import Asset from '../model/asset';


/**
 * Controller for the asset creation dialog.
 */
export class CreateAssetDialogCtrl {

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


/**
 * Manages the create asset dialog.
 *
 * @class home.CreateAssetDialogService
 */
export class CreateAssetDialogService {
  private $mdDialog_: angular.material.IDialogService;

  constructor($mdDialog: angular.material.IDialogService) {
    this.$mdDialog_ = $mdDialog;
  }

  /**
   * Shows the create asset dialog.
   *
   * @method show
   * @param $event Angular event that triggered this event.
   * @return Promise that will be resolved with the newly created asset, or rejected if
   *    asset creation was cancelled.
   */
  show($event: MouseEvent): angular.IPromise<any> {
    return this.$mdDialog_.show({
      controller: CreateAssetDialogCtrl,
      controllerAs: 'ctrl',
      targetEvent: $event,
      templateUrl: 'src/home/create-asset-dialog.ng',
    });
  }
};

export default angular
    .module('home.CreateAssetDialogModule', [])
    .service('CreateAssetDialogService', CreateAssetDialogService);
