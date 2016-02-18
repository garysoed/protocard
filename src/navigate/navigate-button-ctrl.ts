import Cache from '../decorator/cache';
import BaseDisposable from '../../node_modules/gs-tools/src/dispose/base-disposable';
import DisposableFunction from '../../node_modules/gs-tools/src/dispose/disposable-function';
import NavigateService from './navigate-service';


// TODO(gs): Base ctrl.
export default class NavigateButtonCtrl extends BaseDisposable {
  private $scope_: angular.IScope;
  private icon_: string;
  private navigateService_: NavigateService;
  private subview_: string;
  private text_: string;

  constructor($scope: angular.IScope, NavigateService: NavigateService) {
    super();
    this.$scope_ = $scope;
    this.icon_ = $scope['icon'];
    this.navigateService_ = NavigateService;
    this.subview_ = $scope['subview'];
    this.text_ = $scope['text'];

    this.addDisposable(
        new DisposableFunction(
            $scope.$on('$routeChangeSuccess', this.onRouteUpdate_.bind(this))),
        new DisposableFunction(
            $scope.$on('$routeUpdate', this.onRouteUpdate_.bind(this))));
  }

  private onRouteUpdate_(): void {
    Cache.clear(this);
  }

  get disabled(): boolean {
    return this.$scope_['disabled'];
  }

  get icon(): string {
    return this.icon_;
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

  get text(): string {
    return this.text_;
  }

  onClick(): void {
    if (!this.disabled) {
      this.navigateService_.toSubview(this.subview_);
    }
  }
}
