/**
 * @fileoverview Controller for the previewable code editor.
 */
export default class {
  private language_: string;
  private ngModelCtrl_: angular.INgModelController;

  constructor($scope: angular.IScope) {
    this.language_ = $scope['language'];
    this.ngModelCtrl_ = null;
  }

  get codeString(): string {
    return this.ngModelCtrl_.$viewValue;
  }
  set codeString(newCodeString: string) {
    this.ngModelCtrl_.$setViewValue(newCodeString);
  }

  get language(): string {
    return this.language_;
  }

  onLink(ngModelCtrl: angular.INgModelController): void {
    this.ngModelCtrl_ = ngModelCtrl;
  }
};
