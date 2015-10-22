import Asset from '../data/asset';

const __$mdDialog__ = Symbol('$mdDialog');
const __$scope__ = Symbol('$scope');

/**
 * Controller for the asset creation dialog.
 *
 * @class home.CreateAssetDialogCtrl
 */
export default class {

  /**
   * @constructor
   * @method constructor
   * @param {ng.$mdDialog} $mdDialog
   * @param {ng.Scope} $scope
   */
  constructor($mdDialog, $scope) {
    this[__$mdDialog__] = $mdDialog;
    this[__$scope__] = $scope;
  }

  /**
   * @method isValid
   * @return {Boolean} True iff the form is valid
   */
  isValid() {
    return !!(this[__$scope__].createForm && this[__$scope__].createForm.$valid);
  }

  /**
   * Handles event when the create button is clicked.
   *
   * @method onCreateClick
   */
  onCreateClick() {
    this[__$mdDialog__].hide(new Asset(this[__$scope__].name));
  }

  /**
   * Handles event when the cancel button is clicked.
   *
   * @method onCancelClick
   */
  onCancelClick() {
    this[__$mdDialog__].cancel();
  }
};
