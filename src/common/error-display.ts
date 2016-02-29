export class ErrorDisplayCtrl {
  private $scope_: angular.IScope;

  constructor($scope: angular.IScope) {
    this.$scope_ = $scope;
  }

  get lastError(): any {
    return this.$scope_['error'].message;
  }
}

export default angular
    .module('common.ErrorDisplayModule', [])
    .directive('pcErrorDisplay', () => {
      return {
        controller: ErrorDisplayCtrl,
        controllerAs: 'ctrl',
        restrict: 'E',
        scope: {
          'error': '='
        },
        templateUrl: 'src/common/error-display.ng',
      };
    });
