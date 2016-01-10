import Cache from '../decorators/cache';
import NavigateService from './navigate-service';

export default class {
  private icon_: string;
  private navigateService_: NavigateService;
  private subview_: string;
  private text_: string;

  constructor($scope: angular.IScope, NavigateService: NavigateService) {
    this.icon_ = $scope['icon'];
    this.navigateService_ = NavigateService;
    this.subview_ = $scope['subview'];
    this.text_ = $scope['text'];

    $scope.$on('$routeChangeSuccess', this.onRouteUpdate_.bind(this));
    $scope.$on('$routeUpdate', this.onRouteUpdate_.bind(this));
  }

  private onRouteUpdate_() {
    Cache.clear(this);
  }

  @Cache
  get selectedCss(): string {
    let subview = this.navigateService_.getSubview();
    if (!subview) {
      return '';
    }

    let viewHierarchy = subview.split('.');
    let currentViewHierarchy = [];
    while (viewHierarchy.length > 0) {
      currentViewHierarchy.push(viewHierarchy.splice(0, 1));
      if (currentViewHierarchy.join('.') === this.subview_) {
        return 'selected';
      }
    }

    return '';
  }

  get icon(): string {
    return this.icon_;
  }

  get text(): string {
    return this.text_;
  }

  onClick() {
    this.navigateService_.toSubview(this.subview_);
  }
}
