export default class ErrorDisplayCtrl {
  private $scope_: angular.IScope;

  constructor($scope: angular.IScope) {
    this.$scope_ = $scope;
  }

  get lastError(): any {
    return this.$scope_['error'].message;
  }
}
