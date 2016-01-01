import NavigateService from './navigate-service';

export default class {
  private navigateService_: NavigateService;
  private subview_: string;
  private text_: string;

  constructor($scope: angular.IScope, NavigateService: NavigateService) {
    this.navigateService_ = NavigateService;
    this.subview_ = $scope['subview'];
    this.text_ = $scope['text'];
  }

  get selectedCss(): string {
    // TODO(gs): Cache
    let viewHierarchy = this.navigateService_.getSubview().split('.');
    let currentViewHierarchy = [];
    while (viewHierarchy.length > 0) {
      currentViewHierarchy.push(viewHierarchy.splice(0, 1));
      if (currentViewHierarchy.join('.') === this.subview_) {
        return 'selected';
      }
    }

    return '';
  }

  get text(): string {
    return this.text_;
  }

  onClick() {
    this.navigateService_.toSubview(this.subview_);
  }
}
