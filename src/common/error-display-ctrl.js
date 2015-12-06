/**
 * @class common.ErrorDisplayCtrl
 */
export default class {
  /**
   * @constructor
   */
  constructor($scope) {
    this.$scope_ = $scope;
  }

  get lastError() {
    return this.$scope_['error'].message;
  }
}
