export class ContextButtonCtrl {
  private isOpen_: boolean;

  constructor() {
    this.isOpen_ = false;
  }

  get isOpen(): boolean {
    return this.isOpen_;
  }

  set isOpen(open: boolean) {
    this.isOpen_ = open;
  }

  onFabMouseEnter(): void {
    this.isOpen_ = true;
  }

  onFabMouseLeave(): void {
    this.isOpen_ = false;
  }
}

function link(
    scope: angular.IScope,
    element: JQuery,
    attrs: any,
    ctrl: any,
    transclude: angular.ITranscludeFunction): void {
  transclude((clone: JQuery) => {
    element.find('ng-transclude').replaceWith(clone);
  });
}

export default angular
    .module('common.ContextButtonModule', [])
    .directive('pcContextButton', () => {

      return {
        controller: ContextButtonCtrl,
        controllerAs: 'ctrl',
        link: link,
        restrict: 'E',
        scope: {
        },
        templateUrl: 'src/common/context-button.ng',
        transclude: true,
      };
    });
