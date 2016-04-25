export class ContextButtonCtrl {
  private $element_: angular.IAugmentedJQuery;
  private $transclude_: angular.ITranscludeFunction;
  private isOpen_: boolean;

  constructor($element: angular.IAugmentedJQuery, $transclude: angular.ITranscludeFunction) {
    this.isOpen_ = false;
    this.$element_ = $element;
    this.$transclude_ = $transclude;
  }

  $onInit(): void {
    this.$transclude_((clone: JQuery) => {
      this.$element_.find('ng-transclude').replaceWith(clone);
    });
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

export default angular
    .module('common.ContextButtonModule', [])
    .component('pcContextButton', {
      controller: ContextButtonCtrl,
      templateUrl: 'src/common/context-button.ng',
      transclude: true,
    });
